import { SITE } from "../chrome.mjs";

const UPDATED = "12 October 2026";

function legalHero(title, sub) {
  return `
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>${title}</span></nav>
    <h1>${title}</h1>
    <p>${sub}</p>
    <p style="margin-top:var(--s-3);color:#9fc0d6;font-size:0.9rem">Last updated: ${UPDATED}</p>
  </div>
</section>`;
}

function toc(items) {
  return `<div class="toc"><h2>On this page</h2><ol>${items
    .map((i) => `<li><a href="#${i[0]}">${i[1]}</a></li>`)
    .join("")}</ol></div>`;
}

const breadcrumb = (name, slug) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
    { "@type": "ListItem", position: 2, name: name, item: SITE.url + "/legal/" + slug + "/" },
  ],
});

/* ============================ PRIVACY ============================ */
const privacyMain = `
${legalHero("Privacy Policy", "How " + SITE.legalName + " (NorthB&B) collects, uses and protects your personal information.")}
<section class="section"><div class="wrap wrap--narrow prose">
  ${toc([
    ["who", "Who we are"],
    ["collect", "Information we collect"],
    ["use", "How we use your information"],
    ["bases", "Our legal bases (GDPR)"],
    ["share", "When we share information"],
    ["transfers", "International transfers"],
    ["retention", "How long we keep information"],
    ["security", "How we protect information"],
    ["rights", "Your privacy rights"],
    ["cookies", "Cookies"],
    ["children", "Children"],
    ["changes", "Changes to this policy"],
    ["contact", "How to contact us"],
  ])}

  <h2 id="who">Who we are</h2>
  <p>NorthB&amp;B is operated by ${SITE.legalName} ("NorthB&amp;B", "we", "us", "our"), based at ${SITE.address.full}. We provide an online platform that connects travellers with private accommodation across Montenegro and helps property owners list and manage their stays. This Privacy Policy explains how we handle personal information collected through ${SITE.url} and related services (the "Service").</p>
  <p>This policy is written to meet the EU and UK General Data Protection Regulation (GDPR) as well as applicable Montenegrin data-protection law. If you are in the European Economic Area or the United Kingdom, the section on your rights applies to you in full.</p>

  <h2 id="collect">Information we collect</h2>
  <h3>Information you give us</h3>
  <ul>
    <li><strong>Booking &amp; enquiry details</strong>: such as your name, email, phone number, nationality, travel dates and the property or destination you are interested in.</li>
    <li><strong>Host applications</strong>: if you apply to list a property, the details you submit about the property, its location and capacity, your contact details and your preferred payout method.</li>
    <li><strong>Messages</strong>: the content of any contact form, email or message you send us.</li>
    <li><strong>Newsletter</strong>: your email address, if you choose to subscribe.</li>
  </ul>
  <p>Payment card details are handled by our payment providers and are not collected or stored by us directly.</p>
  <h3>Information collected automatically</h3>
  <ul>
    <li><strong>Technical &amp; usage data</strong>: IP address, browser and device type, pages viewed and the dates/times of your visits, collected to keep the Service secure and working.</li>
    <li><strong>Cookies &amp; similar technologies</strong>: see our <a href="/legal/cookies/">Cookie Notice</a> for details.</li>
  </ul>

  <h2 id="use">How we use your information</h2>
  <ul>
    <li>To respond to your enquiries and provide the stays, bookings and host services you ask for.</li>
    <li>To set up and manage host listings and arrange payouts to hosts.</li>
    <li>To send service messages, and, where you have opted in, updates and offers.</li>
    <li>To operate, secure, troubleshoot and improve the Service, and to prevent fraud and abuse.</li>
    <li>To comply with our legal obligations and enforce our terms.</li>
  </ul>

  <h2 id="bases">Our legal bases (GDPR)</h2>
  <p>Where GDPR applies, we rely on: <strong>performance of a contract</strong> (to provide services you request); <strong>your consent</strong> (for marketing emails and non-essential cookies, which you can withdraw at any time); <strong>our legitimate interests</strong> (to run, secure and improve the Service, balanced against your rights); and <strong>compliance with legal obligations</strong>.</p>

  <h2 id="share">When we share information</h2>
  <p>We do not sell your personal information. We share it only as needed:</p>
  <ul>
    <li><strong>With hosts and guests</strong>: to arrange and fulfil a booking between you and the relevant party.</li>
    <li><strong>With service providers</strong>: hosting (Cloudflare), our booking platform provider, email delivery, and payment providers (for example PayPal and Payoneer) who process payments and host payouts under their own privacy terms.</li>
    <li><strong>For legal reasons</strong>: where required by law, to protect our rights, or in connection with a corporate transaction.</li>
  </ul>

  <h2 id="transfers">International transfers</h2>
  <p>Some providers may process data outside your country, including outside the EEA/UK. Where that happens, we rely on appropriate safeguards such as the European Commission's Standard Contractual Clauses or an adequacy decision.</p>

  <h2 id="retention">How long we keep information</h2>
  <p>We keep personal information only as long as needed for the purposes above. For example, enquiry and lead records are retained for a limited period to follow up and meet our obligations, after which they are deleted or anonymised. You can ask us to delete your information sooner (see your rights below).</p>

  <h2 id="security">How we protect information</h2>
  <p>We use technical and organisational measures appropriate to the risk, including encryption in transit (HTTPS), access controls, input validation and rate limiting. No method of transmission or storage is completely secure, but we work to protect your information and to respond promptly to any incident.</p>

  <h2 id="rights">Your privacy rights</h2>
  <p>Subject to applicable law, you may have the right to: access the personal information we hold about you; have it corrected or deleted; restrict or object to certain processing; receive your data in a portable format; and withdraw consent at any time. To exercise any of these, email us at <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
  <p>If you are in the EEA or UK and believe we have not handled your information properly, you may lodge a complaint with your local supervisory authority. In Montenegro, this is the Agency for Personal Data Protection and Free Access to Information (AZLP).</p>

  <h2 id="cookies">Cookies</h2>
  <p>We use only essential cookies and similar technologies needed to run the site. We do not currently use advertising or third-party analytics cookies. Full details, and how to control cookies, are in our <a href="/legal/cookies/">Cookie Notice</a>.</p>

  <h2 id="children">Children</h2>
  <p>The Service is intended for adults. We do not knowingly collect personal information from children under 16. If you believe a child has provided us information, please contact us and we will delete it.</p>

  <h2 id="changes">Changes to this policy</h2>
  <p>We may update this policy from time to time. We will change the "last updated" date above and, where appropriate, notify you. Please check back periodically.</p>

  <h2 id="contact">How to contact us</h2>
  <p>Questions or requests about this policy or your data: email <a href="mailto:${SITE.email}">${SITE.email}</a>, call <a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a>, or write to ${SITE.legalName}, ${SITE.address.full}.</p>
</div></section>
`;

