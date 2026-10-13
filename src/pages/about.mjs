import { SITE, svg } from "../chrome.mjs";

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About NorthB&B",
    url: SITE.url + "/about/",
    about: { "@id": SITE.url + "/#org" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "About", item: SITE.url + "/about/" },
    ],
  },
];

const value = (icon, title, body) => `
  <div class="feature" data-reveal>
    <div class="feature__icon">${svg(icon, "")}</div>
    <div><h3>${title}</h3><p>${body}</p></div>
  </div>`;

const main = `
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>About</span></nav>
    <h1>A booking platform with its feet in Montenegro</h1>
    <p>We're a small team that connects travellers with handpicked private places to stay, and helps local owners reach them directly.</p>
  </div>
</section>

<section class="section">
  <div class="wrap split split--center" style="--cols:1.1fr 1fr">
    <div class="stack" data-reveal>
      <h2>Local knowledge, not a global catalogue</h2>
      <p>NorthB&amp;B is operated by ${SITE.legalName}, based in Rožaje. We bring together apartments, villas, family-run hotels, hostels and campgrounds from across the country, from the Adriatic coast to the northern mountains, and make them easy to book directly, at the real rate.</p>
      <p>Because we work hand-in-hand with hosts rather than listing millions of places sight-unseen, we can keep prices honest, listings verified, and support genuinely personal.</p>
      <p style="font-size:0.95rem;color:var(--ink-500);display:flex;gap:var(--s-3);align-items:center">
        <img src="/assets/img/eu-flag.png" width="36" height="24" alt="Flag of the European Union" loading="lazy" decoding="async">
        Co-funded by the European Union as part of a wider effort to grow sustainable tourism in the region.
      </p>
    </div>
    <div data-reveal data-reveal-delay="1">
      <img src="/assets/img/montenegro-coast-1100.webp" width="1100" height="733" alt="Coastline and mountains in Montenegro" loading="lazy" decoding="async" style="border-radius:var(--r-lg);box-shadow:var(--shadow-3)">
    </div>
  </div>
</section>

<section class="section section--mist">
  <div class="wrap">
    <div class="measure" data-reveal>
      <h2>Five things we don't compromise on</h2>
    </div>
    <div class="features" style="margin-top:var(--s-7)">
      ${value("wallet", "Best prices", "Direct relationships with hosts mean the rate you see is the real one. No marketplace markup layered on top.")}
      ${value("shield", "Payment security", "Pay by major card or PayPal with confidence, or settle on arrival. Your details are handled carefully.")}
      ${value("check", "Verified properties", "We know the places we list. Listings are checked, not auto-imported from a faceless feed.")}
      ${value("headset", "A personal approach", "Real people you can talk to before you book and throughout your trip, any hour of the day.")}
      ${value("pin", "Local connection", "We live and work here. That local knowledge is what turns a booking into a better trip.")}
      ${value("handshake", "Fair to hosts", "Owners keep more and stay in control, with help to get set up and paid, worldwide.")}
    </div>
  </div>
</section>

<section class="section section--navy center">
  <div class="wrap">
    <h2 data-reveal>Come stay, or come host</h2>
    <p class="lede" style="color:#cfe1ee;margin:var(--s-3) auto 0" data-reveal>Whichever brings you here, we'd love to help.</p>
    <div style="display:flex;flex-wrap:wrap;gap:var(--s-4);justify-content:center;margin-top:var(--s-6)" data-reveal>
      <a class="btn btn--sky btn--lg" href="/search/">${svg("search")} Find a stay</a>
      <a class="btn btn--ghost-on-dark btn--lg" href="/host/start/">Become a host</a>
    </div>
  </div>
</section>
`;

export const about = {
  title: "About NorthB&B | Private stays and local hosts in Montenegro",
  desc: "NorthB&B is operated by Trip North LLC in Rožaje. We connect travellers with handpicked private stays across Montenegro, and help local owners reach them directly.",
  slug: "about",
  active: "about",
  jsonld,
  main,
};
