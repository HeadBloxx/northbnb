/* Shared site chrome: config, icons, head, header, footer, layout. */

export const SITE = {
  name: "NorthB&B",
  legalName: "Trip North LLC",
  tagline: "Private stays across Montenegro",
  url: "https://northbnb.com",
  email: "info@northbnb.com",
  phoneDisplay: "+382 69 289 866",
  phoneHref: "+38269289866",
  whatsappHref: "38269289866",
  address: {
    street: "Gradski Trg bb",
    city: "Rožaje",
    country: "Montenegro",
    full: "Gradski Trg bb, Rožaje, Montenegro",
  },
  // Booking engine + accounts remain on the existing TechnoHeaven platform.
  // Single source of truth so routing is trivial to update post-launch. [CONFIRM AT LAUNCH]
  bookingBase: "https://northbnb.com",
  loginUrl: "https://northbnb.com/#divSignIn",
  hostDashboardUrl: "https://extranetnorthbnb.technoheaven.in/",
  social: {
    facebook: "https://www.facebook.com/NorthBNB",
    instagram: "https://www.instagram.com/northbnb/",
    linkedin: "https://me.linkedin.com/company/triptravelmont",
    x: "https://x.com/northbnb_",
  },
};

/* Inline SVG icons — geometric line icons, currentColor. No circular-badge clichés. */
const I = {
  search: '<path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.35-4.35"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  users: '<path d="M16 19v-1.5A3.5 3.5 0 0 0 12.5 14h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="7.5" r="3"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.6a3 3 0 0 1 0 5.8"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
  checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4 12 14.01l-3-3"/>',
  phone: '<path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 5 6.6 1.5 1.5 0 0 1 6.5 4Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
  shield: '<path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3 10h18M6.5 15h4"/>',
  wallet: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z"/><path d="M20 10h-4a2 2 0 0 0 0 4h4"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17"/>',
  headset: '<path d="M5 13v-1a7 7 0 0 1 14 0v1"/><path d="M19 14v3a1.5 1.5 0 0 1-1.5 1.5H14"/><rect x="3.5" y="13" width="3" height="5" rx="1"/><rect x="17.5" y="13" width="3" height="5" rx="1"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8L6.7 19.6l1-5.8-4.2-4.1 5.9-.9L12 3.5Z"/>',
  building: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M9.5 20.5v-2h5v2"/>',
  key: '<circle cx="8" cy="8" r="4.5"/><path d="m11.2 11.2 8.3 8.3M16 16l2-2M18.5 18.5l1.5-1.5"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.3-2h6.4L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"/><circle cx="12" cy="12.5" r="3"/>',
  home: '<path d="m4 11 8-6.5 8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  handshake: '<path d="m11 6 2-1.5 6 4.5v6l-2 1.5"/><path d="m13 6-2-1.5L5 9v6l4 3 3-2.5 2.5 2 2-1.5"/><path d="m9 12 2 2"/>',
  facebook: '<path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.6V8.5H8V11h2.5v8h3v-8H16l.5-2.5H13.5Z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none"/>',
  linkedin: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3c0-1.4.9-2.3 2.1-2.3s2 .9 2 2.3V16"/>',
  x: '<path d="m5 5 14 14M19 5 5 19"/>',
};

