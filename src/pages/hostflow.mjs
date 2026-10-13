/* Full-screen "become a host" flow, modelled on Airbnb's: one question per screen,
   three phases with an illustrated intro each, a fixed progress bar and Back / Next.
   Required: type, town, contact, payout, consent. Everything else is optional and
   the Next button reads "Skip" until the host fills it in.
   Posts to /api/host-signup (multipart, photos compressed client-side). */
import { SITE, svg, logoMark } from "../chrome.mjs";
import { PROJ, MNE_PATH, NEIGHBOURS_PATH, LAKE_PATH } from "../mapdata.mjs";

/* Extra line icons for this flow, same drawing rules as chrome.mjs. */
const I = {
  apartment: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M9.5 20.5v-2h5v2"/>',
  villa: '<path d="m3 11 7-5.5 7 5.5"/><path d="M5 9.5V16h10V9.5"/><path d="M8.5 16v-3.5h3V16"/><path d="M2 20c1.3 0 2-.8 3.3-.8s2 .8 3.4.8 2-.8 3.3-.8 2 .8 3.3.8 2-.8 3.4-.8 2 .8 3.3.8"/>',
  house: '<path d="m4 11 8-6.5 8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  guesthouse: '<path d="M3 20V9l9-5.5L21 9v11"/><path d="M3 20h18M7 20v-6h4v6M14 12h3v3h-3z"/>',
  hotel: '<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 12v0M12 9.5V8M10.5 8h3"/><path d="M3 21h18"/>',
  hostel: '<path d="M4 3v18M20 3v18M4 10h16M4 17h16"/><path d="M7.5 10V8h5v2M7.5 17v-2h5v2"/>',
  tent: '<path d="M2.5 20 12 4l9.5 16h-19Z"/><path d="M9.5 20 12 14.5l2.5 5.5"/>',
  wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.2v.1"/>',
  snow: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="m9.3 4.3 2.7 1.8 2.7-1.8M9.3 19.7l2.7-1.8 2.7 1.8"/>',
  pot: '<path d="M4 10h16v5.5a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 15.5V10Z"/><path d="M2 10h20M9 6.8c0-1 .8-1.6.8-2.6M14 6.8c0-1 .8-1.6.8-2.6"/>',
  car: '<path d="M4.5 12 6.6 7h10.8l2.1 5"/><rect x="3" y="12" width="18" height="5" rx="1.5"/><path d="M6 17v2M18 17v2M7 14.5h1M16 14.5h1"/>',
  washer: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><path d="M7.5 6.5v.01M10.5 6.5h3"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10" rx="1.5"/><path d="M2 19h20"/>',
  paw: '<circle cx="6.5" cy="10.5" r="1.7"/><circle cx="10" cy="6.8" r="1.7"/><circle cx="14" cy="6.8" r="1.7"/><circle cx="17.5" cy="10.5" r="1.7"/><path d="M12 12c-2.5 0-5 3.4-5 5.4 0 1.5 1.2 2.1 2.6 2.1 1 0 1.6-.5 2.4-.5s1.4.5 2.4.5c1.4 0 2.6-.6 2.6-2.1 0-2-2.5-5.4-5-5.4Z"/>',
  waves: '<path d="M2 8.5c1.7 0 2.3-1.2 4-1.2s2.3 1.2 4 1.2 2.3-1.2 4-1.2 2.3 1.2 4 1.2 2.3-1.2 4-1.2M2 13.5c1.7 0 2.3-1.2 4-1.2s2.3 1.2 4 1.2 2.3-1.2 4-1.2 2.3 1.2 4 1.2 2.3-1.2 4-1.2M2 18.5c1.7 0 2.3-1.2 4-1.2s2.3 1.2 4 1.2 2.3-1.2 4-1.2 2.3 1.2 4 1.2 2.3-1.2 4-1.2"/>',
  mountain: '<path d="m2 20 7-12 4 6 2.5-3.5L22 20H2Z"/><path d="m7.3 10.9 1.7 1.3 1.6-1.3"/>',
  pool: '<path d="M8 15V5.5a2 2 0 0 1 4 0M14 15V5.5a2 2 0 0 1 4 0M8 8.5h6M8 12h6"/><path d="M2 18.5c1.7 0 2.3-1 4-1s2.3 1 4 1 2.3-1 4-1 2.3 1 4 1 2.3-1 4-1"/>',
  balcony: '<path d="M7 3h10v9H7z"/><path d="M12 3v9M3 12h18M5 12v8M9.5 12v8M14.5 12v8M19 12v8M3 20h18"/>',
  grill: '<path d="M4 9h16a8 8 0 0 1-16 0Z"/><path d="m9 16.5-2 4.5M15 16.5l2 4.5M8 5.6c0-1 1-1.5 1-2.6M12 5.6c0-1 1-1.5 1-2.6M16 5.6c0-1 1-1.5 1-2.6"/>',
  coffee: '<path d="M4 9h13v4.5A5.5 5.5 0 0 1 11.5 19h-2A5.5 5.5 0 0 1 4 13.5V9Z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5c0 1-1 1.5-1 2.5M12 3.5c0 1-1 1.5-1 2.5"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5H3Z"/><path d="M5.5 10v7M9.8 10v7M14.2 10v7M18.5 10v7M3 20h18"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M10 9a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.4M12 14v.01"/>',
  minus: '<path d="M5 12h14"/>',
  upload: '<path d="M12 15.5V4M7 9l5-5 5 5M4 15.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3.5"/>',
};
const ico = (name, cls = "ico") =>
  I[name]
    ? `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name]}</svg>`
    : svg(name, cls);

