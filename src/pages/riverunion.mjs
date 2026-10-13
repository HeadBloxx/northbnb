import { SITE, svg } from "../chrome.mjs";

const URL_PATH = "/property/river-union/";
const IMG = (n, w) => `/assets/img/river-union-${n}-${w}.webp`;
const PHOTOS = [
  { n: "living", w: 900, h: 1200, alt: "Living room with a green velvet sofa, TV and marble floor" },
  { n: "bedroom", w: 900, h: 1200, alt: "Double bedroom with an upholstered headboard and wall lights" },
  { n: "lounge", w: 900, h: 1200, alt: "Open living area with a corner sofa and large glass doors" },
  { n: "kitchen", w: 900, h: 1600, alt: "Kitchen counter and living space with timber slat divider" },
  { n: "stairs", w: 900, h: 1200, alt: "Living area with stairs up to the sleeping loft" },
  { n: "bathroom", w: 900, h: 1600, alt: "Bathroom with walk-in shower and washing machine" },
];

const DESC = [
  "Welcome to River Union, a riverside retreat at the confluence of the Lim and Bistrica rivers. It sits minutes from Bijelo Polje and steps from the well-known Čardak restaurant, with direct access to the Bistrica river and open views of the valley.",
  "Đalovića Cave, the Teleferik and the Bistrica spring are all close by. Whether you are breaking the Belgrade to Bar journey, or planning a birthday, a gathering or a riverside celebration, River Union is a comfortable place to stop.",
];

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Find a stay", item: SITE.url + "/search/" },
      { "@type": "ListItem", position: 3, name: "River Union", item: SITE.url + URL_PATH },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "River Union",
    description: DESC.join(" "),
    image: PHOTOS.map((p) => SITE.url + IMG(p.n, 900)),
    url: SITE.url + URL_PATH,
    latitude: 43.10789,
    longitude: 19.7838,
    address: { "@type": "PostalAddress", addressLocality: "Gubavač, Bijelo Polje", addressCountry: "ME" },
    containsPlace: { "@type": "Accommodation", occupancy: { "@type": "QuantitativeValue", value: 3 } },
  },
];

const ico = (name) => svg(name, "ico").replace("<svg ", '<svg width="22" height="22" style="color:var(--sky-600)" ');
const amenity = (icon, label) => `<li style="display:grid;grid-template-columns:26px 1fr;gap:var(--s-3);align-items:center">${ico(icon)}<span>${label}</span></li>`;
const img = (p, extra = "", eager = false) =>
  `<img src="${IMG(p.n, 900)}" srcset="${IMG(p.n, 480)} 480w, ${IMG(p.n, 900)} 900w" sizes="(min-width:900px) 33vw, 100vw" width="${p.w}" height="${p.h}" alt="${p.alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="border-radius:var(--r-lg);width:100%;height:100%;object-fit:cover;${extra}">`;

const main = `
<section class="section" style="padding-top:var(--s-6)">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb" style="color:var(--ink-500)"><a href="/" style="color:var(--navy)">Home</a> / <a href="/search/" style="color:var(--navy)">Find a stay</a> / <span>River Union</span></nav>

    <div style="margin-top:var(--s-3)">
      <h1 style="font-size:clamp(1.8rem,1.4rem+1.6vw,2.4rem)">River Union</h1>
      <p style="display:flex;gap:var(--s-2);align-items:center;margin-top:var(--s-2);color:var(--ink-500);font-weight:600">${ico("pin")} Gubavač, Bijelo Polje, Montenegro</p>
    </div>

    <div class="split" style="--cols:1.4fr 1fr 1fr;gap:var(--s-3);margin-top:var(--s-5);align-items:stretch" data-reveal>
      <div style="grid-row:span 2;min-height:320px">${img(PHOTOS[0], "aspect-ratio:3/4;", true)}</div>
      ${img(PHOTOS[1], "aspect-ratio:4/5;")}
      ${img(PHOTOS[2], "aspect-ratio:4/5;")}
      ${img(PHOTOS[4], "aspect-ratio:4/5;")}
      ${img(PHOTOS[3], "aspect-ratio:4/5;")}
    </div>

    <div class="split" style="--cols:1.6fr 1fr;margin-top:var(--s-7)">
      <div class="stack" data-reveal>
        <div>
          <h2 style="font-size:1.4rem">About this stay</h2>
          ${DESC.map((d) => `<p style="margin-top:var(--s-3)">${d}</p>`).join("")}
        </div>
        <div>
          <h2 style="font-size:1.4rem;margin-top:var(--s-5)">What this place offers</h2>
          <ul class="split" style="--cols:1fr 1fr;gap:var(--s-3) var(--s-5);margin-top:var(--s-4)">
            ${amenity("pin", "Riverside, direct Bistrica access")}
            ${amenity("home", "Open-plan living area and kitchen")}
            ${amenity("key", "Sleeps up to 3 guests")}
            ${amenity("sun", "Large glass doors and valley views")}
            ${amenity("check", "Private bathroom with shower")}
            ${amenity("check", "Washing machine")}
          </ul>
        </div>
        <div>
          <h2 style="font-size:1.4rem;margin-top:var(--s-5)">The area</h2>
          <p style="margin-top:var(--s-3)">River Union is on the Beograd to Bar route, a few minutes from Bijelo Polje. Nearby: Čardak restaurant, Đalovića Cave, the Teleferik and the Bistrica spring. <a href="https://maps.google.com/?q=43.10789,19.7838" rel="noopener" target="_blank" style="color:var(--sky-600);text-decoration:underline;text-underline-offset:2px">View on the map</a>.</p>
        </div>
      </div>

      <aside style="position:sticky;top:calc(var(--header-h) + 16px)" data-reveal data-reveal-delay="1">
        <div class="form-card">
          <p style="font-weight:700;color:var(--navy)">Check dates &amp; price</p>
          <p style="font-size:0.88rem;color:var(--ink-500);margin-top:4px">Live rates for your dates open in our secure booking system.</p>
          <form action="${SITE.bookingBase}/" method="get" style="margin-top:var(--s-4);display:grid;gap:var(--s-3)" rel="nofollow">
            <div class="form-field"><label for="p-in">Check in</label><input class="input" id="p-in" name="checkin" type="date"></div>
            <div class="form-field"><label for="p-out">Check out</label><input class="input" id="p-out" name="checkout" type="date"></div>
            <div class="form-field">
              <label for="p-guests">Guests</label>
              <select class="select" id="p-guests" name="guests"><option>1 guest</option><option selected>2 guests</option><option>3 guests</option></select>
            </div>
            <button class="btn btn--primary btn--block btn--lg" type="submit">Check availability ${svg("arrowRight")}</button>
          </form>
          <p style="display:flex;gap:var(--s-2);align-items:center;margin-top:var(--s-4);font-size:0.85rem;color:var(--ink-500);font-weight:600">${ico("shield")} Best-rate direct booking</p>
        </div>
      </aside>
    </div>
  </div>
</section>
`;

export const riverUnion = {
  title: "River Union, Gubavač, Bijelo Polje | NorthB&B Montenegro",
  desc: "River Union is a riverside stay at the meeting of the Lim and Bistrica rivers near Bijelo Polje, Montenegro. Sleeps 3. Book direct at the best rate.",
  slug: "property/river-union",
  active: "search",
  jsonld,
  main,
};