/* ============================ COOKIES ============================ */
const cookiesMain = `
${legalHero("Cookie Notice", "How NorthB&B uses cookies and similar technologies on " + SITE.url + ".")}
<section class="section"><div class="wrap wrap--narrow prose">
  <h2 id="what">What are cookies?</h2>
  <p>Cookies are small data files placed on your device when you visit a website. They help a site work, remember your preferences, and understand how it is used. Some cookies are "session" cookies (deleted when you close your browser) and some are "persistent" (they stay until they expire or you delete them).</p>

  <h2 id="use">How we use cookies</h2>
  <p>NorthB&amp;B keeps cookie use to a minimum. We currently use only <strong>strictly necessary</strong> storage, for example, remembering that you have dismissed our cookie banner, and the technical essentials needed to serve pages securely. We do <strong>not</strong> currently use advertising cookies or third-party analytics that track you across sites.</p>

  <h3>Cookies and storage we use</h3>
  <table style="width:100%;border-collapse:collapse;margin-top:var(--s-3);font-size:0.95rem">
    <thead><tr style="text-align:left;border-bottom:2px solid var(--line-strong)">
      <th style="padding:var(--s-3) var(--s-2)">Name</th><th style="padding:var(--s-3) var(--s-2)">Purpose</th><th style="padding:var(--s-3) var(--s-2)">Type</th>
    </tr></thead>
    <tbody>
      <tr style="border-bottom:1px solid var(--line)"><td style="padding:var(--s-3) var(--s-2)"><code>nb_cookie_ack</code></td><td style="padding:var(--s-3) var(--s-2)">Remembers that you dismissed the cookie banner</td><td style="padding:var(--s-3) var(--s-2)">Essential · persistent (local)</td></tr>
      <tr style="border-bottom:1px solid var(--line)"><td style="padding:var(--s-3) var(--s-2)">Security essentials</td><td style="padding:var(--s-3) var(--s-2)">Protect forms and serve pages securely (served by our host, Cloudflare)</td><td style="padding:var(--s-3) var(--s-2)">Essential</td></tr>
    </tbody>
  </table>
  <p style="margin-top:var(--s-3)">If we introduce analytics or other non-essential cookies in future, we will update this notice and ask for your consent first.</p>

  <h2 id="control">How to control cookies</h2>
  <p>Because we only use essential storage, the site will not work correctly if it is blocked entirely. You can still manage or delete cookies through your browser settings. Most browsers let you block or remove cookies and clear site data. Links to common browsers' instructions are available in their own help pages.</p>

  <h2 id="payment">Third-party services</h2>
  <p>When you proceed to pay or are handed off to our booking system, those providers (for example our booking platform, PayPal or Payoneer) may set their own cookies under their own policies. Please refer to their notices for details.</p>

  <h2 id="changes">Changes</h2>
  <p>We may update this Cookie Notice as our practices change. The "last updated" date above shows the latest version.</p>

  <h2 id="contact">Contact</h2>
  <p>Questions about cookies: email <a href="mailto:${SITE.email}">${SITE.email}</a>. See also our <a href="/legal/privacy/">Privacy Policy</a>.</p>
</div></section>
`;

