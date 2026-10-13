import { SITE, svg } from "../chrome.mjs";

const DESTS = ["Podgorica", "Herceg Novi", "Budva", "Bar", "Kotor", "Žabljak", "Tivat", "Ulcinj", "Bijelo Polje", "Plav"];

export const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": SITE.url + "/#org",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url + "/",
    logo: SITE.url + "/icon-512.png",
    image: SITE.url + "/assets/img/hero-montenegro-1600.jpg",
    description: "Handpicked private accommodation across Montenegro, booked directly with local hosts.",
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressCountry: "ME",
    },
    areaServed: { "@type": "Country", name: "Montenegro" },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.linkedin, SITE.social.x],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE.url + "/",
    name: SITE.name,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: SITE.url + "/search/?destination={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ["Where in Montenegro can I book a stay?", "Across the country: coastal towns such as Herceg Novi and Budva, the capital Podgorica, and mountain spots near Žabljak. Search by town and dates to see what's available."],
      ["How do I pay for a booking?", "By major credit card or PayPal online, or on arrival at the property. You choose the method that suits your trip."],
      ["Is booking with NorthB&B cheaper than the big travel sites?", "We work directly with hosts, so there is no added marketplace markup. The rate you see is the real, best rate."],
      ["Can I get help if something comes up during my trip?", "Yes. Our support team is available 24/7 to help you choose and book, and to sort out anything that comes up while you travel."],
      ["How do I list my own property?", "Use the guided host signup. It takes a few minutes. We handle the setup and a real person helps you get your listing live."],
    ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
];

const feature = (icon, title, body) => `
  <div class="feature" data-reveal>
    <div class="feature__icon">${svg(icon, "")}</div>
    <div>
      <h3>${title}</h3>
      <p>${body}</p>
    </div>
  </div>`;

const dest = (name, label, img) => `
  <a class="dest" href="/search/?destination=${encodeURIComponent(name)}" data-reveal>
    <img src="/assets/img/${img}" alt="${name}, Montenegro" loading="lazy" decoding="async">
    <span class="dest__label"><strong>${name}</strong><span>${label}</span></span>
  </a>`;

const step = (title, body) => `
  <div class="step" data-reveal>
    <h3>${title}</h3>
    <p>${body}</p>
  </div>`;

const faq = (q, a) => `
  <details data-reveal>
    <summary>${q}${svg("plus")}</summary>
    <p>${a}</p>
  </details>`;

export const heroSection = `
<section class="hero" aria-label="Find a stay in Montenegro">
  <div class="hero__media">
    <picture>
      <source type="image/webp" srcset="/assets/img/hero-montenegro-480.webp 480w, /assets/img/hero-montenegro-960.webp 960w, /assets/img/hero-montenegro-1600.webp 1600w, /assets/img/hero-montenegro-2000.webp 2000w" sizes="100vw">
      <img src="/assets/img/hero-montenegro-1600.jpg" width="1600" height="1067" alt="Aerial view of a Montenegro coastal town beside the Adriatic" fetchpriority="high" decoding="async">
    </picture>
  </div>
  <div class="wrap hero__inner">
    <h1>Experience Montenegro, one handpicked stay at a time</h1>
    <p class="hero__sub">Private apartments, coastal villas and family-run hotels across the country, booked directly with the people who look after them.</p>

    <form class="searchbar" action="/search/" method="get" role="search" aria-label="Search stays">
      <div class="field">
        <label for="s-dest">Destination</label>
        <div class="field__control">${svg("pin")}
          <input id="s-dest" name="destination" list="dest-list" placeholder="Town or area" autocomplete="off">
        </div>
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
      <button class="btn btn--primary" type="submit">${svg("search")} Search stays</button>
    </form>

    <p style="margin-top:var(--s-4)"><a class="link-arrow" style="color:#eaf4fb" href="/host/start/">Own a place in Montenegro? List it in minutes ${svg("arrowRight")}</a></p>
  </div>
</section>
`;