export function svg(name, cls = "ico") {
  const inner = I[name];
  if (!inner) return "";
  const filled = ["star", "facebook"].includes(name);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="${filled ? "none" : "currentColor"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/* Brand wordmark that inherits color (uses our logo palette, not an external file). */
export function logoMark(forDark = false) {
  const n = forDark ? "#ffffff" : "#254173";
  const b = "#30c9fa";
  return `<svg viewBox="0 0 196 34" role="img" aria-label="NorthB&amp;B home" xmlns="http://www.w3.org/2000/svg">
<path d="M4 29V5h3.2l10.6 15.9V5H21v24h-3.2L7.2 13.1V29H4Z" fill="${n}"/>
<path d="M0 3.5 9 0v8.5L0 12V3.5Z" fill="${b}"/>
<text x="30" y="24.5" font-family="Montserrat, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5" fill="${n}">north</text>
<text x="112" y="24.5" font-family="Montserrat, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5" fill="${b}">B&amp;B</text>
</svg>`;
}

/* ---------- HEAD ---------- */
const DESIGN_HEAD = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/newsreader-latin.woff2" crossorigin><link rel="stylesheet" href="/assets/css/designs.css"><link rel="stylesheet" href="/assets/css/refresh.css">';
export function head({ title, desc, slug = "", bodyClass = "", jsonld = [], preloadHero = false, noindex = false, extraHead = "" }) {
  // Design 3 is the site-wide look. Pages that already opt into the refresh layer (host flow, host landing) keep their own head.
  if (!/refresh/.test(bodyClass)) {
    bodyClass = `design d3 refresh ${bodyClass}`.trim();
    extraHead = DESIGN_HEAD + extraHead;
  }
  const canonical = SITE.url + "/" + (slug ? slug + "/" : "");
  const canonicalTag = noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`;
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  const heroPreload = preloadHero
    ? `<link rel="preload" as="image" href="/assets/img/hero-montenegro-960.webp" imagesrcset="/assets/img/hero-montenegro-480.webp 480w, /assets/img/hero-montenegro-960.webp 960w, /assets/img/hero-montenegro-1600.webp 1600w, /assets/img/hero-montenegro-2000.webp 2000w" imagesizes="100vw" fetchpriority="high">`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
${canonicalTag}
<meta name="theme-color" content="#033f63">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}/assets/img/hero-montenegro-1600.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/montserrat-latin.woff2" crossorigin>
${heroPreload}
<link rel="stylesheet" href="/assets/css/styles.css">
${extraHead}
${ld}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to content</a>`;
}

/* ---------- HEADER ---------- */
export function header(active = "") {
  const link = (href, label, key) =>
    `<a class="nav__link" href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/">${logoMark()}</a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav"><span></span></button>
    <nav class="nav" id="primary-nav" aria-label="Primary">
      <div class="nav__links">
        ${link("/search/", "Find a stay", "search")}
        ${link("/#destinations", "Destinations", "dest")}
        ${link("/host/start/", "Become a host", "host")}
        ${link("/about/", "About", "about")}
        ${link("/contact/", "Contact", "contact")}
      </div>
      <div class="nav__actions">
        <a class="nav__login" href="${SITE.loginUrl}" rel="nofollow">Log in</a>
        <a class="btn btn--primary" href="/host/start/">Become a host</a>
      </div>
    </nav>
  </div>
</header>`;
}

/* ---------- FOOTER ---------- */
export function footer() {
  const s = SITE.social;
  const soc = (net, href) =>
    `<a href="${href}" aria-label="${SITE.name} on ${net}" rel="noopener" target="_blank">${svg(net === "x" ? "x" : net)}</a>`;
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        ${logoMark(true)}
        <p>Handpicked private accommodation across Montenegro, booked directly, with real people on hand before, during and after your trip.</p>
        <div class="social">
          ${soc("facebook", s.facebook)}
          ${soc("instagram", s.instagram)}
          ${soc("linkedin", s.linkedin)}
          ${soc("x", s.x)}
        </div>
      </div>
      <div>
        <h2>Explore</h2>
        <nav class="footer-list" aria-label="Footer">
          <a href="/search/">Find a stay</a>
          <a href="/#destinations">Destinations</a>
          <a href="/host/start/">Become a host</a>
          <a href="/about/">About us</a>
          <a href="/contact/">Contact</a>
        </nav>
      </div>
      <div>
        <h2>Legal</h2>
        <nav class="footer-list" aria-label="Legal">
          <a href="/legal/privacy/">Privacy policy</a>
          <a href="/legal/cookies/">Cookie notice</a>
          <a href="/legal/terms/">Terms of use</a>
        </nav>
      </div>
      <div>
        <h2>Contact</h2>
        <div class="footer-contact">
          <a href="https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}" rel="noopener" target="_blank">${svg("pin")}<span>${SITE.address.full}</span></a>
          <a href="tel:${SITE.phoneHref}">${svg("phone")}<span>${SITE.phoneDisplay}</span></a>
          <a href="mailto:${SITE.email}">${svg("mail")}<span>${SITE.email}</span></a>
        </div>
        <form class="newsletter" action="/api/newsletter" method="post" data-form="newsletter" aria-label="Newsletter signup" novalidate>
          <label class="visually-hidden" for="nl-email">Email address</label>
          <input id="nl-email" type="email" name="email" placeholder="Email for updates &amp; offers" autocomplete="email" required>
          <button class="btn btn--sky" type="submit">Subscribe</button>
        </form>
        <p class="field-error" data-form-msg="newsletter" role="status" aria-live="polite"></p>
      </div>
    </div>

    <div class="eu-note">
      <img src="/assets/img/eu-flag.png" width="42" height="28" alt="Flag of the European Union" loading="lazy" decoding="async">
      <span>This website is co-funded by the European Union. Its contents are the sole responsibility of ${SITE.legalName}, Rožaje, and do not necessarily reflect the views of the European Union.</span>
    </div>

    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved.</span>
      <nav aria-label="Footer legal">
        <a href="/legal/privacy/">Privacy</a>
        <a href="/legal/cookies/">Cookies</a>
        <a href="/legal/terms/">Terms</a>
      </nav>
      <span class="credit">Made with love by <a href="https://immne.eu/digital-solutions" rel="noopener" target="_blank">Innovative Management</a></span>
    </div>
  </div>
</footer>`;
}

/* ---------- LAYOUT ---------- */
export function layout(opts) {
  const { main, active = "", mobileCta = "", bare = false, scripts = "", headerHtml, footerHtml } = opts;
  // Bare pages (the full-screen host flow) bring their own chrome and script.
  if (bare) return `${head(opts)}
<main id="main">
${main}
</main>
${scripts}
</body>
</html>`;
  const cta = mobileCta
    ? `<div class="mobile-cta">${mobileCta}</div>`
    : "";
  const cookieBar = `<div class="cookie-bar" id="cookie-bar" role="region" aria-label="Cookie notice" hidden>
  <div class="wrap cookie-bar__inner">
    <p>We use only essential cookies to make this site work. Read our <a href="/legal/cookies/">Cookie Notice</a>.</p>
    <button class="btn btn--sky" type="button" data-cookie-ack>Got it</button>
  </div>
</div>`;
  return `${head(opts)}
${headerHtml ?? header(active)}
<main id="main">
${main}
</main>
${footerHtml ?? footer()}
${cta}
${cookieBar}
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

/* small shared util for visually-hidden labels */
export const VH = '<style>.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}</style>';