/* ============================ TERMS ============================ */
const termsMain = `
${legalHero("Terms of Use", "The terms that govern your use of " + SITE.url + ".")}
<section class="section"><div class="wrap wrap--narrow prose">
  ${toc([
    ["accept", "Acceptance of these terms"],
    ["role", "Our role"],
    ["accounts", "Accounts"],
    ["bookings", "Bookings and payments"],
    ["hosts", "Hosts"],
    ["use", "Acceptable use"],
    ["ip", "Intellectual property"],
    ["thirdparty", "Third-party services and links"],
    ["disclaimer", "Disclaimers"],
    ["liability", "Limitation of liability"],
    ["law", "Governing law"],
    ["changes", "Changes"],
    ["contact", "Contact"],
  ])}

  <h2 id="accept">Acceptance of these terms</h2>
  <p>${SITE.url} (the "Site") is owned and operated by ${SITE.legalName} ("Company", "we", "us", "our"). By accessing or using the Site you agree to these Terms of Use ("Terms"). You must be at least 18 years old to use the Site. If you do not agree, please do not use the Site.</p>

  <h2 id="role">Our role</h2>
  <p>NorthB&amp;B is a platform that connects guests with private accommodation and helps hosts list their properties. A booking is a contract between the guest and the host (or the property provider). We facilitate the introduction and the booking process; we are not the provider of the accommodation itself, and the host is responsible for the stay and for the accuracy of their listing.</p>

  <h2 id="accounts">Accounts</h2>
  <p>Some features (such as managing bookings or a host listing) require an account on our booking system. You agree to provide accurate information and to keep your login details confidential. You are responsible for activity under your account. Tell us promptly if you suspect unauthorised use.</p>

  <h2 id="bookings">Bookings and payments</h2>
  <p>Prices, availability and the terms of each stay (including cancellation terms) are shown during booking and may vary by property. Payments may be taken online by card or PayPal, or on arrival, as indicated for the stay. Where applicable, host payouts are made via Payoneer or bank transfer. You are responsible for providing accurate booking and payment information.</p>

  <h2 id="hosts">Hosts</h2>
  <p>If you list a property, you confirm that you are entitled to offer it, that your listing is accurate and lawful, and that you will honour confirmed bookings. Commission and payout terms are agreed during onboarding. You are responsible for any taxes and permits that apply to hosting your property.</p>

  <h2 id="use">Acceptable use</h2>
  <p>You agree not to misuse the Site, including: breaking the law; infringing others' rights; attempting to disrupt, probe or gain unauthorised access to the Site or its systems; scraping or harvesting data; submitting false or fraudulent information; or using the Site to build a competing service. We may suspend access for breach of these Terms.</p>

  <h2 id="ip">Intellectual property</h2>
  <p>The Site, its design, text, graphics and logos are owned by the Company or its licensors and are protected by law. We grant you a limited, personal, non-transferable licence to use the Site for its intended purpose. You may not copy, modify, distribute or commercially exploit any part of the Site without our permission.</p>

  <h2 id="thirdparty">Third-party services and links</h2>
  <p>The Site relies on, and links to, third-party services (for example our booking platform and payment providers). Your use of those services is governed by their terms and privacy policies. We are not responsible for third-party websites or services.</p>

  <h2 id="disclaimer">Disclaimers</h2>
  <p>The Site is provided "as is" and "as available". To the extent permitted by law, we disclaim warranties of any kind regarding the Site, including that it will be uninterrupted or error-free, and we do not warrant the accuracy of third-party listing content.</p>

  <h2 id="liability">Limitation of liability</h2>
  <p>To the maximum extent permitted by law, the Company is not liable for indirect, incidental or consequential losses arising from your use of the Site. Nothing in these Terms limits liability that cannot be limited by law (such as for death or personal injury caused by negligence, or for fraud). Our dealings in relation to a booking are without prejudice to your statutory consumer rights.</p>

  <h2 id="law">Governing law</h2>
  <p>These Terms are governed by the laws of Montenegro, and the courts of Montenegro have jurisdiction over any dispute, without prejudice to any mandatory consumer-protection rights you have where you live.</p>

  <h2 id="changes">Changes</h2>
  <p>We may update these Terms from time to time. Changes take effect when posted here, with the "last updated" date revised. Your continued use of the Site means you accept the updated Terms.</p>

  <h2 id="contact">Contact</h2>
  <p>Questions about these Terms: email <a href="mailto:${SITE.email}">${SITE.email}</a> or write to ${SITE.legalName}, ${SITE.address.full}.</p>
</div></section>
`;

export const privacy = {
  title: "Privacy Policy | NorthB&B",
  desc: "How Trip North LLC (NorthB&B) collects, uses and protects your personal information, and your rights under GDPR and Montenegrin law.",
  slug: "legal/privacy",
  active: "",
  jsonld: [breadcrumb("Privacy Policy", "privacy")],
  main: privacyMain,
};

export const cookies = {
  title: "Cookie Notice | NorthB&B",
  desc: "How NorthB&B uses cookies and similar technologies. We keep cookie use to the essentials and do not use third-party advertising cookies.",
  slug: "legal/cookies",
  active: "",
  jsonld: [breadcrumb("Cookie Notice", "cookies")],
  main: cookiesMain,
};

export const terms = {
  title: "Terms of Use | NorthB&B",
  desc: "The terms that govern your use of northbnb.com, including our role, bookings and payments, host obligations, and governing law.",
  slug: "legal/terms",
  active: "",
  jsonld: [breadcrumb("Terms of Use", "terms")],
  main: termsMain,
};
