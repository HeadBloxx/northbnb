import { SITE, svg } from "../chrome.mjs";

const mapUrl = "https://maps.google.com/?q=" + encodeURIComponent(SITE.address.full);

const jsonld = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact NorthB&B",
    url: SITE.url + "/contact/",
    mainEntity: {
      "@id": SITE.url + "/#org",
      "@type": "TravelAgency",
      name: SITE.name,
      telephone: SITE.phoneDisplay,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressCountry: "ME",
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: "Contact", item: SITE.url + "/contact/" },
    ],
  },
];

const detail = (icon, label, valueHtml) => `
  <div style="display:grid;grid-template-columns:44px 1fr;gap:var(--s-4);align-items:start">
    <div class="feature__icon" style="color:var(--sky-600)">${svg(icon, "")}</div>
    <div><h3 style="font-size:1rem;margin-bottom:4px">${label}</h3>${valueHtml}</div>
  </div>`;

const main = `
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact</span></nav>
    <h1>Talk to a real person</h1>
    <p>Questions about a booking, a property, or listing your own place? We're here, and we actually reply.</p>
  </div>
</section>

<section class="section">
  <div class="wrap split" style="--cols:1fr 1.1fr">
    <div class="stack" data-reveal>
      <h2>However suits you</h2>
      <div class="stack" style="margin-top:var(--s-5);gap:var(--s-5)">
        ${detail("pin", "Head office", `<p><a href="${mapUrl}" rel="noopener" target="_blank" style="color:var(--navy);font-weight:600">${SITE.address.full}</a></p>`)}
        ${detail("phone", "Phone &amp; WhatsApp", `<p><a href="tel:${SITE.phoneHref}" style="color:var(--navy);font-weight:700">${SITE.phoneDisplay}</a></p>`)}
        ${detail("mail", "Email", `<p><a href="mailto:${SITE.email}" style="color:var(--navy);font-weight:700">${SITE.email}</a></p>`)}
        ${detail("headset", "Guest support", `<p>Available 24/7, before you travel and throughout your stay.</p>`)}
      </div>
      <p style="margin-top:var(--s-6)"><a class="link-arrow" href="${SITE.hostDashboardUrl}" rel="noopener" target="_blank">Already a host? Sign in to the host dashboard ${svg("arrowRight")}</a></p>
    </div>

    <div class="form-card" data-reveal data-reveal-delay="1">
      <h2 style="font-size:1.4rem">Send us a message</h2>
      <form data-form="contact" action="/api/contact" method="post" novalidate style="margin-top:var(--s-5)">
        <div class="form-row form-row--2">
          <div class="form-field">
            <label for="c-name">Your name</label>
            <input class="input" id="c-name" name="name" autocomplete="name" placeholder="First and last name" required>
          </div>
          <div class="form-field">
            <label for="c-email">Email</label>
            <input class="input" id="c-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
          </div>
        </div>
        <div class="form-field" style="margin-top:var(--s-4)">
          <label for="c-subject">Subject <span class="hint">(optional)</span></label>
          <input class="input" id="c-subject" name="subject" placeholder="What's this about?">
        </div>
        <div class="form-field" style="margin-top:var(--s-4)">
          <label for="c-message">Message</label>
          <textarea class="textarea" id="c-message" name="message" placeholder="How can we help?" required></textarea>
        </div>
        <button class="btn btn--primary btn--block btn--lg" type="submit" style="margin-top:var(--s-5)">Send message</button>
        <p class="form-status" role="status" aria-live="polite" data-form-msg="contact" style="margin-top:var(--s-4);min-height:1.2em;font-weight:600"></p>
      </form>
    </div>
  </div>
</section>
`;

export const contact = {
  title: "Contact NorthB&B, we actually reply | Montenegro stays",
  desc: "Get in touch with NorthB&B about a booking, a property or hosting. Call +382 69 289 866, email info@northbnb.com, or send a message. Guest support available 24/7.",
  slug: "contact",
  active: "contact",
  jsonld,
  main,
};
