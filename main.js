function createCard(item, extraClass = "") {
  const card = document.createElement("figure");
  card.className = `portfolio-card${extraClass ? ` ${extraClass}` : ""}`;
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.alt;
  img.loading = "lazy";
  img.draggable = false;
  img.onerror = () => {
    if (img.dataset.fallback !== "1") {
      img.src = item.fallback;
      img.dataset.fallback = "1";
    }
  };
  card.appendChild(img);
  card.dataset.fullSrc = item.src;
  card.dataset.fallbackSrc = item.fallback;
  return card;
}

function renderTrack(track, items, cardClass = "") {
  if (!track) return;
  track.innerHTML = "";
  items.forEach((item) => {
    track.appendChild(createCard(item, cardClass));
    track.appendChild(createCard(item, cardClass));
  });
}

function initMarquee(wrap) {
  const track = wrap.querySelector(".marquee-track");
  if (!track) return;

  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
  let currentOffset = 0;
  let dragMoved = false;
  let rafId = null;

  const getAnimOffset = () => {
    const style = getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.m41;
  };

  const applyOffset = (px) => {
    track.style.transform = `translateX(${px}px)`;
  };

  const freezeToCurrent = () => {
    currentOffset = getAnimOffset();
    track.style.animation = "none";
    applyOffset(currentOffset);
  };

  const resumeAnimation = () => {
    if (isDragging) return;
    track.style.animation = "";
    track.style.transform = "";
    currentOffset = 0;
  };

  wrap.addEventListener("mouseenter", () => {
    wrap.classList.add("is-paused");
    freezeToCurrent();
  });

  wrap.addEventListener("mouseleave", () => {
    wrap.classList.remove("is-paused");
    if (!isDragging) resumeAnimation();
  });

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragMoved = false;
    wrap.classList.add("is-dragging", "is-paused");
    freezeToCurrent();
    startX = e.clientX;
    startOffset = currentOffset;
    track.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) dragMoved = true;
    currentOffset = startOffset + dx;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => applyOffset(currentOffset));
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove("is-dragging");
    if (!wrap.matches(":hover")) {
      wrap.classList.remove("is-paused");
      resumeAnimation();
    }
  };

  track.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  track.addEventListener("click", (e) => {
    if (dragMoved) return;
    const card = e.target.closest(".portfolio-card");
    if (!card) return;
    const img = card.querySelector("img");
    const src =
      img?.dataset.fallback === "1"
        ? card.dataset.fallbackSrc
        : img?.currentSrc || img?.src || card.dataset.fullSrc;
    openLightbox(src, img?.alt || "");
  });
}

function initLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = lb?.querySelector(".lightbox-img");
  const closeBtn = lb?.querySelector(".lightbox-close");
  if (!lb || !lbImg) return;

  const close = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("hidden", "");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  window.openLightbox = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.removeAttribute("hidden");
    lb.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };

  closeBtn?.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("is-open")) close();
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const links = document.querySelectorAll(".nav-links a[href^='#']");
  if (!links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

function initHomePortfolio() {
  document.querySelectorAll("[data-project-preview]").forEach((wrap) => {
    const id = Number(wrap.dataset.projectPreview);
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) return;
    const track = wrap.querySelector(".marquee-track");
    const cardClass = project.type === "mobile" ? "portfolio-card--mobile" : "portfolio-card--desktop";
    renderTrack(track, getProjectImages(project), cardClass);
    initMarquee(wrap);
  });
}

function initProjectPage() {
  const root = document.getElementById("project-root");
  if (!root) return;

  const slug = root.dataset.slug;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return;

  document.title = `${project.title} · UI 作品集`;

  const setText = (sel, text) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };

  setText("[data-project-title]", project.title);
  setText("[data-project-subtitle]", project.subtitle);
  setText("[data-project-type]", project.typeLabel);
  setText("[data-project-year]", project.year);
  setText("[data-project-intro]", project.intro);
  setText("[data-project-concept]", project.concept);

  const track = document.getElementById("project-track");
  const cardClass = project.type === "mobile" ? "portfolio-card--mobile" : "portfolio-card--desktop";
  renderTrack(track, getProjectImages(project), cardClass);

  const wrap = document.querySelector("[data-project-gallery]");
  if (wrap) initMarquee(wrap);
}

document.addEventListener("DOMContentLoaded", () => {
  initLightbox();
  initNavHighlight();
  initHomePortfolio();
  initProjectPage();
  document.querySelectorAll(".marquee-wrap:not([data-project-preview])").forEach(initMarquee);
});