/* Headline words animate in one after another. */
const words = (t) => t.split(" ").map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");

/* ---------------- Montenegro map (real borders, no map API) ---------------- */
const X = (lon) => (lon - PROJ.lon0) * PROJ.kx + PROJ.ox;
const Y = (lat) => (PROJ.lat0 - lat) * PROJ.ky + PROJ.oy;
const f = (n) => Math.round(n * 10) / 10;

/* Well-known towns: dots on the map and one-tap chips. Anything else comes from the live search. */
const TOWNS = {
  Budva: [18.85, 42.31], Kotor: [18.77, 42.42], Podgorica: [19.26, 42.44], "Herceg Novi": [18.55, 42.47],
  Tivat: [18.7, 42.43], Bar: [19.1, 42.1], Ulcinj: [19.23, 41.94], "Žabljak": [19.12, 43.15],
  Petrovac: [18.95, 42.22], "Sveti Stefan": [18.9, 42.27], Perast: [18.7, 42.49], Cetinje: [18.92, 42.39],
  "Nikšić": [18.95, 42.77], "Kolašin": [19.52, 42.82], "Bijelo Polje": [19.75, 43.04], Berane: [19.87, 42.84],
  Plav: [19.95, 42.6], "Rožaje": [20.17, 42.84], Pljevlja: [19.36, 43.36], Danilovgrad: [19.1, 42.55],
};
const TOWN_XY = Object.fromEntries(Object.entries(TOWNS).map(([k, [lon, lat]]) => [k, [f(X(lon)), f(Y(lat))]]));
const LABELLED = ["Podgorica", "Budva", "Kotor", "Žabljak", "Ulcinj", "Herceg Novi", "Rožaje", "Nikšić"];

const map = `
<svg class="hf-map__svg" viewBox="0 0 322 454" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
  <g class="hf-map__cam" data-cam>
  <rect class="hf-map__sea" x="-420" y="-280" width="1180" height="1040"/>
  <path class="hf-map__nb" d="${NEIGHBOURS_PATH}"/>
  <path class="hf-map__land" d="${MNE_PATH}"/>
  <path class="hf-map__lake" d="${LAKE_PATH}"/>
  <text class="hf-map__seaname" x="${f(X(18.42))}" y="${f(Y(42.0))}">Adriatic Sea</text>
  ${Object.entries(TOWN_XY).map(([name, [x, y]]) => `<circle class="hf-map__dot" data-town="${name}" cx="${x}" cy="${y}" r="2.6"/>`).join("")}
  ${LABELLED.map((name) => { const [x, y] = TOWN_XY[name]; return `<text class="hf-map__label" x="${f(x + 6)}" y="${f(y + 3.5)}">${name}</text>`; }).join("")}
  </g>
  <g class="hf-pin" data-pin transform="translate(161 280)">
    <g class="hf-pin__drop">
      <circle class="hf-pin__ripple" r="10"/>
      <ellipse class="hf-pin__shadow" rx="7" ry="2.4"/>
      <path class="hf-pin__body" d="M0 0C-3 -8 -15 -15 -15 -27A15 15 0 1 1 15 -27C15 -15 3 -8 0 0Z"/>
      <path class="hf-pin__house" d="M-6 -25.5 0 -31l6 5.5V-21H-6Z"/>
    </g>
  </g>
</svg>`;

