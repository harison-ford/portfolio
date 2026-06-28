/* =========================================================
   Portfolio — script.js
   - Scroll reveal (IntersectionObserver)
   - Image lightbox + custom hover cursor
   - Color-coded skills -> highlight matching projects
   - Image lightbox gallery + custom hover cursor
   ========================================================= */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------
     Footer year
  ------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------
     Nav background on scroll
  ------------------------------------------------------ */
  const nav = document.getElementById("nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ------------------------------------------------------
     Scroll reveal ("view as you scroll")
  ------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------
     Lightbox gallery + custom hover cursor
  ------------------------------------------------------ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const cursorHint = document.getElementById("cursorHint");
  const mediaButtons = document.querySelectorAll(".project__media");

  let gallery = [];
  let galleryIndex = 0;
  let galleryTitle = "";

  const updateNav = () => {
    const multi = gallery.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !multi;
    if (lightboxNext) lightboxNext.hidden = !multi;
    if (lightboxCounter) {
      lightboxCounter.textContent = multi ? `${galleryIndex + 1} / ${gallery.length}` : "";
      lightboxCounter.hidden = !multi;
    }
  };

  const showSlide = (index) => {
    if (!gallery.length || !lightboxImg) return;
    galleryIndex = (index + gallery.length) % gallery.length;
    lightboxImg.src = gallery[galleryIndex];
    lightboxImg.alt = galleryTitle;
    if (lightboxCaption) lightboxCaption.textContent = galleryTitle;
    updateNav();
  };

  const openLightbox = (btn) => {
    if (!lightbox || !btn) return;
    galleryTitle = btn.dataset.title || "";
    try {
      gallery = JSON.parse(btn.dataset.gallery || "[]");
    } catch {
      gallery = [];
    }
    if (!gallery.length && btn.dataset.img) gallery = [btn.dataset.img];
    if (!gallery.length) return;

    showSlide(0);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    deactivateCursor();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    gallery = [];
    galleryIndex = 0;
  };

  const stepGallery = (dir) => {
    if (gallery.length < 2) return;
    showSlide(galleryIndex + dir);
  };

  mediaButtons.forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(1); });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepGallery(-1);
    if (e.key === "ArrowRight") stepGallery(1);
  });

  // Custom cursor that follows the mouse over expandable images
  const activateCursor = () => cursorHint && cursorHint.classList.add("is-active");
  const deactivateCursor = () => cursorHint && cursorHint.classList.remove("is-active");

  if (cursorHint && window.matchMedia("(hover: hover)").matches) {
    let rafId = null;
    let mx = 0;
    let my = 0;
    const render = () => {
      cursorHint.style.left = mx + "px";
      cursorHint.style.top = my + "px";
      rafId = null;
    };
    mediaButtons.forEach((btn) => {
      btn.addEventListener("mouseenter", activateCursor);
      btn.addEventListener("mouseleave", deactivateCursor);
      btn.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (rafId === null) rafId = requestAnimationFrame(render);
      });
    });
  }

  /* ------------------------------------------------------
     Color-coded skills -> scroll to & highlight projects
  ------------------------------------------------------ */
  const chips = document.querySelectorAll(".chip");
  const grid = document.getElementById("projectsGrid");
  const projects = grid ? grid.querySelectorAll(".project") : [];
  const filterNote = document.getElementById("projectsFilterNote");
  const selectedSkills = new Set();

  // Pick a readable text color (black/white) for a given hex background.
  const readableText = (hex) => {
    const m = String(hex).trim().replace("#", "");
    if (m.length < 6) return "#0c0c11";
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    // Relative luminance
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return lum > 0.6 ? "#0c0c11" : "#ffffff";
  };

  // Precompute each chip's color, label + readable text color.
  const skillColors = {};
  const skillLabels = {};
  chips.forEach((chip) => {
    const color = (chip.style.getPropertyValue("--chip") || "#7c5cff").trim();
    const text = readableText(color);
    chip.style.setProperty("--chip-text", text);
    skillColors[chip.dataset.skill] = { color, text };
    skillLabels[chip.dataset.skill] = chip.textContent.trim();
  });

  // Build an equal-segment gradient string from a list of colors.
  const buildGradient = (colors) => {
    if (colors.length === 1) {
      return `linear-gradient(${colors[0]}, ${colors[0]})`;
    }
    const step = 100 / colors.length;
    const stops = colors
      .map((c, i) => `${c} ${(i * step).toFixed(2)}% ${((i + 1) * step).toFixed(2)}%`)
      .join(", ");
    return `linear-gradient(135deg, ${stops})`;
  };

  // Join labels into a readable list: "A", "A and B", "A, B and C".
  const joinLabels = (labels) => {
    if (labels.length <= 1) return labels.join("");
    if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  };

  const resetProjectStyles = (p) => {
    p.classList.remove("is-match");
    p.style.removeProperty("--match-gradient");
    p.style.removeProperty("--match-color");
    p.querySelectorAll(".tag").forEach((t) => {
      t.classList.remove("is-active");
      t.style.removeProperty("background");
      t.style.removeProperty("color");
      t.style.removeProperty("border-color");
    });
  };

  const clearFilter = () => {
    selectedSkills.clear();
    if (grid) grid.classList.remove("is-filtering");
    projects.forEach(resetProjectStyles);
    chips.forEach((c) => c.classList.remove("is-active"));
    if (filterNote) filterNote.textContent = "";
  };

  const renderFilter = () => {
    if (selectedSkills.size === 0) {
      clearFilter();
      return;
    }
    if (grid) grid.classList.add("is-filtering");
    chips.forEach((c) => c.classList.toggle("is-active", selectedSkills.has(c.dataset.skill)));

    let count = 0;
    projects.forEach((p) => {
      const projSkills = (p.dataset.skills || "").split(/\s+/).filter(Boolean);
      // Selected skills this project actually uses (keep chip order for stable colors).
      const matched = [...selectedSkills].filter((s) => projSkills.includes(s));

      if (matched.length === 0) {
        resetProjectStyles(p);
        return;
      }
      count++;
      p.classList.add("is-match");

      const colors = matched.map((s) => skillColors[s].color);
      p.style.setProperty("--match-gradient", buildGradient(colors));
      p.style.setProperty("--match-color", colors[0]);

      // Light up each matching tag in its own skill color.
      p.querySelectorAll(".tag").forEach((t) => {
        const sc = skillColors[t.dataset.skill];
        if (matched.includes(t.dataset.skill) && sc) {
          t.classList.add("is-active");
          t.style.background = sc.color;
          t.style.color = sc.text;
          t.style.borderColor = sc.color;
        } else {
          t.classList.remove("is-active");
          t.style.removeProperty("background");
          t.style.removeProperty("color");
          t.style.removeProperty("border-color");
        }
      });
    });

    if (filterNote) {
      const labels = [...selectedSkills].map((s) => skillLabels[s]);
      filterNote.textContent = `Showing ${count} project${count === 1 ? "" : "s"} using ${joinLabels(labels)}.`;
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const skill = chip.dataset.skill;
      const wasEmpty = selectedSkills.size === 0;
      if (selectedSkills.has(skill)) {
        selectedSkills.delete(skill);
      } else {
        selectedSkills.add(skill);
      }
      renderFilter();

      // Scroll to projects only when starting a fresh selection.
      if (wasEmpty && selectedSkills.size > 0) {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            block: "start",
          });
        }
      }
    });
  });

})();
