/* ============================================================
   LAYER 5 — MOTION & CHOREOGRAPHY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---- Hero word-by-word blur reveal (100ms stagger) ---- */
  const heroWords = document.querySelectorAll("[data-hero-text] .word");

  if (prefersReduced) {
    heroWords.forEach((w) => {
      w.style.opacity = "1";
      w.style.transform = "none";
      w.style.filter = "none";
    });
  } else {
    heroWords.forEach((word, i) => {
      setTimeout(() => {
        word.style.transition =
          "opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease";
        word.style.opacity = "1";
        word.style.transform = "translateY(0)";
        word.style.filter = "blur(0)";
      }, i * 100);
    });
  }

  /* ---- Sticker badge delayed pop-in + rotation ---- */
  const badges = document.querySelectorAll("[data-badge]");

  badges.forEach((badge, i) => {
    const delay = 600 + i * 140;
    setTimeout(() => {
      badge.style.transition =
        "opacity 0.5s cubic-bezier(.34,1.56,.64,1), transform 0.5s cubic-bezier(.34,1.56,.64,1)";
      badge.style.opacity = "1";
      badge.style.transform = `rotate(${badge.style.getPropertyValue("--r")}) scale(1)`;
    }, delay);
  });

  /* ---- Scroll reveal for project media (IntersectionObserver) ---- */
  const mediaEls = document.querySelectorAll("[data-media]");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    mediaEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // small delay for a delayed blur fade feel
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, 120 * idx);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    mediaEls.forEach((el) => observer.observe(el));
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  const navPill = document.querySelector(".nav-pill");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinkEls = document.querySelectorAll(".nav-links a");

  if (navPill && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = navPill.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinkEls.forEach((link) => {
      link.addEventListener("click", () => {
        navPill.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Theme toggle (persisted) ---- */
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  const storedTheme = localStorage.getItem("theme");
  const initialTheme =
    storedTheme ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  root.setAttribute("data-theme", initialTheme);
  if (themeToggle) {
    themeToggle.textContent = initialTheme === "light" ? "Dark" : "Light";
    themeToggle.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeToggle.textContent = next === "light" ? "Dark" : "Light";
    });
  }

  /* ---- Project filtering ---- */
  const filterBtns = document.querySelectorAll(".project-filters button");
  const projectEls = document.querySelectorAll(".project");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      projectEls.forEach((p) => {
        const cats = (p.dataset.cat || "").split(" ");
        const show = cat === "all" || cats.includes(cat);
        p.classList.toggle("is-hidden", !show);
        if (show) {
          const media = p.querySelector("[data-media]");
          if (media) media.classList.add("is-visible");
        }
      });
    });
  });

  /* ---- Contact form (Formsubmit AJAX) ---- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = contactForm.querySelector(".contact-form__status");
      const btn = contactForm.querySelector("button");
      btn.disabled = true;
      status.textContent = "Sending…";
      try {
        const res = await fetch(
          "https://formsubmit.co/ajax/farhancchemmala@gmail.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(
              Object.fromEntries(new FormData(contactForm))
            ),
          }
        );
        if (res.ok) {
          status.textContent = "Thanks! Your message is on its way.";
          contactForm.reset();
        } else {
          status.textContent =
            "Something went wrong. Try emailing me directly.";
        }
      } catch {
        status.textContent = "Network error. Try emailing me directly.";
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---- Flip nav pill to dark theme when it overlaps the white footer ---- */
  const footerEl = document.querySelector(".footer");
  if (footerEl && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    footerObserver.observe(footerEl);
  }
});