/* ---------------- Illustrations (animated in host-flow.css) ---------------- */
const illHouse = `
<svg class="hf-ill hf-ill--house" viewBox="0 0 360 280" aria-hidden="true" focusable="false">
  <circle class="sun" cx="282" cy="74" r="30"/>
  <path class="hill" d="M0 214C70 186 140 190 210 204S320 196 360 204V280H0Z"/>
  <g class="tree"><path class="trunk" d="M64 214v-26"/><path class="crown" d="M64 120 40 196h48Z"/></g>
  <g class="house">
    <rect class="walls" x="122" y="128" width="128" height="88" rx="4"/>
    <rect class="chimney" x="218" y="88" width="16" height="34"/>
    <path class="roof" d="M106 136 186 80l80 56Z"/>
    <path class="door" d="M172 216v-34a14 14 0 0 1 28 0v34Z"/>
    <rect class="win w1" x="138" y="152" width="22" height="22" rx="3"/>
    <rect class="win w2" x="212" y="152" width="22" height="22" rx="3"/>
  </g>
  <g class="smoke"><circle cx="226" cy="74" r="6"/><circle cx="232" cy="60" r="8"/><circle cx="224" cy="44" r="9"/></g>
  <clipPath id="hf-sea-clip"><rect x="0" y="206" width="360" height="74"/></clipPath>
  <g class="sea" clip-path="url(#hf-sea-clip)"><path d="M-270 248c15-7 30-7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0"/><path d="M-270 264c15-7 30-7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0s30 -7 45 0s30 7 45 0"/></g>
</svg>`;

const illPhotos = `
<svg class="hf-ill hf-ill--photos" viewBox="0 0 360 280" aria-hidden="true" focusable="false">
  <g class="card c1"><rect x="-58" y="-70" width="116" height="140" rx="10"/><rect class="pic" x="-48" y="-60" width="96" height="92" rx="5"/><circle class="s" cx="22" cy="-38" r="9"/><path class="m" d="m-48 32 30-38 22 26 14-16 30 28Z"/></g>
  <g class="card c2"><rect x="-58" y="-70" width="116" height="140" rx="10"/><rect class="pic" x="-48" y="-60" width="96" height="92" rx="5"/><path class="m" d="m-48 32 40-50 26 30 30 20Z"/><path class="w" d="M-48 18c12-5 24-5 36 0s24 5 36 0 24-5 24 0v14h-96Z"/></g>
  <g class="card c3"><rect x="-58" y="-70" width="116" height="140" rx="10"/><rect class="pic" x="-48" y="-60" width="96" height="92" rx="5"/><path class="roofp" d="m-30 0 30-26 30 26Z"/><rect class="wallp" x="-22" y="0" width="44" height="32"/><circle class="s" cx="-26" cy="-36" r="8"/></g>
  <g class="spark k1"><path d="M0-12 3-3 12 0 3 3 0 12-3 3-12 0-3-3Z"/></g>
  <g class="spark k2"><path d="M0-12 3-3 12 0 3 3 0 12-3 3-12 0-3-3Z"/></g>
  <g class="spark k3"><path d="M0-12 3-3 12 0 3 3 0 12-3 3-12 0-3-3Z"/></g>
</svg>`;

const illLetter = `
<svg class="hf-ill hf-ill--letter" viewBox="0 0 360 280" aria-hidden="true" focusable="false">
  <g class="env">
    <rect class="back" x="90" y="120" width="180" height="120" rx="10"/>
    <g class="letter"><rect x="108" y="78" width="144" height="130" rx="6"/><path class="ln" d="M126 104h70M126 122h108M126 140h96M126 158h104"/><path class="sig" d="M188 186c8-10 14-10 14-2s8 4 14-6 10 0 14-2"/></g>
    <path class="front" d="M90 140v90a10 10 0 0 0 10 10h160a10 10 0 0 0 10-10v-90l-90 58Z"/>
  </g>
  <g class="badge"><circle cx="268" cy="104" r="26"/><path d="m256 104 8 8 16-17"/></g>
  <g class="dots"><circle cx="70" cy="96" r="5"/><circle cx="300" cy="200" r="6"/><circle cx="96" cy="60" r="3.5"/><circle cx="312" cy="150" r="3.5"/></g>
</svg>`;

