/* ==========================================================================
   Bike Rental · page behaviour
   1. Scroll reveal animations
   2. Mobile menu
   3. "I want to ride / lend" buttons preselect the form option
   4. Sign up form (validation, submit, thank-you state)
   5. Live waitlist counter
   6. Lunch break planner (problem section)
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- 1. Scroll reveal ------------------------------------------------- */
  var reveals = $$(".reveal");
  // small stagger for siblings that appear together (cards in a grid etc.)
  reveals.forEach(function (el) {
    var siblings = $$(":scope > .reveal", el.parentElement);
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--d", Math.min(index * 0.07, 0.35) + "s");
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- 2. Mobile menu --------------------------------------------------- */
  var toggle = $(".menu-toggle");
  var menu = $("#mobile-menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* ---- 3. Preselect role from buttons ---------------------------------- */
  var form = $("#signup-form");
  var bikeField = $("#bike-type-field");
  var bikeSelect = $("#f-bike");

  function updateBikeField() {
    var role = form.elements.role.value;
    var needsBike = role === "lend" || role === "both";
    bikeField.hidden = !needsBike;
    bikeSelect.required = needsBike;
    if (!needsBike) { bikeSelect.value = ""; bikeSelect.removeAttribute("aria-invalid"); }
  }

  function selectRole(role) {
    var radio = $('input[name="role"][value="' + role + '"]', form);
    if (!radio) return;
    radio.checked = true;
    updateBikeField();
  }

  if (form) {
    $$("[data-role-select]").forEach(function (btn) {
      btn.addEventListener("click", function () { selectRole(btn.getAttribute("data-role-select")); });
    });
    $$('input[name="role"]', form).forEach(function (r) { r.addEventListener("change", updateBikeField); });
    updateBikeField();
  }

  /* ---- 4. Sign up form -------------------------------------------------- */
  var errorBox = form && $(".form__error", form);
  var thanks = $("#signup-thanks");

  function isSchoolEmail(email) {
    var domains = CONFIG.schoolEmailDomains || [];
    if (!domains.length) return true;
    var at = email.lastIndexOf("@");
    if (at < 1) return false;
    var host = email.slice(at + 1).toLowerCase();
    return domains.some(function (d) { d = d.toLowerCase(); return host === d || host.slice(-(d.length + 1)) === "." + d; });
  }

  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
  }

  function validate() {
    var f = form.elements;
    $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
    errorBox.hidden = true;

    var name = f.name.value.trim();
    var email = f.email.value.trim();
    var cls = f.class_year.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) return showError("Please tell us your name.", f.name), false;
    if (!emailOk) return showError("Please enter a valid email address.", f.email), false;
    if (!isSchoolEmail(email)) return showError("Please use your school email address (" + CONFIG.schoolEmailDomains.join(", ") + ").", f.email), false;
    if (!cls) return showError("Please add your class or year.", f.class_year), false;
    if (bikeSelect.required && !bikeSelect.value) return showError("Please choose your bike type.", bikeSelect), false;
    if (!f.age_ok.checked) return showError("Please confirm that you are 16 or older, or have your parent's permission.", f.age_ok), false;
    if (!f.privacy_ok.checked) return showError("Please confirm that you have read the privacy notice.", f.privacy_ok), false;
    return true;
  }

  function showThanks(email) {
    $("[data-thanks-email]", thanks).textContent = email;
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus({ preventScroll: true });
    var top = thanks.getBoundingClientRect().top + window.scrollY - 140;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (form) {
    // clear the red state as soon as the user fixes a field
    form.addEventListener("input", function (e) { e.target.removeAttribute("aria-invalid"); });
    form.addEventListener("change", function (e) { e.target.removeAttribute("aria-invalid"); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var f = form.elements;
      // Only what we really need is sent (data minimisation).
      var payload = {
        name: f.name.value.trim(),
        email: f.email.value.trim().toLowerCase(),
        class_year: f.class_year.value.trim(),
        role: f.role.value,
        bike_type: bikeSelect.required ? bikeSelect.value : null,
        age_ok: f.age_ok.checked,
        privacy_ok: f.privacy_ok.checked,
        website: f.website.value // honeypot, must stay empty
      };

      var button = $('button[type="submit"]', form);
      var label = $(".btn__label", button);
      button.setAttribute("aria-busy", "true");
      label.textContent = "Sending…";

      var request;
      if (!CONFIG.endpoint) {
        // DEMO MODE: no backend configured yet (see js/config.js)
        console.info("Bike Rental demo mode: sign up not stored. Set SITE_CONFIG.endpoint to connect the backend.", payload);
        request = new Promise(function (resolve) { setTimeout(resolve, 700); });
      } else {
        request = fetch(CONFIG.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok || !body.ok) throw new Error(body.error || "Something went wrong. Please try again.");
          });
        });
      }

      request.then(function () {
        showThanks(payload.email);
      }).catch(function (err) {
        var msg = err && err.message && !/fetch|network/i.test(err.message) ? err.message : "We could not reach the server. Please check your connection and try again.";
        showError(msg);
      }).then(function () {
        button.removeAttribute("aria-busy");
        label.textContent = "Join the waitlist";
      });
    });
  }

  /* ---- 5. Live counter -------------------------------------------------- */
  var counter = $("[data-counter]");
  var goals = CONFIG.goals || { riders: 50, owners: 15 };

  function animateNumber(el, to) {
    if (reduceMotion || to < 3) { el.textContent = to; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderStats(stats) {
    ["total", "riders", "owners"].forEach(function (key) {
      var el = $('[data-count="' + key + '"]', counter);
      if (el) animateNumber(el, stats[key] || 0);
    });
    ["riders", "owners"].forEach(function (key) {
      var goalEl = $('[data-goal="' + key + '"]', counter);
      if (goalEl) goalEl.textContent = goals[key];
      var bar = $('[data-bar="' + key + '"]', counter);
      if (bar) bar.style.width = Math.min(100, ((stats[key] || 0) / goals[key]) * 100) + "%";
    });
    if (stats.total === 1) $("[data-count-label]", counter).textContent = "student already on the list";
    if (!stats.total) $("[data-count-label]", counter).textContent = "Be one of the first to join.";
  }

  function loadStats() {
    if (!counter) return;
    if (!CONFIG.endpoint) { renderStats({ total: 0, riders: 0, owners: 0 }); return; }
    fetch(CONFIG.endpoint + (CONFIG.endpoint.indexOf("?") > -1 ? "&" : "?") + "stats=1")
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(renderStats)
      .catch(function () { counter.hidden = true; }); // never show broken numbers
  }

  // load when the sign up section comes close, so the count-up is visible
  if (counter && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { cio.disconnect(); loadStats(); }
    }, { rootMargin: "200px" });
    cio.observe(counter);
  } else {
    loadStats();
  }
  /* ---- 6. Lunch break planner ------------------------------------------
     Pasch is 1.7 km away. Minutes one way: about 20 on foot (5 km/h),
     about 6 by bike (17 km/h). Change these if you measure better values. */
  var planner = $("[data-planner]");
  var ONE_WAY = { walk: 20, bike: 6 };

  function updatePlanner() {
    var breakMin = parseInt($("#break-len", planner).value, 10);
    $("[data-break]", planner).textContent = breakMin;
    Object.keys(ONE_WAY).forEach(function (mode) {
      var travel = ONE_WAY[mode] * 2;
      var stay = breakMin - travel;
      var track = $('[data-track="' + mode + '"]', planner);
      var segs = $$(".seg", track);
      // when the trip takes longer than the break, the bar grows past it and the overrun shows in red
      track.style.setProperty("--total", Math.max(breakMin, travel));
      segs[1].style.setProperty("--m", Math.abs(stay));
      segs[1].classList.toggle("seg--late", stay < 0);
      segs[1].classList.toggle("seg--stay", stay >= 0);
      var result = $('[data-result="' + mode + '"]', planner);
      result.innerHTML = stay >= 0
        ? "<b>" + stay + " min</b> at Pasch"
        : "<b>" + -stay + " min late</b> back to class";
    });
  }
  if (planner) {
    $("#break-len", planner).addEventListener("input", updatePlanner);
    updatePlanner();
  }
})();