export const statsSection = `
<section class="stats" aria-label="NorthB&amp;B at a glance">
  <div class="wrap section--tight">
    <div class="stats__grid">
      <div data-reveal><div class="stat__num" data-count="195" data-suffix="+">195+</div><div class="stat__label">Private stays listed</div></div>
      <div data-reveal data-reveal-delay="1"><div class="stat__num" data-count="6">6</div><div class="stat__label">Destinations across Montenegro</div></div>
      <div data-reveal data-reveal-delay="2"><div class="stat__num">24/7</div><div class="stat__label">Support before &amp; during your trip</div></div>
      <div data-reveal data-reveal-delay="3"><div class="stat__num" data-count="3">3</div><div class="stat__label">Ways to pay for your stay</div></div>
    </div>
  </div>
</section>
`;

export const whySection = `
<section class="section">
  <div class="wrap">
    <div class="measure" data-reveal>
      <h2>A booking platform built around Montenegro</h2>
      <p class="lede" style="margin-top:var(--s-3)">Not a global catalogue with a local logo. Handpicked properties, direct rates, and a team that actually knows the country.</p>
    </div>
    <div class="features" style="margin-top:var(--s-7)">
      ${feature("handshake", "Best-rate, direct booking", "We work directly with hundreds of hosts and providers, so the price you see is the real one, without the inflated markup of the big marketplaces.")}
      ${feature("building", "Stays for every kind of trip", "Apartments, villas, family-run hotels, hostels and even campgrounds, handpicked across the coast, the mountains and the cities.")}
      ${feature("card", "Pay the way that suits you", "Use a major credit card or PayPal online, or settle on arrival at the property. The choice is yours on every booking.")}
      ${feature("headset", "Real people, around the clock", "Our team helps you choose and book, and if something comes up mid-trip they are online to find a solution, 24 hours a day.")}
    </div>
  </div>
</section>
`;

export const destSection = `
<section class="section section--mist" id="destinations">
  <div class="wrap">
    <div class="measure" data-reveal>
      <h2>Places to stay in Montenegro</h2>
      <p class="lede" style="margin-top:var(--s-3)">From the Adriatic coast to the capital and the northern mountains. Start with one of these.</p>
    </div>
    <div class="dests" style="margin-top:var(--s-7)">
      ${dest("Podgorica", "79 stays · the capital", "dest-podgorica-275.webp")}
      ${dest("Herceg Novi", "59 stays · the coast", "dest-herceg-novi-275.webp")}
      ${dest("Budva", "The Adriatic riviera", "dest-budva-253.webp")}
    </div>
    <p style="margin-top:var(--s-6)" data-reveal><a class="link-arrow" href="/search/">See every destination ${svg("arrowRight")}</a></p>
  </div>
</section>
`;

export const stepsSection = `
<section class="section">
  <div class="wrap">
    <div class="measure center" data-reveal>
      <h2>Booking a stay takes three steps</h2>
    </div>
    <div class="steps" style="margin-top:var(--s-8)">
      ${step("Tell us where and when", "Search by town and dates. We show real availability from local hosts, no endless scrolling through places that aren't free.")}
      ${step("Book directly", "Reserve in a few steps and pay the way you prefer. Because it's direct, there's no marketplace markup added on top.")}
      ${step("Travel with backup", "Keep our team one message away, before you leave and all the way through your stay, any hour of the day.")}
    </div>
  </div>
</section>
`;