/* Small versions for the intro rows. */
const mini = {
  house: `<svg class="hf-mini" viewBox="0 0 96 96" aria-hidden="true"><rect x="4" y="4" width="88" height="88" rx="20" class="bg"/><path class="r" d="M22 46 48 26l26 20Z"/><rect class="wl" x="28" y="44" width="40" height="28" rx="2"/><path class="d" d="M43 72V61a5 5 0 0 1 10 0v11Z"/></svg>`,
  photos: `<svg class="hf-mini" viewBox="0 0 96 96" aria-hidden="true"><rect x="4" y="4" width="88" height="88" rx="20" class="bg"/><rect class="p1" x="22" y="26" width="40" height="46" rx="5" transform="rotate(-10 42 49)"/><rect class="p2" x="36" y="24" width="40" height="46" rx="5" transform="rotate(8 56 47)"/><path class="m" d="m42 60 10-12 8 9 5-5 9 8Z" transform="rotate(8 56 47)"/></svg>`,
  letter: `<svg class="hf-mini" viewBox="0 0 96 96" aria-hidden="true"><rect x="4" y="4" width="88" height="88" rx="20" class="bg"/><rect class="e" x="20" y="32" width="56" height="38" rx="5"/><path class="f" d="m20 36 28 18 28-18"/><circle class="c" cx="72" cy="30" r="10"/><path class="k" d="m67.5 30 3 3 6-6.5"/></svg>`,
};

/* ---------------- Building blocks ---------------- */
const tile = (name, value, label, icon, type = "radio") => `
  <label class="hf-tile" data-stagger>
    <input type="${type}" name="${name}" value="${value}"${type === "radio" ? " required" : ""}>
    <span class="hf-tile__box">${ico(icon, "ico hf-tile__ico")}<span class="hf-tile__label">${label}</span></span>
  </label>`;

const counter = (name, label, hint, min, max, start) => `
  <div class="hf-count" data-counter data-min="${min}" data-max="${max}" data-start="${start}" data-stagger>
    <div><span class="hf-count__label" id="lbl-${name}">${label}</span><span class="hf-count__hint">${hint}</span></div>
    <div class="hf-count__ctl" role="group" aria-labelledby="lbl-${name}">
      <button type="button" class="hf-round" data-dec aria-label="Fewer ${label.toLowerCase()}">${ico("minus")}</button>
      <span class="hf-count__val" aria-live="polite"><span>${start}</span></span>
      <button type="button" class="hf-round" data-inc aria-label="More ${label.toLowerCase()}">${svg("plus")}</button>
    </div>
    <input type="hidden" name="${name}" value="">
  </div>`;

const option = (name, value, title, body, icon) => `
  <label class="hf-option" data-stagger>
    <input type="radio" name="${name}" value="${value}" required>
    <span class="hf-option__box"><span><strong>${title}</strong><span>${body}</span></span>${ico(icon, "ico hf-option__ico")}</span>
  </label>`;

const field = (id, name, label, type, extra = "") => `
  <div class="hf-fld">
    <input id="${id}" name="${name}" type="${type}" placeholder=" " ${extra}>
    <label for="${id}">${label}</label>
  </div>`;

const phase = (key, n, title, body, ill) => `
<section class="hf-screen hf-screen--wide hf-phase" data-screen="${key}" data-phase="${n}" aria-labelledby="h-${key}">
  <div class="hf-phase__grid">
    <div class="hf-phase__text">
      <span class="hf-phase__num" aria-hidden="true">${n}</span>
      <h2 id="h-${key}" tabindex="-1">${words(title)}</h2>
      <p class="hf-sub" data-stagger>${body}</p>
    </div>
    <div class="hf-phase__art">${ill}</div>
  </div>
</section>`;

