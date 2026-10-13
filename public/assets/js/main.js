/* NorthB&B — progressive enhancement. Vanilla, no dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;

  /* ---------- Cookie notice ---------- */
  (function () {
    var bar = document.getElementById("cookie-bar");
    if (!bar) return;
    var KEY = "nb_cookie_ack";
    var acked = false;
    try { acked = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!acked) {
      bar.hidden = false;
      document.body.classList.add("cookie-open");
    }
    var btn = bar.querySelector("[data-cookie-ack]");
    if (btn) btn.addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      bar.hidden = true;
      document.body.classList.remove("cookie-open");
    });
  })();

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setOpen(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  doc.classList.add("reveal-ready");
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = target + suffix; return; }
      var start = null, dur = 1100;
      var tick = function (t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* ---------- Simple form AJAX (newsletter, contact) ---------- */
  function wireBasicForm(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.getAttribute("data-form");
      var msg = document.querySelector('[data-form-msg="' + name + '"]');
      var btn = form.querySelector('[type="submit"]');
      var email = form.querySelector('input[type="email"]');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        if (msg) { msg.textContent = "Please enter a valid email address."; msg.style.color = "#c0392b"; }
        email.focus();
        return;
      }
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (data) {
          if (data && data.ok) {
            form.reset();
            if (msg) { msg.textContent = data.message || "Thanks, you're subscribed."; msg.style.color = "#15663b"; }
          } else {
            if (msg) { msg.textContent = (data && data.message) || "Something went wrong. Please try again."; msg.style.color = "#c0392b"; }
          }
        })
        .catch(function () {
          if (msg) { msg.textContent = "Network error. Please try again."; msg.style.color = "#c0392b"; }
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = original; } });
    });
  }
  document.querySelectorAll('form[data-form="newsletter"], form[data-form="contact"]').forEach(wireBasicForm);

  /* ---------- Search page: hydrate from query string ---------- */
  if (location.pathname.indexOf("/search") === 0) {
    try {
      var params = new URLSearchParams(location.search);
      var dest = (params.get("destination") || "").slice(0, 80);
      var ci = params.get("checkin") || "";
      var co = params.get("checkout") || "";
      var setVal = function (id, v) { var el = document.getElementById(id); if (el && v) el.value = v; };
      setVal("s-dest", dest); setVal("s-in", ci); setVal("s-out", co);
      var summary = document.querySelector("[data-search-summary]");
      if (summary && dest) {
        var txt = "Showing stays in " + dest;
        if (ci && co) txt += " · " + ci + " to " + co;
        summary.textContent = txt + ".";
      }
    } catch (e) { /* no-op */ }
  }

  /* ---------- Button light that follows the pointer (refresh pages) ---------- */
  if (document.body.classList.contains("refresh") && !reduce) {
    document.addEventListener("pointermove", function (e) {
      var b = e.target.closest && e.target.closest(".btn");
      if (!b) return;
      var r = b.getBoundingClientRect();
      b.style.setProperty("--mx", (e.clientX - r.left) + "px");
      b.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }
})();
