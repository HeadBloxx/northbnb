import { SITE, svg } from "../chrome.mjs";

const DESTS = ["Podgorica", "Herceg Novi", "Budva", "Bar", "Kotor", "Tivat", "Žabljak", "Ulcinj", "Bijelo Polje", "Plav"];

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Find a stay", item: SITE.url + "/search/" },
    ],
  },
];

const townLink = (t) => `<a class="pay-badge" href="/search/?destination=${encodeURIComponent(t)}" style="text-decoration:none">${svg("pin")}${t}</a>`;

const main = `
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Find a stay</span></nav>
    <h1>Find your stay in Montenegro</h1>
    <p data-search-summary>Search by destination and dates to see live availability.</p>
    <form class="searchbar" action="/search/" method="get" role="search" aria-label="Search stays" style="margin-top:var(--s-6)">
      <div class="field">
        <label for="s-dest">Destination</label>
        <div class="field__control">${svg("pin")}<input id="s-dest" name="destination" list="dest-list" placeholder="Town or area" autocomplete="off"></div>
        <datalist id="dest-list">${DESTS.map((d) => `<option value="${d}">`).join("")}</datalist>
      </div>
      <div class="field">
        <label for="s-in">Check in</label>
        <div class="field__control">${svg("calendar")}<input id="s-in" name="checkin" type="date"></div>
      </div>
      <div class="field">
        <label for="s-out">Check out</label>
        <div class="field__control">${svg("calendar")}<input id="s-out" name="checkout" type="date"></div>
      </div>
      <button class="btn btn--sky" type="submit">${svg("search")} Search</button>
    </form>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="form-card split split--center" style="--cols:auto 1fr auto;gap:var(--s-5)" data-reveal>
      <div class="feature__icon" style="color:var(--sky-600);width:48px;height:48px">${svg("shield", "")}</div>
      <div>
        <h2 style="font-size:1.3rem">Live availability &amp; booking</h2>
        <p style="margin-top:var(--s-2)">Real-time prices and availability for your dates open in our secure booking system, where you can compare stays and reserve directly at the best rate.</p>
      </div>
      <a class="btn btn--primary btn--lg" id="continue-booking" href="${SITE.bookingBase}/" rel="nofollow">See available stays ${svg("arrowRight")}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="measure" data-reveal><h2>Featured stay</h2></div>
    <div class="dests" style="margin-top:var(--s-5);grid-template-columns:repeat(auto-fit,minmax(240px,320px))">
      <a class="dest" href="/property/river-union/" data-reveal><img src="/assets/img/river-union-living-480.webp" width="480" height="640" alt="River Union living room" loading="lazy" decoding="async"><span class="dest__label"><strong>River Union</strong><span>Bijelo Polje · riverside · sleeps 3</span></span></a>
    </div>
  </div>
</section>

<section class="section section--mist">
  <div class="wrap">
    <div class="measure" data-reveal>
      <h2>Where are you headed?</h2>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:var(--s-3);margin-top:var(--s-5)" data-reveal>
      ${DESTS.map(townLink).join("")}
    </div>
    <div class="dests" style="margin-top:var(--s-7)">
      <a class="dest" href="/search/?destination=Podgorica" data-reveal><img src="/assets/img/dest-podgorica-275.webp" alt="Podgorica, Montenegro" loading="lazy" decoding="async"><span class="dest__label"><strong>Podgorica</strong><span>79 stays · the capital</span></span></a>
      <a class="dest" href="/search/?destination=Herceg%20Novi" data-reveal data-reveal-delay="1"><img src="/assets/img/dest-herceg-novi-275.webp" alt="Herceg Novi, Montenegro" loading="lazy" decoding="async"><span class="dest__label"><strong>Herceg Novi</strong><span>59 stays · the coast</span></span></a>
      <a class="dest" href="/search/?destination=Budva" data-reveal data-reveal-delay="2"><img src="/assets/img/dest-budva-253.webp" alt="Budva, Montenegro" loading="lazy" decoding="async"><span class="dest__label"><strong>Budva</strong><span>The Adriatic riviera</span></span></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="measure center" data-reveal><h2>Why book direct with NorthB&amp;B</h2></div>
    <div class="features" style="margin-top:var(--s-7)">
      <div class="feature" data-reveal><div class="feature__icon">${svg("handshake", "")}</div><div><h3>The real, best rate</h3><p>Direct relationships with hosts. No marketplace markup added on top.</p></div></div>
      <div class="feature" data-reveal><div class="feature__icon">${svg("card", "")}</div><div><h3>Pay your way</h3><p>Major credit card or PayPal online, or settle on arrival.</p></div></div>
      <div class="feature" data-reveal><div class="feature__icon">${svg("check", "")}</div><div><h3>Verified properties</h3><p>Places we actually know: checked, not auto-imported.</p></div></div>
      <div class="feature" data-reveal><div class="feature__icon">${svg("headset", "")}</div><div><h3>24/7 support</h3><p>Real people, before you travel and throughout your stay.</p></div></div>
    </div>
  </div>
</section>
`;

export const search = {
  title: "Find a stay in Montenegro | Search private accommodation | NorthB&B",
  desc: "Search handpicked private stays across Montenegro by destination and dates. Live availability and direct booking at the best rate, with 24/7 support.",
  slug: "search",
  active: "search",
  bodyClass: "has-sticky-cta",
  jsonld,
  mobileCta: `<a class="btn btn--primary" href="${SITE.bookingBase}/" rel="nofollow">${svg("search")} See available stays</a>`,
  main,
};