const screen = (key, n, title, sub, body, attrs = "") => `
<section class="hf-screen" data-screen="${key}" data-phase="${n}" aria-labelledby="h-${key}" ${attrs}>
  <h2 id="h-${key}" class="hf-title" tabindex="-1">${words(title)}</h2>
  ${sub ? `<p class="hf-sub" data-stagger>${sub}</p>` : ""}
  ${body}
  <p class="hf-err" role="alert"></p>
</section>`;

/* ---------------- Screens ---------------- */
const intro = `
<section class="hf-screen hf-screen--wide hf-intro is-active" data-screen="intro" data-phase="0" aria-labelledby="h-intro">
  <div class="hf-intro__grid">
    <h1 id="h-intro" tabindex="-1">${words("It's easy to get started on NorthB&amp;B")}</h1>
    <ol class="hf-intro__list">
      <li data-stagger><span class="hf-intro__n">1</span><div><h3>Tell us about your place</h3><p>What kind of place it is, where it is, and how many guests can stay.</p></div>${mini.house}</li>
      <li data-stagger><span class="hf-intro__n">2</span><div><h3>Make it stand out</h3><p>Add what it offers and a few photos if you have them. All optional.</p></div>${mini.photos}</li>
      <li data-stagger><span class="hf-intro__n">3</span><div><h3>Finish up and send</h3><p>Tell us how to reach you and how you'd like to get paid. A real person takes it from there.</p></div>${mini.letter}</li>
    </ol>
  </div>
</section>`;

const sType = screen("type", 1, "Which of these best describes your place?", "", `
  <div class="hf-tiles">
    ${tile("property_type", "Apartment", "Apartment", "apartment")}
    ${tile("property_type", "Villa", "Villa", "villa")}
    ${tile("property_type", "House", "House", "house")}
    ${tile("property_type", "Guesthouse", "Guesthouse", "guesthouse")}
    ${tile("property_type", "Small hotel", "Small hotel", "hotel")}
    ${tile("property_type", "Hostel", "Hostel", "hostel")}
    ${tile("property_type", "Campground", "Campground", "tent")}
    ${tile("property_type", "Something else", "Something else", "key")}
  </div>`, 'data-required="type"');

const popular = ["Budva", "Kotor", "Herceg Novi", "Podgorica", "Tivat", "Bar", "Ulcinj", "Žabljak"];
const sWhere = screen("where", 1, "Where's your place located?", "Search for your town or village. We'll confirm the exact spot with you later.", `
  <div class="hf-map" data-map data-towns='${JSON.stringify(TOWNS)}' data-proj='${JSON.stringify(PROJ)}'>
    ${map}
    <div class="hf-map__search" data-combo>
      ${svg("pin")}
      <label class="visually-hidden" for="hf-town">Town or village</label>
      <input id="hf-town" name="town" placeholder="Search for a town or village" autocomplete="off" required data-town-input
        role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="hf-results">
      <span class="hf-map__spin" data-spin aria-hidden="true"></span>
      <ul class="hf-results" id="hf-results" role="listbox" aria-label="Matching places" data-results hidden></ul>
    </div>
    <input type="hidden" name="lat" data-lat>
    <input type="hidden" name="lon" data-lon>
    <p class="hf-map__note" data-map-note hidden></p>
  </div>
  <p class="visually-hidden" aria-live="polite" data-results-live></p>
  <div class="hf-chips" data-town-chips aria-label="Suggested towns">
    ${Object.keys(TOWNS).map((t) => `<button type="button" class="hf-chip" data-town="${t}"${popular.includes(t) ? "" : " hidden"}>${t}</button>`).join("")}
  </div>`, 'data-required="where"');

const sBasics = screen("basics", 1, "Share some basics about your place", "Roughly is fine. You can skip this and tell us on the phone.", `
  <div class="hf-counts">
    ${counter("guests", "Guests", "How many people can stay", 1, 50, 2)}
    ${counter("bedrooms", "Bedrooms", "Or rooms and units", 0, 99, 1)}
    ${counter("beds", "Beds", "Doubles count as one", 1, 99, 1)}
    ${counter("bathrooms", "Bathrooms", "Private or shared", 0, 50, 1)}
  </div>`, 'data-optional="basics"');

