/* Host landing page: one page, one action.
   Headline says what the host gets, the subheadline says how, a proof image sits above
   the fold with the CTA, the three biggest objections are answered right after, and more
   proof is stacked below. Every button on the page goes to the same place: the signup flow. */
import { SITE, svg, logoMark } from "../chrome.mjs";

const START = "/host/start/";

const OBJECTIONS = [
  { icon: "handshake", q: "Is it really free?", a: "Yes. Listing costs nothing. We earn a fair commission only when a guest books, so we only do well when you do." },
  { icon: "calendar", q: "Will it take all afternoon?", a: "No. Three short steps, one question at a time, about five minutes in all. Skip anything optional, your answers save as you go, and a real person finishes the setup with you." },
  { icon: "wallet", q: "How do I get paid?", a: "You choose: worldwide payouts through Payoneer, or a direct bank transfer. We set it up with you, so there is nothing to figure out alone." },
];

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Become a host", item: SITE.url + "/host/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: OBJECTIONS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
];

const cta = (label = "Start your free listing", extra = "") =>
  `<a class="btn btn--grad btn--lg ${extra}" href="${START}">${label} ${svg("arrowRight")}</a>`;

/* One call to action in the header, no navigation to wander off with. */
const headerHtml = `<header class="lp-top">
  <div class="wrap lp-top__inner">
    <a class="brand" href="/">${logoMark()}</a>
    <a class="btn btn--grad lp-top__cta" href="${START}">List your place</a>
  </div>
</header>`;

const footerHtml = `<footer class="site-footer lp-foot">
  <div class="wrap">
    <div class="lp-foot__row">
      <div class="footer-brand">${logoMark(true)}</div>
      <p>${SITE.legalName}, ${SITE.address.full}</p>
      <nav class="lp-foot__links" aria-label="Footer">
        <a href="${SITE.hostDashboardUrl}" rel="noopener" target="_blank">Already a host? Sign in</a>
        <a href="/legal/privacy/">Privacy</a>
        <a href="/legal/cookies/">Cookies</a>
        <a href="/legal/terms/">Terms</a>
      </nav>
    </div>
    <div class="eu-note">
      <img src="/assets/img/eu-flag.png" width="42" height="28" alt="Flag of the European Union" loading="lazy" decoding="async">
      <span>This website is co-funded by the European Union. Its contents are the sole responsibility of ${SITE.legalName}, Rožaje, and do not necessarily reflect the views of the European Union.</span>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved.</span>
      <span class="credit">Made with love by <a href="https://immne.eu/digital-solutions" rel="noopener" target="_blank">Innovative Management</a></span>
    </div>
  </div>
</footer>`;

