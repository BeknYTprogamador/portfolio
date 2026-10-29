/* Small, dependency-free interactions. */
(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("#site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-list a")
  );

  /* ---- Mobile navigation ------------------------------------------------- */

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeNav();
    });
  }

  /* ---- Theme ------------------------------------------------------------- */

  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeMeta = document.getElementById("meta-theme-color");
  var themeStorageKey = "theme";
  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  var themeIsPinned = false;

  try {
    var savedTheme = localStorage.getItem(themeStorageKey);
    themeIsPinned = savedTheme === "light" || savedTheme === "dark";
  } catch (error) {
    themeIsPinned = false;
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function updateThemeUI(theme) {
    if (!themeToggle) return;
    var isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "title",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#0e120f" : "#f7f5ef");
    }
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;

    if (persist) {
      themeIsPinned = true;
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch (error) {
        /* Storage can be unavailable; the theme still applies for this visit. */
      }
    }

    updateThemeUI(theme);
  }

  if (themeToggle) {
    document.documentElement.classList.add("theme-ready");
    updateThemeUI(getTheme());

    themeToggle.addEventListener("click", function () {
      applyTheme(getTheme() === "dark" ? "light" : "dark", true);
    });
  }

  function followSystemTheme(event) {
    if (themeIsPinned) return;
    applyTheme(event.matches ? "dark" : "light", false);
  }

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", followSystemTheme);
  } else if (systemTheme.addListener) {
    systemTheme.addListener(followSystemTheme);
  }

  /* ---- Header state + active section ------------------------------------ */

  var linkedSections = navLinks
    .map(function (link) {
      var hash = link.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") return null;
      var section = document.querySelector(hash);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  var ticking = false;

  function updateOnScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 6);
    }

    var marker = 150;
    var current = null;
    var atBottom =
      Math.ceil(scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2;

    linkedSections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= marker) {
        current = item;
      }
    });

    if (atBottom && linkedSections.length) {
      current = linkedSections[linkedSections.length - 1];
    }

    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", Boolean(current && current.link === link));
      if (current && current.link === link) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOnScroll);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateOnScroll();

  /* ---- Reveal on scroll -------------------------------------------------- */

  var revealElements = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  /* ---- Copy email -------------------------------------------------------- */

  var copyButton = document.querySelector("[data-copy-email]");
  var copyStatus = document.querySelector("[data-copy-status]");
  var email = "vp485454@gmail.com";
  var copyResetTimer;

  function fallbackCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    var copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    } finally {
      field.remove();
    }

    return copied;
  }

  function showCopySuccess() {
    copyButton.textContent = "Copied";
    if (copyStatus) copyStatus.textContent = "Email copied to clipboard.";
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(function () {
      copyButton.textContent = "Copy email";
      if (copyStatus) copyStatus.textContent = "";
    }, 2400);
  }

  function showCopyFailure() {
    if (copyStatus) {
      copyStatus.textContent = "Copy didn't work — the email is " + email;
    }
  }

  function copyEmail() {
    if (!copyButton) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(email)
        .then(showCopySuccess)
        .catch(function () {
          if (fallbackCopy(email)) {
            showCopySuccess();
          } else {
            showCopyFailure();
          }
        });
    } else if (fallbackCopy(email)) {
      showCopySuccess();
    } else {
      showCopyFailure();
    }
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyEmail);
  }

  /* ---- Current year ------------------------------------------------------ */

  var year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