const amen = (v, l, i) => tile("amenities", v, l, i, "checkbox");
const sAmen = screen("amenities", 2, "Tell guests what your place has to offer", "Tap everything that applies. Skip it if you'd rather tell us later.", `
  <h3 class="hf-group-h">Guest favorites</h3>
  <div class="hf-tiles hf-tiles--sm">
    ${amen("Wifi", "Wifi", "wifi")}
    ${amen("Air conditioning", "Air conditioning", "snow")}
    ${amen("Kitchen", "Kitchen", "pot")}
    ${amen("Free parking", "Free parking", "car")}
    ${amen("Washer", "Washer", "washer")}
    ${amen("TV", "TV", "tv")}
    ${amen("Workspace", "Workspace", "laptop")}
    ${amen("Pets allowed", "Pets allowed", "paw")}
  </div>
  <h3 class="hf-group-h">Standout features</h3>
  <div class="hf-tiles hf-tiles--sm">
    ${amen("Sea view", "Sea view", "waves")}
    ${amen("Mountain view", "Mountain view", "mountain")}
    ${amen("Pool", "Pool", "pool")}
    ${amen("Balcony or terrace", "Balcony or terrace", "balcony")}
    ${amen("BBQ grill", "BBQ grill", "grill")}
    ${amen("Breakfast available", "Breakfast available", "coffee")}
  </div>`, 'data-optional="amenities"');

const sPhotos = screen("photos", 2, "Add some photos of your place", "Phone photos are perfect to start with. Add up to 12, or skip and send them later.", `
  <div class="hf-drop" data-drop>
    <input type="file" id="hf-files" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple class="visually-hidden" data-files>
    <div class="hf-drop__empty">
      <span class="hf-drop__cam">${svg("camera", "")}</span>
      <strong>Drag your photos here</strong>
      <span>or</span>
      <label for="hf-files" class="btn btn--ghost">${ico("upload")} Upload from your device</label>
    </div>
    <div class="hf-photos" data-photos></div>
  </div>
  <p class="hf-photo-note" data-photo-note aria-live="polite"></p>`, 'data-optional="photos"');

const sName = screen("name", 2, "Now, give your place a name", "Short names work best. You can always change it later.", `
  <div class="hf-bigtext">
    <label class="visually-hidden" for="hf-pname">Property name</label>
    <textarea id="hf-pname" name="property_name" rows="2" maxlength="50" placeholder="e.g. Stone house above Kotor Bay" required data-name-input></textarea>
    <span class="hf-bigtext__count"><span data-name-count>0</span>/50</span>
  </div>
  <div class="hf-fld hf-fld--area" data-stagger>
    <textarea id="hf-notes" name="notes" rows="3" placeholder=" "></textarea>
    <label for="hf-notes">Anything else we should know?</label>
  </div>`, 'data-required="name"');

const langs = ["No preference", "English", "Montenegrin / BCS", "Albanian", "Russian", "Other"];
const sContact = screen("contact", 3, "How can we reach you?", "A member of our team calls or messages within one business day.", `
  <div class="hf-group" data-stagger>
    ${field("hf-name", "name", "Full name", "text", 'autocomplete="name" required data-err="Please add your name."')}
    ${field("hf-email", "email", "Email", "email", 'autocomplete="email" required data-err="Please add a valid email."')}
    ${field("hf-phone", "phone", "Phone or WhatsApp", "tel", 'autocomplete="tel" inputmode="tel" required data-err="Please add a phone number."')}
  </div>
  <fieldset class="hf-langs" data-stagger>
    <legend>Preferred language</legend>
    <div class="hf-chips">
      ${langs.map((l, i) => `<label class="hf-chip hf-chip--radio"><input type="radio" name="language" value="${i ? l : ""}"${i ? "" : " checked"}><span>${l}</span></label>`).join("")}
    </div>
  </fieldset>`, 'data-required="contact"');

const sPayout = screen("payout", 3, "How would you like to get paid?", "We set it up with you. Nothing to configure today.", `
  <div class="hf-options">
    ${option("payout", "Payoneer (worldwide)", "Payoneer", "Worldwide payouts to almost any country, in your currency.", "globe")}
    ${option("payout", "Bank transfer", "Bank transfer", "Paid straight into your bank account.", "bank")}
    ${option("payout", "Not sure yet, advise me", "Not sure yet", "We'll walk you through the options when we talk.", "chat")}
  </div>`, 'data-required="payout"');