const main = `
<section class="lp-hero" aria-labelledby="lp-h1">
  <div class="wrap lp-hero__grid">
    <div class="lp-hero__text">
      <h1 id="lp-h1">Get direct bookings for your Montenegro place, and get paid your way</h1>
      <p class="lp-sub">Answer a few short questions, about five minutes in all. A real person on our local team builds your listing and gets it live.</p>
      <div class="lp-cta">
        ${cta()}
        <p class="lp-micro">Free to list. No payment details needed. Your answers save as you go.</p>
      </div>
    </div>
    <div class="lp-hero__media">
      <picture>
        <source type="image/webp" srcset="/assets/img/montenegro-coast-640.webp 640w, /assets/img/montenegro-coast-1100.webp 1100w, /assets/img/montenegro-coast-1600.webp 1600w" sizes="(max-width: 860px) 100vw, 600px">
        <img src="/assets/img/montenegro-coast-1100.webp" width="1100" height="733" alt="Coastal village and mountains along the Montenegro shoreline" fetchpriority="high" decoding="async">
      </picture>
      <div class="lp-proof lp-proof--count"><strong>195+</strong><span>private stays already listed on NorthB&amp;B</span></div>
      <div class="lp-proof lp-proof--pay">${svg("wallet")}<span>Paid worldwide via Payoneer, or to your bank</span></div>
    </div>
  </div>
</section>

<section class="section lp-obj" aria-labelledby="lp-obj-h">
  <div class="wrap">
    <h2 id="lp-obj-h" class="lp-h2" data-reveal>The three questions hosts ask before they start</h2>
    <div class="lp-obj__grid">
      ${OBJECTIONS.map((o, i) => `
      <article class="lp-card" data-reveal data-reveal-delay="${i}">
        <span class="lp-card__icon">${svg(o.icon, "")}</span>
        <h3>${o.q}</h3>
        <p>${o.a}</p>
      </article>`).join("")}
    </div>
    <div class="lp-obj__cta" data-reveal>${cta()}</div>
  </div>
</section>

<section class="stats lp-stats" aria-label="NorthB&amp;B at a glance">
  <div class="wrap section--tight">
    <div class="stats__grid">
      <div data-reveal><div class="stat__num" data-count="195" data-suffix="+">195+</div><div class="stat__label">Private stays listed</div></div>
      <div data-reveal data-reveal-delay="1"><div class="stat__num" data-count="6">6</div><div class="stat__label">Destinations across Montenegro</div></div>
      <div data-reveal data-reveal-delay="2"><div class="stat__num">24/7</div><div class="stat__label">Support for you and your guests</div></div>
      <div data-reveal data-reveal-delay="3"><div class="stat__num" data-count="3">3</div><div class="stat__label">Ways guests can pay</div></div>
    </div>
  </div>
</section>

<section class="section lp-dest" aria-labelledby="lp-dest-h">
  <div class="wrap">
    <div class="measure" data-reveal>
      <h2 id="lp-dest-h" class="lp-h2">Guests are already booking across Montenegro</h2>
      <p class="lede" style="margin-top:var(--s-3)">Your place joins stays from the Adriatic coast to the capital and the northern mountains.</p>
    </div>
    <div class="dests" style="margin-top:var(--s-7)">
      <div class="dest" data-reveal>
        <img src="/assets/img/dest-podgorica-275.webp" alt="Podgorica, Montenegro" loading="lazy" decoding="async">
        <span class="dest__label"><strong>Podgorica</strong><span>79 stays, the capital</span></span>
      </div>
      <div class="dest" data-reveal data-reveal-delay="1">
        <img src="/assets/img/dest-herceg-novi-275.webp" alt="Herceg Novi, Montenegro" loading="lazy" decoding="async">
        <span class="dest__label"><strong>Herceg Novi</strong><span>59 stays, the coast</span></span>
      </div>
      <div class="dest" data-reveal data-reveal-delay="2">
        <img src="/assets/img/dest-budva-253.webp" alt="Budva, Montenegro" loading="lazy" decoding="async">
        <span class="dest__label"><strong>Budva</strong><span>The Adriatic riviera</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section lp-steps" aria-labelledby="lp-steps-h">
  <div class="wrap">
    <div class="measure center" data-reveal>
      <h2 id="lp-steps-h" class="lp-h2">From your answers to your first booking</h2>
    </div>
    <div class="steps" style="margin-top:var(--s-8)">
      <div class="step" data-reveal><h3>You answer a few questions</h3><p>Your property, where it is, and how to reach you. Photos and extras are optional.</p></div>
      <div class="step" data-reveal data-reveal-delay="1"><h3>We build your listing</h3><p>Our team sets up your page, helps with photos and pricing, and gets your payout method ready.</p></div>
      <div class="step" data-reveal data-reveal-delay="2"><h3>Guests book you directly</h3><p>Your place goes live to guests searching Montenegro, with no marketplace markup between you.</p></div>
    </div>
  </div>
</section>

<section class="section lp-trust" aria-labelledby="lp-trust-h">
  <div class="wrap lp-trust__grid">
    <div data-reveal>
      <h2 id="lp-trust-h" class="lp-h2">A local team you can actually reach</h2>
      <p class="lede" style="margin-top:var(--s-3)">NorthB&amp;B is run by ${SITE.legalName} from Rožaje, Montenegro. Real people set up your listing and pick up when you need help.</p>
    </div>
    <ul class="lp-facts" data-reveal data-reveal-delay="1">
      <li>${svg("pin")}<span>${SITE.address.full}</span></li>
      <li>${svg("phone")}<a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></li>
      <li>${svg("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
      <li>${svg("shield")}<span>Co-funded by the European Union</span></li>
    </ul>
  </div>
</section>

<section class="section section--navy center lp-final">
  <div class="wrap">
    <h2 data-reveal>Ready to list your place?</h2>
    <p class="lede" style="color:#cfe1ee;margin:var(--s-3) auto 0" data-reveal>Three short steps. A real person to help. Free to start.</p>
    <div style="margin-top:var(--s-6)" data-reveal>${cta()}</div>
  </div>
</section>
`;

export const host = {
  title: "Become a host | List your Montenegro property | NorthB&B",
  desc: "Get direct bookings for your Montenegro apartment, villa or guesthouse. List free in about five minutes, with a local team to set it up and payouts via Payoneer or your bank.",
  slug: "host",
  active: "host",
  bodyClass: "refresh hostlp has-sticky-cta",
  extraHead:
    '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/newsreader-latin.woff2" crossorigin>' +
    '<link rel="preload" as="image" href="/assets/img/montenegro-coast-1100.webp" imagesrcset="/assets/img/montenegro-coast-640.webp 640w, /assets/img/montenegro-coast-1100.webp 1100w, /assets/img/montenegro-coast-1600.webp 1600w" imagesizes="(max-width: 860px) 100vw, 600px" fetchpriority="high">' +
    '<link rel="stylesheet" href="/assets/css/refresh.css"><link rel="stylesheet" href="/assets/css/hostlp.css">',
  jsonld,
  headerHtml,
  footerHtml,
  mobileCta: `<a class="btn btn--grad" href="${START}">Start your free listing</a>`,
  main,
};
