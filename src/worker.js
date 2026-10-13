/* NorthB&B — Cloudflare Worker
 * Serves the static site with strict security headers, and handles form
 * submissions (host signup, contact, newsletter) with rate limiting and
 * input sanitisation. No secrets in source — see wrangler.toml / `wrangler secret`.
 */
import { JSONLD_HASHES } from "./generated-csp.js";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
};

function cspHeader() {
  const scriptHashes = JSONLD_HASHES.map((h) => `'${h}'`).join(" ");
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function withSecurity(resp) {
  const h = new Headers(resp.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) h.set(k, v);
  h.set("Content-Security-Policy", cspHeader());
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: h });
}

/* ---------- helpers ---------- */
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders },
  });
}

function clean(value, max = 500) {
  if (value == null) return "";
  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, " ") // strip control chars
    .replace(/[<>]/g, "")                   // defang angle brackets
    .trim()
    .slice(0, max);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

function cacheFor(pathname) {
  if (/\.(woff2|woff|ttf|otf)$/i.test(pathname)) return "public, max-age=31536000, immutable";
  if (/\.(webp|avif|png|jpe?g|svg|ico|gif)$/i.test(pathname)) return "public, max-age=2592000";
  if (/\.(css|js|mjs)$/i.test(pathname)) return "public, max-age=31536000, immutable"; // versioned via ?v=hash
  if (/\.(json|xml|txt|webmanifest)$/i.test(pathname)) return "public, max-age=3600";
  return "public, max-age=600"; // HTML documents
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "0.0.0.0";
}

/* Fixed-window rate limit: max N submissions per IP per hour. */
async function rateLimited(env, ip, limit = 5) {
  if (!env.NB_KV) return false; // if KV not bound (e.g. preview), don't block
  const bucket = Math.floor(Date.now() / 3_600_000);
  const key = `rl:${ip}:${bucket}`;
  const current = parseInt((await env.NB_KV.get(key)) || "0", 10);
  if (current >= limit) return true;
  await env.NB_KV.put(key, String(current + 1), { expirationTtl: 3700 });
  return false;
}

async function storeLead(env, type, data) {
  if (!env.NB_KV) return;
  try {
    await env.NB_KV.put(`lead:${type}:${Date.now()}:${crypto.randomUUID()}`, JSON.stringify(data), {
      expirationTtl: 60 * 60 * 24 * 90, // keep 90 days
    });
  } catch (e) {
    console.error("storeLead failed", e);
  }
}

async function notifyEmail(env, subject, lines) {
  if (!env.RESEND_API_KEY) return; // email optional until configured
  try {
    const body = {
      from: "NorthB&B site <notifications@northbnb.com>",
      to: [env.LEAD_NOTIFY_EMAIL || "info@northbnb.com"],
      subject,
      text: lines.join("\n"),
    };
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) console.error("email send failed", r.status);
  } catch (e) {
    console.error("notifyEmail failed", e);
  }
}

/* ---------- form handlers ---------- */
const PHOTO_MAX = 12;
const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

/* Sniff the real image type from the first bytes; never trust the client's Content-Type. */
function imageExt(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "webp";
  return null;
}

