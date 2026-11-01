/* Shared runtime: component registry, helpers, one rAF-throttled scroll loop. */
window.Cafe = (function () {
  const components = {};
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ESC[c]);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // One scroll/resize loop shared by every scroll-linked component.
  const frameSubs = new Set();
  let ticking = false;
  const tick = () => { ticking = false; frameSubs.forEach((fn) => fn()); };
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);

  const onFrame = (fn) => { frameSubs.add(fn); requestFrame(); return () => frameSubs.delete(fn); };

  // Re-measure listeners (layout changes: resize, fonts, media query flips).
  const layoutSubs = new Set();
  let layoutTimer;
  const relayout = () => { clearTimeout(layoutTimer); layoutTimer = setTimeout(() => { layoutSubs.forEach((fn) => fn()); requestFrame(); }, 120); };
  window.addEventListener("resize", relayout);
  window.addEventListener("load", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  const onLayout = (fn) => { layoutSubs.add(fn); return () => layoutSubs.delete(fn); };

  const cfg = () => window.CAFE_CONFIG;
  // On subpages, in-page anchors must point back to the landing page.
  const home = () => document.body.dataset.home || "";
  const resolveHref = (href) => {
    if (href === "resume") return cfg().site.resumeUrl;
    if (href.startsWith("#")) return home() + href;
    return href;
  };
  const mailto = () => {
    const s = cfg().site;
    return `mailto:${s.email}?subject=${encodeURIComponent(s.emailSubject || "")}`;
  };

  // Reveal-on-scroll for elements with .reveal
  let revealObserver;
  const observeReveals = (root = document) => {
    const els = root.querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window) || mqReduce.matches) { els.forEach((el) => el.classList.add("is-in")); return; }
    revealObserver = revealObserver || new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach((el) => revealObserver.observe(el));
  };

  // Decorative sticker illustration (config: { src, w, h }); wrapped so it can float and wiggle.
  const sticker = (s, mod) => s && s.src ? `<span class="sticker sticker--${mod}" aria-hidden="true"><img src="${esc(s.src)}" width="${s.w}" height="${s.h}" alt="" loading="lazy" decoding="async"></span>` : "";

  // Smooth scrolling (mouse wheel / trackpad), Lenis-style: the wheel moves a target and the
  // page eases towards it. Still real scrolling underneath, so sticky sections and scroll
  // handlers work as normal. Off for touch, reduced motion, pinch-zoom and open dialogs.
  (() => {
    let target = window.scrollY, current = window.scrollY, active = false, raf = 0, last = 0;
    const max = () => document.documentElement.scrollHeight - window.innerHeight;
    const stop = () => { active = false; cancelAnimationFrame(raf); raf = 0; };
    const step = (now) => {
      const dt = Math.min(64, now - (last || now)); last = now;
      current += (target - current) * (1 - Math.pow(0.9, dt / 16.67));
      if (Math.abs(target - current) < 0.4) { current = target; active = false; }
      window.scrollTo({ top: current, behavior: "instant" });
      raf = active ? requestAnimationFrame(step) : 0;
    };
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey || mqReduce.matches || !mqFine.matches) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (document.querySelector("dialog[open]") || (e.target.closest && e.target.closest(".nav.is-open, [data-native-scroll]"))) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      if (!active) { current = target = window.scrollY; last = 0; }
      target = Math.max(0, Math.min(max(), target + e.deltaY * unit));
      e.preventDefault();
      if (!active) { active = true; raf = requestAnimationFrame(step); }
    }, { passive: false });
    // keys, scrollbar drags and anchor jumps take over: resync instead of fighting them
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("scroll", () => { if (!active) current = target = window.scrollY; }, { passive: true });
  })();

  return {
    components, sticker,
    register: (name, c) => { components[name] = c; },
    esc, clamp, lerp, cfg, resolveHref, mailto, home,
    onFrame, requestFrame, onLayout, relayout, observeReveals,
    reducedMotion: () => mqReduce.matches,
    finePointer: () => mqFine.matches,
    mqReduce, mqFine,
    query: (key) => new URLSearchParams(window.location.search).get(key),
  };
})();