export const hostSection = `
<section class="hostband section">
  <div class="wrap hostband__grid">
    <div data-reveal>
      <h2>List your Montenegro property and start earning</h2>
      <p style="margin-top:var(--s-4)">Join the hosts already reaching guests through NorthB&amp;B. Signup is short and guided, your listing is handled with a personal touch, and getting paid is simple, worldwide.</p>
      <ul>
        <li>${svg("check")}<span>A short, guided signup. No long forms or paperwork to wade through.</span></li>
        <li>${svg("check")}<span>Direct bookings at a fair commission, not lost in a global marketplace.</span></li>
        <li>${svg("check")}<span>Get paid worldwide with Payoneer, or straight to your bank.</span></li>
        <li>${svg("check")}<span>A real person helps you set up and get your first guests.</span></li>
      </ul>
      <div style="display:flex;flex-wrap:wrap;gap:var(--s-4);align-items:center;margin-top:var(--s-6)">
        <a class="btn btn--sky btn--lg" href="/host/start/">List your property</a>
        <a class="link-arrow" style="color:#cfe1ee" href="${SITE.hostDashboardUrl}" rel="noopener" target="_blank">Already a host? Sign in ${svg("arrowRight")}</a>
      </div>
    </div>
    <div class="hostband__media" data-reveal data-reveal-delay="1">
      <img src="/assets/img/montenegro-coast-1100.webp" width="1100" height="733" alt="Coastal village and mountains along the Montenegro shoreline" loading="lazy" decoding="async">
    </div>
  </div>
</section>
`;

export const faqSection = `
<section class="section section--mist">
  <div class="wrap">
    <div class="measure center" data-reveal>
      <h2>Questions, answered</h2>
    </div>
    <div class="faq" style="margin-top:var(--s-7)">
      ${faq("Where in Montenegro can I book a stay?", "Across the country: coastal towns such as Herceg Novi and Budva, the capital Podgorica, and mountain spots near Žabljak. Search by town and dates to see what's available.")}
      ${faq("How do I pay for a booking?", "By major credit card or PayPal online, or on arrival at the property. You choose the method that suits your trip.")}
      ${faq("Is booking with NorthB&amp;B cheaper than the big travel sites?", "We work directly with hosts, so there's no added marketplace markup. The rate you see is the real, best rate.")}
      ${faq("Can I get help if something comes up during my trip?", "Yes. Our support team is available 24/7 to help you choose and book, and to sort out anything that comes up while you travel.")}
      ${faq("How do I list my own property?", "Use the guided <a href='/host/start/'>host signup</a>. It takes a few minutes. We handle the setup and a real person helps you get your listing live.")}
    </div>
  </div>
</section>
`;

export const ctaSection = `
<section class="section section--navy center">
  <div class="wrap">
    <h2 data-reveal>Find your place in Montenegro</h2>
    <p class="lede" style="color:#cfe1ee;margin:var(--s-3) auto 0" data-reveal>Real availability, direct rates, and people who know the country.</p>
    <div style="display:flex;flex-wrap:wrap;gap:var(--s-4);justify-content:center;margin-top:var(--s-6)" data-reveal>
      <a class="btn btn--sky btn--lg" href="/search/">${svg("search")} Find a stay</a>
      <a class="btn btn--ghost-on-dark btn--lg" href="/host/start/">Become a host</a>
    </div>
  </div>
</section>
`;

/* The four promises. Kept in one place so every design says the same thing. */
const USPS = [
  { icon: "handshake", big: "0%", unit: "markup", title: "No marketplace markup", body: "We work with hosts directly, so the price you see is the host's real rate. Nothing stacked on top." },
  { icon: "compass", big: "100%", unit: "Montenegro", title: "Handpicked, locally", body: "Every stay is chosen by a team that lives here. Coast, capital and mountains, nothing auto-imported." },
  { icon: "card", big: "3", unit: "ways to pay", title: "Pay your way", body: "Card or PayPal online, or settle in person on arrival. Your choice on every booking." },
  { icon: "headset", big: "24/7", unit: "real people", title: "A local team on call", body: "Help choosing, booking and mid-trip, from people who know the country. Any hour." },
];

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

const main = [heroSection, d3Usp, d3Dest, stepsSection, hostSection, faqSection, ctaSection].join("\n");

export const home = {
  title: "NorthB&B | Private stays across Montenegro, booked directly",
  desc: "Book handpicked private apartments, coastal villas and family-run hotels across Montenegro, directly with local hosts, at the best rate, with 24/7 support.",
  slug: "",
  active: "",
  preloadHero: true,
  bodyClass: "has-sticky-cta",
  jsonld,
  mobileCta: `<a class="btn btn--primary" href="/search/">${svg("search")} Find a stay</a>`,
  main,
};
