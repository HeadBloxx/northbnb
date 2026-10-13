/* Design exploration: three homepage directions at rising levels of stylization.
   Same hero, same content; what changes is how hard the Adriatic look and the USP push.
   Preview-only pages (noindex). The winning direction gets folded back into home.mjs. */
import { svg } from "../chrome.mjs";
import { heroSection, statsSection, destSection, stepsSection, hostSection, faqSection, ctaSection } from "./home.mjs";

const DESIGNS = [
  { n: 1, name: "Clean" },
  { n: 2, name: "Coastal" },
  { n: 3, name: "Bold" },
];

const switcher = (current) => `
<nav class="dswitch" aria-label="Design versions">
  <span class="dswitch__label">Design</span>
  ${DESIGNS.map((d) => `<a href="/design/${d.n}/"${d.n === current ? ' aria-current="page"' : ""}><strong>${d.n}</strong> ${d.name}</a>`).join("")}
</nav>`;

/* Wave edge used by 2 and 3 to carry the hero's water into the next section. */
const wave = (cls) => `
<svg class="${cls}" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <path d="M0 52c120-26 240-38 360-24s240 46 360 46 240-36 360-46 240 6 360 24V90H0Z"/>
</svg>`;

/* The four promises. Kept in one place so every design says the same thing. */
const USPS = [
  { icon: "handshake", big: "0%", unit: "markup", title: "No marketplace markup", body: "We work with hosts directly, so the price you see is the host's real rate. Nothing stacked on top." },
  { icon: "compass", big: "100%", unit: "Montenegro", title: "Handpicked, locally", body: "Every stay is chosen by a team that lives here. Coast, capital and mountains, nothing auto-imported." },
  { icon: "card", big: "3", unit: "ways to pay", title: "Pay your way", body: "Card or PayPal online, or settle in person on arrival. Your choice on every booking." },
  { icon: "headset", big: "24/7", unit: "real people", title: "A local team on call", body: "Help choosing, booking and mid-trip, from people who know the country. Any hour." },
];

/* ---------------- DESIGN 1: Clean ----------------
   Current system, brand palette only. The USP gets a clear statement and a tidy grid. */
const d1Usp = `
<section class="section d1-usp" aria-labelledby="d1-usp-h">
  <div class="wrap d1-usp__grid">
    <div data-reveal>
      <h2 id="d1-usp-h">Book direct with local hosts. <span>Skip the marketplace markup.</span></h2>
      <p class="lede" style="margin-top:var(--s-4)">Not a global catalogue with a local logo. A Montenegro platform with real rates and a team that knows the country.</p>
      <a class="btn btn--primary btn--lg" style="margin-top:var(--s-6)" href="/search/">${svg("search")} Find a stay</a>
    </div>
    <ul class="d1-usp__list">
      ${USPS.map((u, i) => `
      <li data-reveal data-reveal-delay="${i}">
        <span class="d1-usp__icon">${svg(u.icon, "")}</span>
        <div><h3>${u.title}</h3><p>${u.body}</p></div>
      </li>`).join("")}
    </ul>
  </div>
</section>`;

/* ---------------- DESIGN 2: Coastal ----------------
   The hero's sea flows into a deep-water USP band. Limestone and terracotta join the palette,
   destination photos sit in stone arches. */
const d2Usp = `
<section class="d2-usp" aria-labelledby="d2-usp-h">
  ${wave("d2-wave d2-wave--top")}
  <div class="wrap">
    <div class="d2-usp__head" data-reveal>
      <h2 id="d2-usp-h">The coast, without the middleman</h2>
      <p>Four promises on every NorthB&amp;B booking.</p>
    </div>
    <div class="d2-usp__grid">
      ${USPS.map((u, i) => `
      <div class="d2-tile" data-reveal data-reveal-delay="${i}">
        <div class="d2-tile__big">${u.big}<span>${u.unit}</span></div>
        <h3>${u.title}</h3>
        <p>${u.body}</p>
      </div>`).join("")}
    </div>
  </div>
  <div class="d2-roofline" aria-hidden="true"></div>
</section>`;

/* ---------------- DESIGN 3: Bold ----------------
   Editorial and loud: giant stacked statement in deep water,
   a side-by-side comparison, roof-tile divider, postcards. */
