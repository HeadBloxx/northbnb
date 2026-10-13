import { SITE, svg } from "../chrome.mjs";

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Find a stay", item: SITE.url + "/search/" },
      { "@type": "ListItem", position: 3, name: "Property", item: SITE.url + "/property/" },
    ],
  },
];

const amenity = (icon, label) => `<li style="display:grid;grid-template-columns:26px 1fr;gap:var(--s-3);align-items:center">${svg(icon, "ico")}<span>${label}</span></li>`;

const main = `
<div style="background:var(--sky-tint);border-bottom:1px solid var(--line)">
  <div class="wrap" style="padding-block:var(--s-3);display:flex;gap:var(--s-3);align-items:center;flex-wrap:wrap">
    ${svg("compass", "ico")}
    <p style="margin:0;font-weight:600;color:var(--navy);font-size:0.92rem">Design preview: this shows the redesigned listing layout. Live properties, prices and reviews open in the booking system.</p>
  </div>
</div>

<section class="section" style="padding-top:var(--s-6)">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb" style="color:var(--ink-500)"><a href="/" style="color:var(--navy)">Home</a> / <a href="/search/" style="color:var(--navy)">Find a stay</a> / <span>Example listing</span></nav>

    <div style="display:flex;justify-content:space-between;gap:var(--s-4);flex-wrap:wrap;align-items:end;margin-top:var(--s-3)">
      <div>
        <h1 style="font-size:clamp(1.8rem,1.4rem+1.6vw,2.4rem)">Coastal apartment near the Adriatic</h1>
        <p style="display:flex;gap:var(--s-2);align-items:center;margin-top:var(--s-2);color:var(--ink-500);font-weight:600">${svg("pin", "ico")} Herceg Novi, Montenegro</p>
      </div>
      <div class="rating" aria-label="Ratings appear on live listings">${svg("star")}${svg("star")}${svg("star")}${svg("star")}${svg("star")}<span style="color:var(--ink-500);font-weight:600;margin-left:6px;font-size:0.9rem">Reviews load from the booking system</span></div>
    </div>

    <!-- Gallery -->
    <div class="split" style="--cols:2fr 1fr;gap:var(--s-3);margin-top:var(--s-5)" data-reveal>
      <img src="/assets/img/montenegro-coast-1100.webp" width="1100" height="733" alt="View of the Adriatic coast near the property" decoding="async" style="border-radius:var(--r-lg);width:100%;height:100%;object-fit:cover;aspect-ratio:3/2">
      <div style="display:grid;gap:var(--s-3)">
        <img src="/assets/img/dest-herceg-novi-275.webp" alt="Herceg Novi waterfront" loading="lazy" decoding="async" style="border-radius:var(--r-lg);width:100%;height:100%;object-fit:cover;aspect-ratio:3/2">
        <img src="/assets/img/dest-budva-253.webp" alt="Nearby Adriatic town" loading="lazy" decoding="async" style="border-radius:var(--r-lg);width:100%;height:100%;object-fit:cover;aspect-ratio:3/2">
      </div>
    </div>

    <!-- Body + booking card -->
    <div class="split" style="--cols:1.6fr 1fr;margin-top:var(--s-7)">
      <div class="stack" data-reveal>
        <div>
          <h2 style="font-size:1.4rem">About this stay</h2>
          <p style="margin-top:var(--s-3)">A bright two-bedroom apartment a short walk from the waterfront, with a private balcony looking out over the bay. Comfortable for a family or a small group, with everything you need for a longer stay and the coast on your doorstep.</p>
        </div>
        <div>
          <h2 style="font-size:1.4rem;margin-top:var(--s-5)">What this place offers</h2>
          <ul class="split" style="--cols:1fr 1fr;gap:var(--s-3) var(--s-5);margin-top:var(--s-4)">
            ${amenity("globe", "Fast Wi-Fi")}
            ${amenity("home", "Full kitchen")}
            ${amenity("sun", "Air conditioning")}
            ${amenity("key", "Self check-in")}
            ${amenity("pin", "Balcony &amp; sea view")}
            ${amenity("card", "Free on-site parking")}
          </ul>
        </div>
        <div>
          <h2 style="font-size:1.4rem;margin-top:var(--s-5)">The area</h2>
          <p style="margin-top:var(--s-3)">Herceg Novi sits at the mouth of the Bay of Kotor, with a walkable old town, seafront promenade and easy drives along the coast. <a href="https://maps.google.com/?q=Herceg%20Novi%20Montenegro" rel="noopener" target="_blank" style="color:var(--sky-600);text-decoration:underline;text-underline-offset:2px">View the area on the map</a>.</p>
        </div>
      </div>

      <aside style="position:sticky;top:calc(var(--header-h) + 16px)" data-reveal data-reveal-delay="1">
        <div class="form-card">
          <p style="font-weight:700;color:var(--navy)">Check dates &amp; price</p>
          <p style="font-size:0.88rem;color:var(--ink-500);margin-top:4px">Live rates for your dates open in our secure booking system.</p>
          <form action="${SITE.bookingBase}/" method="get" style="margin-top:var(--s-4);display:grid;gap:var(--s-3)" rel="nofollow">
            <div class="form-field">
              <label for="p-in">Check in</label>
              <input class="input" id="p-in" name="checkin" type="date">
            </div>
            <div class="form-field">
              <label for="p-out">Check out</label>
              <input class="input" id="p-out" name="checkout" type="date">
            </div>
            <div class="form-field">
              <label for="p-guests">Guests</label>
              <select class="select" id="p-guests" name="guests">
                <option>1 guest</option><option selected>2 guests</option><option>3 guests</option>
                <option>4 guests</option><option>5+ guests</option>
              </select>
            </div>
            <button class="btn btn--primary btn--block btn--lg" type="submit">Check availability ${svg("arrowRight")}</button>
          </form>
          <p style="display:flex;gap:var(--s-2);align-items:center;margin-top:var(--s-4);font-size:0.85rem;color:var(--ink-500);font-weight:600">${svg("shield", "ico")} Best-rate direct booking</p>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--navy center">
  <div class="wrap">
    <h2 data-reveal>Ready to find the real thing?</h2>
    <p class="lede" style="color:#cfe1ee;margin:var(--s-3) auto 0" data-reveal>Browse live availability across Montenegro.</p>
    <div style="margin-top:var(--s-6)" data-reveal><a class="btn btn--sky btn--lg" href="/search/">${svg("search")} Find a stay</a></div>
  </div>
</section>
`;

export const property = {
  title: "Property listing (design preview) | NorthB&B Montenegro",
  desc: "A preview of the redesigned NorthB&B property listing layout. Live properties, prices and availability open in the secure booking system.",
  slug: "property",
  active: "search",
  noindex: true,
  jsonld,
  main,
};
