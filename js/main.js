/* ============================================================
   Schreiber Custom Solutions — site scripts
   ------------------------------------------------------------
   EDIT ME: business details live in SITE_CONFIG below.
   ============================================================ */

var SITE_CONFIG = {
  // Pete's business details — used everywhere on the site:
  phone: "(262) 490-2318",
  phoneHref: "tel:+12624902318",
  email: "peter@schreibercustomsolutions.com",
  // Formspree form endpoint (free at formspree.io). Leave null to use the
  // offline fallback (shows phone/email instead of sending).
  formEndpoint: null // e.g. "https://formspree.io/f/yourFormId"
};

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* Keep every phone / email link on the page in sync with SITE_CONFIG */
  document.querySelectorAll("[data-phone-link]").forEach(function (el) {
    el.setAttribute("href", SITE_CONFIG.phoneHref);
    el.textContent = el.textContent.replace(/\([\d-]+\)[\d\s-]+/, SITE_CONFIG.phone);
  });
  document.querySelectorAll("[data-email-link]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + SITE_CONFIG.email);
    el.textContent = SITE_CONFIG.email;
  });

  var header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 40);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menu = document.querySelector(".mobile-menu");
  var toggle = document.querySelector(".menu-toggle");
  var closeBtn = document.querySelector(".mobile-menu-close");

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      document.body.style.overflow = menu.classList.contains("is-open")
        ? "hidden"
        : "";
      toggle.setAttribute(
        "aria-expanded",
        menu.classList.contains("is-open") ? "true" : "false"
      );
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  menu &&
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  /* ---------- Reveal on scroll ----------
     Sweep-based so it also works with fast scrolling / anchor jumps. */
  var revealEls = document.querySelectorAll("[data-reveal]");

  function revealInView() {
    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (el.getBoundingClientRect().top < vh * 0.92) {
        el.classList.add("is-visible");
      }
    });
  }

  if (revealEls.length) {
    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView);
    revealInView();
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  var lbImg = lightbox && lightbox.querySelector("img");
  var lbCaption = lightbox && lightbox.querySelector(".lightbox-caption");
  var lbClose = lightbox && lightbox.querySelector(".lightbox-close");

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (lightbox) {
    document.querySelectorAll(".gallery-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        var cap = item.querySelector(".gallery-caption");
        if (!img) return;
        lbImg.src = img.getAttribute("data-full") || img.src;
        lbImg.alt = img.alt || "";
        if (lbCaption) lbCaption.textContent = cap ? cap.textContent : "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var btn = form.querySelector('button[type="submit"]');
      var note = "Thanks — we'll be in touch shortly!";

      if (!SITE_CONFIG.formEndpoint) {
        // Offline fallback: no Formspree configured yet.
        status.textContent =
          "Thanks! We're not set up to receive online forms yet — " +
          "please call " +
          SITE_CONFIG.phone +
          " or email " +
          SITE_CONFIG.email +
          ".";
        form.reset();
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending…";

      fetch(SITE_CONFIG.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            status.textContent = note;
            form.reset();
          } else {
            status.textContent =
              "Something went wrong — please try again or call us directly.";
          }
        })
        .catch(function () {
          status.textContent =
            "Something went wrong — please try again or call us directly.";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = "Send Message";
        });
    });
  }
})();