const compare = [
  ["Price", "Host rate plus marketplace markup", "The host's real rate"],
  ["Choice", "Millions of listings, auto-imported", "Stays we know, picked by hand"],
  ["Paying", "Card, upfront", "Card, PayPal, or on arrival"],
  ["Help", "A call centre abroad", "A local team, 24/7"],
];

const d3Usp = `
<section class="d3-sea" aria-labelledby="d3-sea-h">
  <div class="wrap d3-sea__grid">
    <div class="d3-statement" data-reveal>
      <h2 id="d3-sea-h"><span class="d3-w1">Direct.</span> <span class="d3-w2">Local.</span> <span class="d3-w3">Fair.</span></h2>
      <p>Montenegro booked the way locals would do it: straight with the host, at the real price, with people here who pick up the phone.</p>
    </div>
    <div class="d3-compare" data-reveal data-reveal-delay="1">
      <div class="d3-compare__head">
        <span></span><span>The big marketplaces</span><span>NorthB&amp;B</span>
      </div>
      ${compare.map(([k, them, us]) => `
      <div class="d3-compare__row">
        <span class="d3-compare__k">${k}</span>
        <span class="d3-compare__them">${svg("x")}${them}</span>
        <span class="d3-compare__us">${svg("check")}${us}</span>
      </div>`).join("")}
      <a class="btn btn--terra btn--lg" href="/search/">${svg("search")} Find a stay</a>
    </div>
  </div>
  <div class="d3-numbers">
    <div class="wrap d3-numbers__grid">
      ${USPS.map((u) => `<div data-reveal><strong>${u.big}</strong><span>${u.unit}</span></div>`).join("")}
    </div>
  </div>
  <div class="d3-tiles" aria-hidden="true"></div>
</section>`;

/* Postcard destinations for design 3. */
const postcard = (name, label, img, n) => `
  <a class="d3-card" href="/search/?destination=${encodeURIComponent(name)}" data-reveal data-reveal-delay="${n}">
    <span class="d3-card__photo"><img src="/assets/img/${img}" alt="${name}, Montenegro" loading="lazy" decoding="async"></span>
    <span class="d3-card__stamp" aria-hidden="true">${svg(["sun", "compass", "pin"][n])}</span>
    <span class="d3-card__label"><strong>${name}</strong><span>${label}</span></span>
  </a>`;

const d3Dest = `
<section class="section d3-dests-wrap" id="destinations" aria-labelledby="d3-dest-h">
  <div class="wrap">
    <div class="d3-dest-head" data-reveal>
      <h2 id="d3-dest-h">Greetings from Montenegro</h2>
      <p class="lede">The Adriatic coast, the capital, the mountains. Pick a postcard.</p>
    </div>
    <div class="d3-cards">
      ${postcard("Podgorica", "79 stays · the capital", "dest-podgorica-275.webp", 0)}
      ${postcard("Herceg Novi", "59 stays · the coast", "dest-herceg-novi-275.webp", 1)}
      ${postcard("Budva", "The Adriatic riviera", "dest-budva-253.webp", 2)}
    </div>
    <p style="margin-top:var(--s-7)" data-reveal><a class="link-arrow" href="/search/">See every destination ${svg("arrowRight")}</a></p>
  </div>
</section>`;

/* Design 3 runs on the refresh layer: Newsreader + Airbnb-style controls. */
const REFRESH_HEAD = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/newsreader-latin.woff2" crossorigin><link rel="stylesheet" href="/assets/css/refresh.css">';

const page = (n, main) => ({
  title: `Design ${n} | NorthB&B homepage directions`,
  desc: "Design exploration for the NorthB&B homepage.",
  slug: `design/${n}`,
  noindex: true,
  preloadHero: true,
  bodyClass: `design d${n} has-sticky-cta${n === 3 ? " refresh" : ""}`,
  extraHead: '<link rel="stylesheet" href="/assets/css/designs.css">' + (n === 3 ? REFRESH_HEAD : ""),
  mobileCta: `<a class="btn btn--primary" href="/search/">${svg("search")} Find a stay</a>`,
  main: main + switcher(n),
});

export const design1 = page(1, [heroSection, d1Usp, statsSection, destSection, stepsSection, hostSection, faqSection, ctaSection].join("\n"));
export const design2 = page(2, [heroSection, d2Usp, destSection, stepsSection, hostSection, faqSection, ctaSection].join("\n"));
export const design3 = page(3, [heroSection, d3Usp, d3Dest, stepsSection, hostSection, faqSection, ctaSection].join("\n"));
