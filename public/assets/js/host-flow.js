/* NorthB&B host signup flow (/host/start/). Vanilla, no dependencies.
   Without JS every screen shows stacked and the form posts normally. */
(function () {
  "use strict";
  var root = document.querySelector("[data-hf]");
  if (!root) return;
  document.documentElement.classList.add("js-hf");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var form = root.querySelector(".hf-form");
  var screens = Array.prototype.slice.call(form.querySelectorAll(".hf-screen"));
  var nextBtn = form.querySelector("[data-next]");
  var backBtn = form.querySelector("[data-back]");
  var segs = Array.prototype.slice.call(form.querySelectorAll(".hf-progress i"));
  var live = form.querySelector("[data-live]");
  var toast = root.querySelector("[data-toast]");
  var DRAFT = "nb_host_draft";
  var idx = 0;
  var busy = false;
  var returnTo = -1; // set when editing from the review screen
  var WAIT = 750;        // deliberate pause after Next so each step feels considered
  var SEND_MIN = 1900;   // and a little longer for the final send
  var DOTS = '<span class="hf-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="visually-hidden">One moment</span>';
  var photos = []; // { blob, url }

  var $ = function (sel, el) { return (el || form).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || form).querySelectorAll(sel)); };
  var key = function (i) { return screens[i].getAttribute("data-screen"); };
  var norm = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); };

  /* stagger order per screen */
  screens.forEach(function (s) {
    $$("[data-stagger]", s).forEach(function (el, i) { el.style.setProperty("--s", i); });
  });

  /* ---------------- validation ---------------- */
  var checks = {
    type: function () { return !!$('input[name="property_type"]:checked'); },
    where: function () { return !!$('[name="town"]').value.trim(); },
    name: function () { return !!$('[name="property_name"]').value.trim(); },
    contact: function () {
      return !!$('[name="name"]').value.trim() && isEmail($('[name="email"]').value) &&
        $('[name="phone"]').value.replace(/\D/g, "").length >= 6;
    },
    payout: function () { return !!$('input[name="payout"]:checked'); },
    review: function () { return $('[name="consent"]').checked; },
  };
  var messages = {
    type: "Pick the option closest to your place.",
    where: "Tell us the town or area.",
    name: "Give your place a name to continue.",
    payout: "Choose how you'd like to get paid.",
    review: "Please agree so our team can contact you.",
  };

  function showErrors(s) {
    var k = s.getAttribute("data-required");
    var err = $(".hf-err", s);
    if (k === "contact") {
      var first = null;
      [["name", function (v) { return !!v.trim(); }], ["email", isEmail], ["phone", function (v) { return v.replace(/\D/g, "").length >= 6; }]].forEach(function (p) {
        var f = $('[name="' + p[0] + '"]');
        var bad = !p[1](f.value);
        f.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && !first) first = f;
      });
      if (err) err.textContent = first ? first.getAttribute("data-err") : "";
      if (first) first.focus();
    } else {
      if (err) err.textContent = messages[k] || "";
      if (k === "where") { var t = $('[name="town"]'); t.setAttribute("aria-invalid", "true"); t.focus(); }
      if (k === "name") { var pn = $('[name="property_name"]'); pn.setAttribute("aria-invalid", "true"); pn.focus(); }
      if (k === "review") $('[name="consent"]').setAttribute("aria-invalid", "true");
    }
    if (!reduce) {
      s.classList.remove("is-shake"); void s.offsetWidth; s.classList.add("is-shake");
    }
    // the message can sit below the fold on long screens (review)
    if (err && err.textContent) {
      var r = err.getBoundingClientRect();
      if (r.bottom > innerHeight - 100) err.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }

  function clearErrors(s) {
    var err = $(".hf-err", s);
    if (err) err.textContent = "";
    $$('[aria-invalid="true"]', s).forEach(function (f) { f.setAttribute("aria-invalid", "false"); });
  }

  /* optional screens count as "filled" once the host has added something */
  function filled(k) {
    if (k === "basics") return $$("[data-counter] input").some(function (i) { return i.value !== ""; });
    if (k === "amenities") return !!$('input[name="amenities"]:checked');
    if (k === "photos") return photos.length > 0;
    if (k === "name") return !!($('[name="property_name"]').value.trim() || $('[name="notes"]').value.trim());
    return true;
  }

  /* ---------------- footer button ---------------- */
  function paintButton() {
    var s = screens[idx];
    var k = key(idx);
    var req = s.getAttribute("data-required");
    var opt = s.getAttribute("data-optional");
    var label = "Next";
    if (k === "intro") label = "Get started";
    else if (k === "review") label = "Send my details";
    else if (returnTo > -1) label = "Back to review";
    else if (opt && !filled(opt)) label = "Skip";
    if (!busy && nextBtn.textContent !== label) {
      nextBtn.textContent = label;
      if (!reduce) { nextBtn.classList.remove("is-label-swap"); void nextBtn.offsetWidth; nextBtn.classList.add("is-label-swap"); }
    }
    nextBtn.classList.toggle("is-disabled", !!req && !checks[req]());
    nextBtn.setAttribute("aria-disabled", req && !checks[req]() ? "true" : "false");
    backBtn.hidden = idx === 0;
  }

  function paintProgress(done, at) {
    var cur = at == null ? idx : at;
    var phase = +screens[cur].getAttribute("data-phase");
    [1, 2, 3].forEach(function (p, i) {
      var inPhase = screens.filter(function (s) { return +s.getAttribute("data-phase") === p; });
      var pos = inPhase.indexOf(screens[cur]);
      var pct = done || p < phase ? 100 : p > phase ? 0 : Math.round((pos / inPhase.length) * 100);
      segs[i].style.setProperty("--p", pct + "%");
    });
  }

  /* ---------------- navigation ---------------- */
  function go(to, dir, instant) {
    if (to < 0 || to >= screens.length || to === idx) return;
    var from = screens[idx];
    var target = screens[to];
    var show = function () {
      from.classList.remove("is-active", "is-out-fwd", "is-out-back", "is-in-back", "is-shake");
      target.classList.toggle("is-in-back", dir < 0);
      target.classList.add("is-active");
      idx = to;
      onEnter(key(idx));
      paintButton();
      paintProgress();
      window.scrollTo(0, 0);
      var h = target.querySelector("h1, h2");
      if (h) h.focus({ preventScroll: true });
      if (live) live.textContent = "Step " + (idx + 1) + " of " + screens.length;
      save();
    };
    if (instant || reduce) return show();
    from.classList.add(dir > 0 ? "is-out-fwd" : "is-out-back");
    setTimeout(show, 200);
  }

  function next() {
    var s = screens[idx];
    var req = s.getAttribute("data-required");
    if (req && !checks[req]()) return showErrors(s);
    clearErrors(s);
    if (key(idx) === "review") return submit();
    var target = returnTo > -1 ? returnTo : idx + 1;
    returnTo = -1;
    paced(function () { go(target, 1); }, WAIT, target);
  }

  /* Hold on the current screen for a beat (dots in the button, progress already moving). */
  function paced(fn, ms, target) {
    if (busy) return;
    busy = true;
    nextBtn.classList.add("is-busy");
    nextBtn.innerHTML = DOTS;
    paintProgress(false, target);
    setTimeout(function () {
      busy = false;
      nextBtn.classList.remove("is-busy");
      fn();
    }, ms);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); if (!busy) next(); });
  backBtn.addEventListener("click", function () { if (busy) return; returnTo = -1; go(idx - 1, -1); });

  form.addEventListener("input", function (e) {
    var s = screens[idx];
    if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false");
    if (s.getAttribute("data-required") && checks[s.getAttribute("data-required")]()) { var err = $(".hf-err", s); if (err) err.textContent = ""; }
    paintButton();
    saveSoon();
  });

  /* tiles and options bounce when picked */
  form.addEventListener("change", function (e) {
    var t = e.target;
    if ((t.type === "radio" || t.type === "checkbox") && !reduce) {
      var box = t.nextElementSibling;
      if (box && (box.classList.contains("hf-tile__box") || box.classList.contains("hf-option__box"))) {
        box.classList.remove("is-pop"); void box.offsetWidth; box.classList.add("is-pop");
      }
    }
    paintButton();
    saveSoon();
  });

  /* ---------------- counters ---------------- */
  $$("[data-counter]").forEach(function (c) {
    var min = +c.getAttribute("data-min"), max = +c.getAttribute("data-max");
    var input = $("input", c), val = $(".hf-count__val", c);
    var dec = $("[data-dec]", c), inc = $("[data-inc]", c);
    var current = function () { return input.value === "" ? +c.getAttribute("data-start") : +input.value; };
    var render = function (n, dir) {
      val.innerHTML = '<span class="' + (dir || "") + '">' + n + "</span>";
      dec.disabled = n <= min; inc.disabled = n >= max;
    };
    c.render = function () { render(current()); };
    c.render();
    var step = function (d) {
      var n = Math.min(max, Math.max(min, current() + d));
      input.value = n;
      render(n, reduce ? "" : d > 0 ? "up" : "down");
      paintButton(); saveSoon();
    };
    dec.addEventListener("click", function () { step(-1); });
    inc.addEventListener("click", function () { step(1); });
  });

  /* ---------------- map + place search ---------------- */
  var mapEl = $("[data-map]");
  var townInput = $("[data-town-input]");
  var latEl = $("[data-lat]"), lonEl = $("[data-lon]");
  var pin = $("[data-pin]");
  var cam = $("[data-cam]");
  var note = $("[data-map-note]");
  var list = $("[data-results]");
  var spin = $("[data-spin]");
  var resLive = $("[data-results-live]");
  var chips = $$("[data-town-chips] .hf-chip");
  var towns = {}, proj = { lon0: 18.35, kx: 147, ox: 10, lat0: 43.62, ky: 200, oy: 80 };
  try { towns = JSON.parse(mapEl.getAttribute("data-towns")); proj = JSON.parse(mapEl.getAttribute("data-proj")); } catch (e) {}
  var townKeys = Object.keys(towns);
  var ZOOM = 2.6, PIN_X = 161, PIN_Y = 280; // the pin stays put; the map glides under it
  var lastPinKey = null, noResults = false;
  var items = [], active = -1, searchTimer, reqId = 0, ctrl = null, cache = {};
  var PIN_SVG = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  function project(lon, lat) { return [(lon - proj.lon0) * proj.kx + proj.ox, (proj.lat0 - lat) * proj.ky + proj.oy]; }
  function presetFor(text) { var v = norm(text), m = null; townKeys.forEach(function (t) { if (norm(t) === v) m = t; }); return m; }

  function placePin() {
    var lat = parseFloat(latEl.value), lon = parseFloat(lonEl.value);
    if (isNaN(lat) || isNaN(lon)) {
      var m = presetFor(townInput.value); // typed an exact well-known town: no search needed
      if (m) { lon = towns[m][0]; lat = towns[m][1]; latEl.value = lat; lonEl.value = lon; }
    }
    var has = !isNaN(lat) && !isNaN(lon);
    $$(".hf-map__dot", mapEl).forEach(function (d) {
      var t = towns[d.getAttribute("data-town")];
      d.classList.toggle("is-on", has && Math.abs(t[0] - lon) < 0.02 && Math.abs(t[1] - lat) < 0.02);
    });
    var v = norm(townInput.value);
    chips.forEach(function (c) { c.classList.toggle("is-on", norm(c.getAttribute("data-town")) === v); });
    if (has) {
      var xy = project(lon, lat);
      cam.style.transform = "translate(" + (PIN_X - xy[0] * ZOOM) + "px," + (PIN_Y - xy[1] * ZOOM) + "px) scale(" + ZOOM + ")";
      mapEl.classList.add("is-zoomed");
      pin.classList.add("is-shown");
      var key = lat + "," + lon;
      if (key !== lastPinKey && !reduce) { pin.classList.remove("is-drop"); void pin.getBoundingClientRect(); pin.classList.add("is-drop"); }
      lastPinKey = key;
      note.hidden = true;
    } else {
      pin.classList.remove("is-shown");
      cam.style.transform = "";
      mapEl.classList.remove("is-zoomed");
      lastPinKey = null;
      note.textContent = "Can't find it? No problem, we'll pin the exact spot with you.";
      note.hidden = !(noResults && townInput.value.trim().length >= 2);
    }
  }

  function setPlace(it) {
    townInput.value = it.name;
    latEl.value = it.lat; lonEl.value = it.lon;
    townInput.setAttribute("aria-invalid", "false");
    noResults = false;
    closeList();
    placePin(); filterChips(); paintButton(); saveSoon();
    var err = $(".hf-err", screens[idx]); if (err) err.textContent = "";
  }

  /* --- suggestions --- */
  function closeList() {
    list.hidden = true; list.innerHTML = ""; items = []; active = -1;
    townInput.setAttribute("aria-expanded", "false");
    townInput.removeAttribute("aria-activedescendant");
  }
  function renderList(res) {
    if (res === null) return closeList();
    items = res;
    active = -1;
    noResults = !items.length;
    list.innerHTML = items.length
      ? items.map(function (it, i) {
          return '<li class="hf-result" role="option" id="hf-opt-' + i + '" data-i="' + i + '" aria-selected="false"><span class="hf-result__ico">' + PIN_SVG + "</span><span><strong>" + esc(it.name) + "</strong><small>" + esc(it.detail) + "</small></span></li>";
        }).join("")
      : '<li class="hf-result hf-result--none">No matching place. Keep typing, or we will pin it with you.</li>';
    list.hidden = false;
    townInput.setAttribute("aria-expanded", "true");
    if (resLive) resLive.textContent = items.length ? items.length + " place" + (items.length > 1 ? "s" : "") + " found. Use the arrow keys to choose." : "No matching places.";
    placePin();
  }
  function localMatches(q) {
    var v = norm(q);
    return townKeys.filter(function (t) { return norm(t).indexOf(v) === 0; }).slice(0, 6).map(function (t) {
      return { name: t, detail: "Montenegro", lat: towns[t][1], lon: towns[t][0] };
    });
  }
  function runSearch(q) {
    var key = norm(q), id = ++reqId;
    if (cache[key]) return renderList(cache[key]);
    if (ctrl) ctrl.abort();
    ctrl = window.AbortController ? new AbortController() : null;
    spin.classList.add("is-on");
    var done = function () { if (id === reqId) spin.classList.remove("is-on"); };
    fetch("/api/geocode?q=" + encodeURIComponent(q), { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (id !== reqId) return;
        if (d && d.ok) { cache[key] = d.results; renderList(d.results); }
        else renderList(localMatches(q)); // service down: still offer the well-known towns
        done();
      })
      .catch(function (e) { if (e && e.name === "AbortError") return; if (id === reqId) renderList(localMatches(q)); done(); });
  }

  townInput.addEventListener("input", function () {
    // typing invalidates the previous pick
    latEl.value = ""; lonEl.value = "";
    noResults = false;
    filterChips(); placePin();
    clearTimeout(searchTimer);
    var q = townInput.value.trim();
    if (q.length < 2) { reqId++; spin.classList.remove("is-on"); return closeList(); }
    searchTimer = setTimeout(function () { runSearch(q); }, 220);
  });
  function highlight(i) {
    var opts = $$(".hf-result[data-i]", list);
    opts.forEach(function (o, n) { o.setAttribute("aria-selected", n === i ? "true" : "false"); });
    active = i;
    if (opts[i]) { townInput.setAttribute("aria-activedescendant", opts[i].id); opts[i].scrollIntoView({ block: "nearest" }); }
    else townInput.removeAttribute("aria-activedescendant");
  }
  townInput.addEventListener("keydown", function (e) {
    var open = !list.hidden && items.length;
    if (e.key === "ArrowDown" && open) { e.preventDefault(); highlight((active + 1) % items.length); }
    else if (e.key === "ArrowUp" && open) { e.preventDefault(); highlight((active - 1 + items.length) % items.length); }
    else if (e.key === "Enter" && open) { e.preventDefault(); setPlace(items[active > -1 ? active : 0]); }
    else if (e.key === "Escape" && !list.hidden) { e.preventDefault(); closeList(); }
  });
  list.addEventListener("mousedown", function (e) {
    var o = e.target.closest(".hf-result[data-i]");
    if (!o) return;
    e.preventDefault(); // keep focus in the field
    setPlace(items[+o.getAttribute("data-i")]);
  });
  townInput.addEventListener("blur", function () { setTimeout(closeList, 120); });
  townInput.addEventListener("focus", function () {
    if (townInput.value.trim().length >= 2 && isNaN(parseFloat(latEl.value))) runSearch(townInput.value.trim());
  });

  /* --- quick-pick chips for well-known towns --- */
  function filterChips() {
    var v = norm(townInput.value);
    var shown = 0;
    chips.forEach(function (c, i) {
      var t = norm(c.getAttribute("data-town"));
      var ok = v ? t.indexOf(v) === 0 || t.indexOf(" " + v) > -1 : i < 8;
      c.hidden = !ok || shown >= 8;
      if (!c.hidden) shown++;
    });
  }
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var t = c.getAttribute("data-town");
      setPlace({ name: t, lat: towns[t][1], lon: towns[t][0] });
    });
  });

  /* ---------------- photos ---------------- */
  var drop = $("[data-drop]");
  var fileInput = $("[data-files]");
  var grid = $("[data-photos]");
  var photoNote = $("[data-photo-note]");
  var MAX_PHOTOS = 12;

  function compress(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        // re-encoding also strips EXIF, including GPS location
        c.toBlob(function (b) { b ? resolve(b) : reject(); }, "image/jpeg", 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }

  function renderPhotos() {
    drop.classList.toggle("has-photos", photos.length > 0);
    grid.innerHTML = "";
    photos.forEach(function (p, i) {
      var d = document.createElement("div");
      d.className = "hf-photo";
      d.style.animationDelay = (p.fresh ? p.fresh * 60 : 0) + "ms";
      d.innerHTML = '<img alt="Photo ' + (i + 1) + ' of your place" src="' + p.url + '">' +
        (i === 0 ? '<span class="hf-photo__badge">Cover photo</span>' : '<button type="button" class="hf-photo__btn hf-photo__cover" data-cover="' + i + '">Make cover</button>') +
        '<button type="button" class="hf-photo__btn hf-photo__x" data-remove="' + i + '" aria-label="Remove photo ' + (i + 1) + '"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
      grid.appendChild(d);
      p.fresh = 0;
    });
    paintButton();
  }

  function addFiles(list) {
    var files = Array.prototype.slice.call(list || []).filter(function (f) { return /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name); });
    var room = MAX_PHOTOS - photos.length;
    if (!files.length) return;
    if (files.length > room) photoNote.textContent = "You can add up to " + MAX_PHOTOS + " photos. We kept the first " + Math.max(room, 0) + ".";
    else photoNote.textContent = "";
    files = files.slice(0, Math.max(room, 0));
    var failed = 0, n = 0;
    Promise.all(files.map(function (f) {
      return compress(f).then(function (b) { photos.push({ blob: b, url: URL.createObjectURL(b), fresh: ++n }); }, function () { failed++; });
    })).then(function () {
      if (failed) photoNote.textContent = failed + " photo" + (failed > 1 ? "s" : "") + " couldn't be read. Try JPG or PNG.";
      renderPhotos();
    });
  }

  fileInput.addEventListener("change", function () { addFiles(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); if (ev === "drop" || !drop.contains(e.relatedTarget)) drop.classList.remove("is-over"); });
  });
  drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer && e.dataTransfer.files); });
  grid.addEventListener("click", function (e) {
    var rm = e.target.closest("[data-remove]");
    var cv = e.target.closest("[data-cover]");
    if (rm) {
      var i = +rm.getAttribute("data-remove");
      var tile = rm.parentNode;
      tile.classList.add("is-out");
      setTimeout(function () { URL.revokeObjectURL(photos[i].url); photos.splice(i, 1); renderPhotos(); }, reduce ? 0 : 220);
    }
    if (cv) {
      var j = +cv.getAttribute("data-cover");
      photos.unshift(photos.splice(j, 1)[0]);
      photos[0].fresh = 1;
      renderPhotos();
    }
  });

  /* ---------------- name counter ---------------- */
  var nameInput = $("[data-name-input]");
  var nameCount = $("[data-name-count]");
  function paintCount() {
    nameCount.textContent = nameInput.value.length;
    nameCount.parentNode.classList.toggle("is-near", nameInput.value.length >= 42);
  }
  nameInput.addEventListener("input", paintCount);

  /* ---------------- review ---------------- */
  function val(name) { var el = $('[name="' + name + '"]:checked') || $('[name="' + name + '"]:not([type="radio"]):not([type="checkbox"])'); return el ? el.value.trim() : ""; }

  function renderReview() {
    var type = val("property_type"), town = val("town"), title = val("property_name");
    $("[data-review-title]").textContent = title || (type ? "Your " + type.toLowerCase() : "Your place");
    $("[data-review-place]").textContent = (town ? town + ", " : "") + "Montenegro";
    var cover = $("[data-review-cover]");
    if (!cover.blank) cover.blank = cover.innerHTML;
    cover.innerHTML = photos.length ? '<img alt="Cover photo of your place" src="' + photos[0].url + '">' : cover.blank;
    var basics = ["guests", "bedrooms", "beds", "bathrooms"].map(function (k) {
      var v = val(k); return v === "" ? "" : v + " " + (v === "1" ? k.replace(/s$/, "") : k);
    }).filter(Boolean).join(", ");
    var amen = $$('input[name="amenities"]:checked').map(function (i) { return i.value; }).join(", ");
    var rows = [
      ["Property", type, "type"],
      ["Location", town ? town + ", Montenegro" : "", "where"],
      ["Name", val("property_name"), "name"],
      ["Basics", basics, "basics"],
      ["Amenities", amen, "amenities"],
      ["Photos", photos.length ? photos.length + " photo" + (photos.length > 1 ? "s" : "") : "", "photos"],
      ["Contact", [val("name"), val("email"), val("phone")].filter(Boolean).join(" · "), "contact"],
      ["Payout", val("payout"), "payout"],
    ];
    $("[data-review-list]").innerHTML = rows.map(function (r) {
      return "<div><dt>" + r[0] + "</dt><dd" + (r[1] ? "" : ' class="is-empty"') + ">" + esc(r[1] || "Skipped, we'll ask when we talk") + '</dd><button type="button" data-goto="' + r[2] + '" aria-label="Edit ' + r[0].toLowerCase() + '">Edit</button></div>';
    }).join("");
  }
  form.addEventListener("click", function (e) {
    var g = e.target.closest("[data-goto]");
    if (!g) return;
    var to = screens.findIndex(function (s) { return s.getAttribute("data-screen") === g.getAttribute("data-goto"); });
    if (to > -1 && !busy) { returnTo = idx; go(to, -1); }
  });

  function onEnter(k) {
    if (k === "where") { filterChips(); placePin(); setTimeout(function () { try { townInput.focus({ preventScroll: true }); } catch (e) {} }, 60); }
    if (k === "review") renderReview();
  }

  /* ---------------- draft: autosave + Save & exit ---------------- */
  var saveTimer;
  function save() {
    try {
      var data = { i: idx, v: [] };
      $$("input, textarea, select").forEach(function (f) {
        if (!f.name || f.type === "file") return;
        if ((f.type === "radio" || f.type === "checkbox") && !f.checked) return;
        data.v.push([f.name, f.value]);
      });
      localStorage.setItem(DRAFT, JSON.stringify(data));
    } catch (e) {}
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); }
  function clearDraft() { try { localStorage.removeItem(DRAFT); } catch (e) {} }

  function restore() {
    var data = null;
    try { data = JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch (e) {}
    if (!data || !data.v || !data.i) return;
    data.v.forEach(function (p) {
      $$('[name="' + p[0] + '"]').forEach(function (f) {
        if (f.type === "radio" || f.type === "checkbox") { if (f.value === p[1]) f.checked = true; }
        else f.value = p[1];
      });
    });
    $$("[data-counter]").forEach(function (c) { c.render(); });
    paintCount();
    var to = Math.min(data.i, screens.length - 1);
    go(to, 1, true);
    showToast("Welcome back. We kept your answers.", "Start over", function () { clearDraft(); location.reload(); });
  }

  function showToast(msg, action, fn) {
    toast.innerHTML = "<span>" + esc(msg) + "</span>" + (action ? '<button type="button">' + esc(action) + "</button>" : "");
    toast.hidden = false;
    if (action) toast.querySelector("button").addEventListener("click", fn);
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { toast.hidden = true; }, 7000);
  }

  root.querySelector("[data-save-exit]").addEventListener("click", function () { save(); location.href = "/host/"; });

  /* ---------------- submit ---------------- */
  function setBusy(on) {
    busy = on;
    nextBtn.classList.toggle("is-busy", on);
    if (on) nextBtn.innerHTML = DOTS; else paintButton();
  }

  function submit() {
    var s = screens[idx];
    var err = $(".hf-err", s);
    var fd = new FormData(form);
    photos.forEach(function (p, i) { fd.append("photos", p.blob, "photo-" + (i + 1) + ".jpg"); });
    var t0 = Date.now();
    setBusy(true);
    paintProgress(true);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = function () {
      var data;
      try { data = JSON.parse(xhr.responseText); } catch (e) { data = { ok: xhr.status >= 200 && xhr.status < 300 }; }
      // hold the dots for a minimum beat, even when the server answers instantly
      if (data && data.ok) return setTimeout(finish, Math.max(0, SEND_MIN - (Date.now() - t0)));
      setBusy(false);
      paintProgress();
      if (err) err.textContent = (data && data.message) || "Something went wrong. Please try again, or message us on WhatsApp.";
    };
    xhr.onerror = function () {
      setBusy(false);
      paintProgress();
      if (err) err.textContent = "Network error. Check your connection and try again. Your answers are saved.";
    };
    xhr.send(fd);
  }

  function finish() {
    clearDraft();
    var first = val("name").split(/\s+/)[0];
    var done = root.querySelector("[data-done]");
    (function () {
      form.hidden = true;
      done.querySelector("[data-done-name]").textContent = first ? ", " + first : "";
      done.hidden = false;
      done.querySelector("h2").focus({ preventScroll: true });
      window.scrollTo(0, 0);
      if (!reduce) confetti();
    })();
  }

  function confetti() {
    var c = document.createElement("canvas");
    c.className = "hf-confetti";
    document.body.appendChild(c);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
    var ctx = c.getContext("2d");
    var colors = ["#c65a3a", "#e0704a", "#30c9fa", "#033f63", "#d7a02b", "#f5f0e8"];
    var parts = [];
    for (var i = 0; i < 180; i++) {
      var left = i % 2 === 0;
      parts.push({
        x: left ? 0 : W, y: H * 0.65,
        vx: (left ? 1 : -1) * (6 + Math.random() * 12) * dpr, vy: -(12 + Math.random() * 16) * dpr,
        r: (4 + Math.random() * 6) * dpr, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.4,
        c: colors[i % colors.length], round: Math.random() < 0.3,
      });
    }
    var t0 = performance.now();
    (function frame(t) {
      var life = (t - t0) / 3600;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.42 * dpr; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - life);
        ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, 6.28); ctx.fill(); }
        else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      });
      if (life < 1) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  /* ---------------- button light follows the pointer ---------------- */
  if (!reduce) document.addEventListener("pointermove", function (e) {
    var b = e.target.closest && e.target.closest(".btn");
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--mx", (e.clientX - r.left) + "px");
    b.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  paintButton();
  paintProgress();
  restore();
})();