const sReview = screen("review", 3, "Review your details", "Here's what we'll send to our host team. Tap Edit to change anything.", `
  <div class="hf-review">
    <div class="hf-preview" data-stagger>
      <div class="hf-preview__img" data-review-cover>${mini.house}</div>
      <div class="hf-preview__body">
        <strong data-review-title>Your place</strong>
        <span data-review-place>Montenegro</span>
      </div>
    </div>
    <dl class="hf-summary" data-review-list data-stagger></dl>
  </div>
  <label class="hf-consent" data-stagger>
    <input type="checkbox" name="consent" value="yes" required>
    <span class="hf-consent__box">${svg("check")}</span>
    <span>I agree to be contacted about my listing and accept the <a href="/legal/privacy/" target="_blank">Privacy Policy</a> and <a href="/legal/terms/" target="_blank">Terms of Use</a>.</span>
  </label>`, 'data-required="review"');

const done = `
<section class="hf-done" data-done hidden aria-labelledby="h-done">
  <div class="hf-done__card">
    <h2 id="h-done" tabindex="-1">Congratulations<span data-done-name></span>!</h2>
    <p class="hf-done__lede">Welcome to NorthB&amp;B.</p>
    <p>Thank you for trusting us with your place. A member of our host team will be in touch within one business day to help set up your listing, prices and payouts. Keep an eye on your inbox, and your spam folder just in case.</p>
    <p class="hf-done__sign">The NorthB&amp;B team, Rožaje</p>
    <div class="hf-done__actions">
      <a class="btn btn--grad btn--lg" href="/">Back to home</a>
      <a class="btn btn--ghost btn--lg" href="/search/">Explore stays</a>
    </div>
  </div>
</section>`;

const main = `
<noscript><style>.hf-screen{display:block!important;margin-bottom:56px}.hf-bar{position:static}.hf-stage{display:block}</style></noscript>
<div class="hf" data-hf>
  <header class="hf-top">
    <a class="hf-logo" href="/">${logoMark()}</a>
    <div class="hf-top__actions">
      <a class="hf-pill" href="https://wa.me/${SITE.whatsappHref}" rel="noopener" target="_blank">Questions?</a>
      <button type="button" class="hf-pill" data-save-exit>Save &amp; exit</button>
    </div>
  </header>

  <form class="hf-form" action="/api/host-signup" method="post" enctype="multipart/form-data" novalidate>
    <div class="hf-stage">
      ${intro}
      ${phase("p1", 1, "Tell us about your place", "In this step, we'll ask what kind of property you have and where it is. Then, if you like, how many guests can stay.", illHouse)}
      ${sType}
      ${sWhere}
      ${sBasics}
      ${phase("p2", 2, "Make your place stand out", "Next, tell guests what your place offers and add a few photos if you have them handy. Every part of this step is optional.", illPhotos)}
      ${sAmen}
      ${sPhotos}
      ${sName}
      ${phase("p3", 3, "Finish up and send", "Finally, tell us how to reach you and how you'd like to get paid. Then a real person helps you take it live.", illLetter)}
      ${sContact}
      ${sPayout}
      ${sReview}
    </div>

    <footer class="hf-bar">
      <div class="hf-progress" aria-hidden="true"><span><i></i></span><span><i></i></span><span><i></i></span></div>
      <div class="hf-bar__inner">
        <button type="button" class="hf-back" data-back hidden>Back</button>
        <button type="submit" class="btn btn--grad btn--lg hf-next" data-next>Get started</button>
      </div>
    </footer>
    <p class="visually-hidden" aria-live="polite" data-live></p>
  </form>

  ${done}
  <div class="hf-toast" data-toast role="status" hidden></div>
</div>`;

export const hostFlow = {
  title: "List your place | NorthB&B host signup",
  desc: "List your Montenegro apartment, villa or guesthouse with NorthB&B in a few guided steps. Free to list, with a real person to help you go live.",
  slug: "host/start",
  noindex: true,
  bare: true,
  bodyClass: "refresh hf-body",
  extraHead: '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/newsreader-latin.woff2" crossorigin><link rel="stylesheet" href="/assets/css/refresh.css"><link rel="stylesheet" href="/assets/css/host-flow.css">',
  scripts: '<script src="/assets/js/host-flow.js" defer></script>',
  main,
};
