/* Decorative custom cursor (fine pointers only). A coffee bean by default;
   hovering a project card ([data-cursor="espresso"]) swaps in Darrpana's espresso cup.
   The cup trails the pointer a touch and tilts with the motion, as if carried;
   its steam is live SVG: three wisps that sway (path morph) while dashes rise along them.
   A pink dot always marks the exact click point. */

// One wisp = two S-curves of the same shape that the path morphs between.
// Coordinates share the cup art's 512 × 598 canvas; the rim sits at y ≈ 265.
Cafe.steamWisps = [
  { a: "M200 252 C168 214 232 186 200 146 C168 106 232 76 200 30", b: "M200 252 C232 214 168 186 200 146 C232 106 168 76 200 30", dur: 2.6, rise: 2.4, delay: 0 },
  { a: "M280 248 C256 214 304 194 280 160 C256 128 304 108 282 80", b: "M280 248 C304 214 256 194 280 160 C304 128 256 108 278 80", dur: 2.2, rise: 2.0, delay: -0.9 },
  { a: "M126 252 C106 222 146 204 126 176 C108 150 142 132 124 108", b: "M126 252 C146 222 106 204 126 176 C144 150 110 132 128 108", dur: 2.9, rise: 2.7, delay: -1.6 },
];

Cafe.steamSVG = () => {
  const ease = 'calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"';
  const defs = Cafe.steamWisps.map((w, i) => `
    <path id="c-wisp-${i}" pathLength="100" d="${w.a}">
      <animate attributeName="d" values="${w.a};${w.b};${w.a}" dur="${w.dur}s" begin="${w.delay}s" repeatCount="indefinite" ${ease}/>
    </path>`).join("");
  const layer = (stroke, width) => Cafe.steamWisps.map((w, i) =>
    `<use href="#c-wisp-${i}" class="c-wisp" style="--rise:${w.rise}s;--delay:${w.delay}s" stroke="${stroke}" stroke-width="${width}"/>`).join("");
  return `<svg class="c-steam" viewBox="0 0 512 598" fill="none" stroke-linecap="round" aria-hidden="true" focusable="false">
    <defs>${defs}</defs>${layer("#6C6AFB", 66)}${layer("#151515", 30)}</svg>`;
};

Cafe.register("cursor", {
  render(cfg) {
    const { esc } = Cafe;
    const cup = cfg.work && cfg.work.cursorCup;
    return `<div class="cursor" data-kind="bean" aria-hidden="true">
      <span class="cursor__icon cursor__icon--bean">${Cafe.icons.bean}</span>
      <span class="cursor__icon cursor__icon--espresso"><span class="c-cup">
        ${Cafe.steamSVG()}
        ${cup ? `<img class="c-cup__body" src="${esc(cup)}" alt="" decoding="async">` : ""}
      </span></span>
      <span class="cursor__dot"></span></div>`;
  },

  init(root) {
    const el = root.querySelector(".cursor");
    const cupEl = el.querySelector(".c-cup");
    const steam = el.querySelector(".c-steam");
    const html = document.documentElement;
    let enabled = false;
    let kind = "bean";

    const enable = (on) => {
      enabled = on;
      html.classList.toggle("has-cursor", on);
      if (!on) el.classList.remove("is-visible");
    };

    // Carried-cup motion: the cup lags slightly behind the pointer and tilts with speed.
    let px = 0, py = 0, cx = 0, cy = 0, tilt = 0, raf = 0;
    const carry = () => {
      const k = 0.22;
      const dx = px - cx;
      cx += dx * k; cy += (py - cy) * k;
      tilt += (Cafe.clamp(-dx * 0.9, -16, 16) - tilt) * 0.18;
      cupEl.style.transform = `translate(${(cx - px).toFixed(2)}px, ${(cy - py).toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
      const moving = Math.abs(px - cx) + Math.abs(py - cy) + Math.abs(tilt) > 0.05;
      raf = kind === "espresso" && moving ? requestAnimationFrame(carry) : 0;
    };
    const syncMotion = () => {
      // live steam pauses outside project cards and for reduced motion
      if (!steam.pauseAnimations) return;
      if (kind === "espresso" && !Cafe.reducedMotion()) steam.unpauseAnimations(); else steam.pauseAnimations();
    };
    syncMotion();

    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !Cafe.finePointer()) { if (enabled) enable(false); return; }
      if (!enabled) enable(true);
      px = e.clientX; py = e.clientY;
      el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      el.classList.add("is-visible");
      const host = e.target.closest ? e.target.closest("[data-cursor]") : null;
      const next = host ? host.dataset.cursor : "bean";
      if (next !== kind) {
        kind = next; el.dataset.kind = kind;
        if (kind === "espresso") { cx = px; cy = py; tilt = 0; }
        syncMotion();
      }
      if (kind === "espresso" && !Cafe.reducedMotion() && !raf) raf = requestAnimationFrame(carry);
      el.classList.toggle("is-link", !!(e.target.closest && e.target.closest("a, button")));
    }, { passive: true });
    document.addEventListener("pointerdown", () => el.classList.add("is-pressing"));
    document.addEventListener("pointerup", () => el.classList.remove("is-pressing"));
    document.documentElement.addEventListener("mouseleave", () => el.classList.remove("is-visible"));
    Cafe.mqFine.addEventListener("change", (e) => { if (!e.matches) enable(false); });
    Cafe.mqReduce.addEventListener("change", syncMotion);
  },
});
