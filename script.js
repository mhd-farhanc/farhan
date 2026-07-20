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
});