/* Optional listing photos go to R2 under host-leads/<leadId>/. Without the binding they are skipped. */
async function storePhotos(env, leadId, files) {
  const keys = [];
  if (!env.NB_PHOTOS) return { keys, skipped: files.length };
  let i = 0;
  for (const f of files.slice(0, PHOTO_MAX)) {
    if (typeof f === "string" || !f || f.size === 0 || f.size > PHOTO_MAX_BYTES) continue;
    const buf = await f.arrayBuffer();
    const ext = imageExt(new Uint8Array(buf, 0, Math.min(12, buf.byteLength)));
    if (!ext) continue;
    const key = `host-leads/${leadId}/${String(++i).padStart(2, "0")}.${ext}`;
    await env.NB_PHOTOS.put(key, buf, { httpMetadata: { contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}` } });
    keys.push(key);
  }
  return { keys, skipped: 0 };
}

async function handleHostSignup(form, env) {
  const all = (k) => (typeof form.getAll === "function" ? form.getAll(k) : [].concat(form.get(k) ?? []));
  const coord = (k, lo, hi) => {
    const n = parseFloat(clean(form.get(k), 20));
    return Number.isFinite(n) && n >= lo && n <= hi ? String(Math.round(n * 1e5) / 1e5) : "";
  };
  const count = (k, max) => {
    const n = parseInt(clean(form.get(k), 4), 10);
    return Number.isFinite(n) && n >= 0 && n <= max ? String(n) : "";
  };
  const d = {
    property_type: clean(form.get("property_type"), 40),
    town: clean(form.get("town"), 80),
    lat: coord("lat", 41, 44),
    lon: coord("lon", 18, 21),
    guests: count("guests", 50),
    bedrooms: count("bedrooms", 99),
    beds: count("beds", 99),
    bathrooms: count("bathrooms", 50),
    amenities: all("amenities").map((a) => clean(a, 40)).filter(Boolean).slice(0, 30),
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 254),
    phone: clean(form.get("phone"), 40),
    language: clean(form.get("language"), 40),
    property_name: clean(form.get("property_name"), 120),
    payout: clean(form.get("payout"), 40),
    notes: clean(form.get("notes"), 2000),
    consent: clean(form.get("consent"), 10),
  };
  if (!d.property_type || !d.town || !d.property_name || !d.name || !d.phone || !isEmail(d.email) || !d.payout || d.consent !== "yes") {
    return json({ ok: false, message: "Please complete the required fields and accept the terms." }, 422);
  }
  const leadId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const photos = await storePhotos(env, leadId, all("photos"));
  d.photos = photos.keys;
  d.submittedAt = new Date().toISOString();
  await storeLead(env, "host", d);
  const basics = [d.guests && `${d.guests} guests`, d.bedrooms && `${d.bedrooms} bedrooms`, d.beds && `${d.beds} beds`, d.bathrooms && `${d.bathrooms} bathrooms`].filter(Boolean).join(", ");
  await notifyEmail(env, `New host lead: ${d.property_type} in ${d.town}`, [
    `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone}`,
    `Property: ${d.property_type}${d.property_name ? " | " + d.property_name : ""}`,
    `Town: ${d.town}${d.lat && d.lon ? ` (https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lon}#map=14/${d.lat}/${d.lon})` : ""}`, `Basics: ${basics || "-"}`,
    `Amenities: ${d.amenities.join(", ") || "-"}`,
    `Photos: ${d.photos.length ? d.photos.length + " in R2 under host-leads/" + leadId + "/" : photos.skipped ? photos.skipped + " sent but not stored (R2 not configured)" : "-"}`,
    `Payout: ${d.payout}`, `Language: ${d.language || "-"}`,
    `Notes: ${d.notes || "-"}`, `At: ${d.submittedAt}`,
  ]);
  return json({ ok: true, message: "Thanks, we've got your details." });
}

async function handleContact(form, env) {
  const d = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 254),
    subject: clean(form.get("subject"), 150),
    message: clean(form.get("message"), 3000),
  };
  if (!d.name || !isEmail(d.email) || !d.message) {
    return json({ ok: false, message: "Please add your name, a valid email and a message." }, 422);
  }
  d.submittedAt = new Date().toISOString();
  await storeLead(env, "contact", d);
  await notifyEmail(env, `Contact form: ${d.subject || "(no subject)"}`, [
    `Name: ${d.name}`, `Email: ${d.email}`, `Subject: ${d.subject || "-"}`, ``, d.message, ``, `At: ${d.submittedAt}`,
  ]);
  return json({ ok: true, message: "Thanks for reaching out. We'll reply by email soon." });
}

async function handleNewsletter(form, env) {
  const email = clean(form.get("email"), 254);
  if (!isEmail(email)) return json({ ok: false, message: "Please enter a valid email address." }, 422);
  await storeLead(env, "newsletter", { email, submittedAt: new Date().toISOString() });
  return json({ ok: true, message: "You're subscribed. Thank you." });
}

/* ---------- place search for the host flow ----------
   Photon (OpenStreetMap data) is built for type-ahead; Nominatim's public instance forbids it.
   We proxy it so the browser only ever talks to our origin (CSP connect-src 'self'), keep the
   results to Montenegro, cache them, and rate limit per IP. */
const PLACE_LABEL = { city: "City", town: "Town", village: "Village", hamlet: "Hamlet", suburb: "Area", neighbourhood: "Area", quarter: "Area", locality: "Locality", island: "Island", municipality: "Municipality" };

async function handleGeocode(url, request, env, ctx) {
  const q = clean(url.searchParams.get("q"), 80);
  if (q.length < 2) return json({ ok: true, results: [] });

  const cache = caches.default;
  const cacheKey = new Request(`https://geocode.cache.northbnb/?q=${encodeURIComponent(q.toLowerCase())}`);
  const hit = await cache.match(cacheKey);
  if (hit) return new Response(hit.body, { status: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Cache": "HIT" } });

  if (env.NB_KV) {
    const minute = Math.floor(Date.now() / 60_000);
    const key = `rlg:${clientIp(request)}:${minute}`;
    const n = parseInt((await env.NB_KV.get(key)) || "0", 10);
    if (n >= 40) return json({ ok: false, results: [], message: "Too many searches. Please wait a moment." }, 429);
    ctx.waitUntil(env.NB_KV.put(key, String(n + 1), { expirationTtl: 120 }));
  }

  const api = new URL("https://photon.komoot.io/api/");
  api.searchParams.set("q", q);
  api.searchParams.set("limit", "12");
  api.searchParams.set("lang", "en");
  api.searchParams.set("bbox", "18.3,41.7,20.5,43.7");
  for (const l of ["city", "locality", "district"]) api.searchParams.append("layer", l);
  let data;
  try {
    const r = await fetch(api, { headers: { "User-Agent": "northbnb-host-signup/1.0 (info@northbnb.com)" }, cf: { cacheTtl: 86400 } });
    if (!r.ok) throw new Error("photon " + r.status);
    data = await r.json();
  } catch (e) {
    console.error("geocode failed", e);
    return json({ ok: false, results: [], message: "Search is unavailable right now." }, 502);
  }

  const seen = new Set();
  const results = [];
  for (const f of data.features || []) {
    const p = f.properties || {};
    const [lon, lat] = (f.geometry && f.geometry.coordinates) || [];
    if (p.countrycode !== "ME" || !p.name || typeof lat !== "number") continue;
    const kind = PLACE_LABEL[p.osm_value] || "Place";
    const detail = [kind, p.county && p.county !== p.name ? p.county : "", "Montenegro"].filter(Boolean).join(", ");
    const dedupe = `${p.name}|${Math.round(lat * 50)}|${Math.round(lon * 50)}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    results.push({ name: clean(p.name, 80), detail: clean(detail, 120), lat: Math.round(lat * 1e5) / 1e5, lon: Math.round(lon * 1e5) / 1e5 });
    if (results.length >= 6) break;
  }
  const resp = json({ ok: true, results });
  ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify({ ok: true, results }), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=86400" } })));
  return resp;
}

const ROUTES = {
  "/api/host-signup": handleHostSignup,
  "/api/contact": handleContact,
  "/api/newsletter": handleNewsletter,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/geocode") {
      if (request.method !== "GET") return withSecurity(json({ ok: false, message: "Method not allowed." }, 405));
      try {
        return withSecurity(await handleGeocode(url, request, env, ctx));
      } catch (err) {
        console.error("geocode error", err);
        return withSecurity(json({ ok: false, results: [], message: "Search is unavailable right now." }, 500));
      }
    }

    // API routes
    const handler = ROUTES[url.pathname];
    if (handler) {
      if (request.method !== "POST") return withSecurity(json({ ok: false, message: "Method not allowed." }, 405));

      // CORS: allow same-origin always; cross-origin only from the production origin.
      const origin = request.headers.get("Origin");
      const allowed = env.ALLOWED_ORIGIN || url.origin;
      if (origin && origin !== url.origin && origin !== allowed) {
        return withSecurity(json({ ok: false, message: "Request not allowed." }, 403));
      }

      try {
        const ip = clientIp(request);
        if (await rateLimited(env, ip)) {
          return withSecurity(json({ ok: false, message: "Too many submissions. Please try again later." }, 429));
        }
        const ct = request.headers.get("Content-Type") || "";
        let form;
        if (ct.includes("application/json")) {
          const obj = await request.json();
          form = new Map(Object.entries(obj));
        } else {
          form = await request.formData();
        }
        const resp = await handler(form, env);
        return withSecurity(resp);
      } catch (err) {
        console.error("form handler error", err);
        return withSecurity(json({ ok: false, message: "Something went wrong. Please try again." }, 500));
      }
    }

    // Static assets (+ custom 404 via wrangler not_found_handling)
    try {
      const assetResp = await env.ASSETS.fetch(request);
      const out = withSecurity(assetResp);
      out.headers.set("Cache-Control", assetResp.status === 200 ? cacheFor(url.pathname) : "no-store");
      return out;
    } catch (err) {
      console.error("asset fetch error", err);
      return withSecurity(new Response("Service temporarily unavailable.", { status: 503 }));
    }
  },
};
