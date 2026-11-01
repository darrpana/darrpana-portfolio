/* Work as a stack of cards (index.html #work), content in config.work.stack.
   Each card sits in its own sticky slot. As you scroll, the next card flies in from
   alternating sides (left, right, left…), tilted in 3D, and straightens as it lands on top
   of the stack; the cards underneath sink back a little (up, away, slightly smaller) for each
   card that lands on them. Plain scrolling, no hijacking. Each card links to its project.
   Reduced motion: no fly-in or sinking, the cards simply stack. */
Cafe.register("workStack", {
  render(cfg) {
    const { esc } = Cafe;
    const w = cfg.work, st = w.stack;
    const pad = (n) => String(n).padStart(2, "0");
    const cards = st.cards.map((c, i) => {
      const p = w.projects[c.project] || {};
      const dark = /^#(?:1|2|3)/.test(c.color);
      return `
        <div class="ws-slot" data-i="${i}">
          <article class="ws-card${dark ? " ws-card--dark" : ""}" style="--c:${esc(c.color)}">
            <p class="ws-card__meta" aria-hidden="true"><span>(${pad(i + 1)})</span><span>${esc(c.label)}</span></p>
            <div class="ws-card__body">
              <h3 class="ws-card__h">${esc(c.title)}</h3>
              <p class="ws-card__p">${esc(c.line)}</p>
            </div>
            <div class="ws-card__media">${p.image ? `<img src="${esc(p.image)}" alt="" loading="${i < 2 ? "eager" : "lazy"}" decoding="async">` : ""}</div>
            <a class="ws-card__link" href="${esc(p.href || "#")}" data-cursor="espresso"><span class="sr-only">${esc(c.label)}: ${esc(c.title)}</span></a>
          </article>
        </div>`;
    }).join("");
    return `
      <div class="ws-shell">
        <h2 class="ws-kicker" id="work-title">${esc(st.kicker)}</h2>
        <div class="ws-stack">${cards}</div>
      </div>`;
  },

  init(root) {
    const { clamp } = Cafe;
    const slots = Array.from(root.querySelectorAll(".ws-slot"));
    const cards = slots.map((s) => s.firstElementChild);
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let stickTop = 0;
    const measure = () => { stickTop = parseFloat(getComputedStyle(slots[0]).top) || 0; };
    measure();
    Cafe.onLayout(measure);

    Cafe.onFrame(() => {
      if (Cafe.reducedMotion()) { cards.forEach((c) => { c.style.transform = ""; }); return; }
      const vh = window.innerHeight, vw = window.innerWidth;
      const side = vw > 900;                               // phones: cards rise straight up
      // how far each card has landed: 0 = just below the screen, 1 = pinned on the stack
      const land = slots.map((s) => {
        const top = s.getBoundingClientRect().top;
        return clamp((vh - top) / Math.max(1, vh - stickTop));
      });
      cards.forEach((c, i) => {
        const a = 1 - ease(land[i]);                         // what's left of the entry
        const dir = i % 2 ? 1 : -1;                          // even cards from the left
        // sink back once newer cards land on top (counted fractionally)
        let d = 0;
        for (let j = i + 1; j < land.length; j++) d += land[j] >= 1 ? 1 : Math.max(0, (land[j] - 0.55) / 0.45);
        const tx = side ? dir * vw * 0.98 * a : 0;
        const ty = (side ? 62 : 90) * a - 15 * d;
        const tz = -27 * d;
        const ry = side ? -dir * 7 * a : 0, rz = side ? dir * 8.5 * a : 0;
        const s = 1 - 0.018 * d;
        c.style.transform = `perspective(1600px) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(4)})`;
        c.parentElement.style.zIndex = 10 + i;
      });
    });
  },
});
