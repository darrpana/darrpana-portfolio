/* Persistent coffee cup: drains as you move through the page, then travels
   from the corner into the closing illustration, completely empty. */
Cafe.cupSVG = (id, steam = true) => `
  <svg viewBox="0 0 64 64" overflow="visible" aria-hidden="true" focusable="false">
    <defs><clipPath id="${id}"><path d="M14.6 23.5H47.4L44.6 51.4Q43.8 55.6 39.6 55.6H22.4Q18.2 55.6 17.4 51.4Z"/></clipPath></defs>
    ${steam ? `<g class="steam" stroke="#151515" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".7">
      <path d="M24 17C20 11 28 8 24 1"/><path d="M32 17C28 11 36 8 32 1"/><path d="M40 17C36 11 44 8 40 1"/></g>` : ""}
    <g stroke="#6c6afb" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="#6c6afb">
      <path d="M48 28C60 28 60 45 46 45" fill="none"/>
      <path d="M12 21.5H50L47 52Q46 58 40 58H22Q16 58 15 52Z"/>
      <path d="M18 60.5H44"/>
    </g>
    <path d="M48 28C60 28 60 45 46 45" stroke="#151515" stroke-width="5" fill="none"/>
    <path d="M48 28C60 28 60 45 46 45" stroke="#6c6afb" stroke-width="1.6" fill="none"/>
    <path d="M12 21.5H50L47 52Q46 58 40 58H22Q16 58 15 52Z" fill="#fbf8f2"/>
    <g clip-path="url(#${id})">
      <g class="liquid">
        <rect x="10" y="23.5" width="44" height="34" fill="#151515"/>
        <path d="M18 27Q31 30 44 27" stroke="#6c6afb" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M12 21.5H50L47 52Q46 58 40 58H22Q16 58 15 52Z" stroke="#151515" stroke-width="3" fill="none" stroke-linejoin="round"/>
    <path d="M18 60.5H44" stroke="#151515" stroke-width="3" stroke-linecap="round"/>
  </svg>`;

Cafe.register("persistentCup", {
  render() {
    return `<div class="float-cup is-hot" aria-hidden="true">${Cafe.cupSVG("float-cup-clip")}</div>`;
  },

  init(root, cfg) {
    const { clamp, lerp, onFrame, onLayout } = Cafe;
    const cup = root.querySelector(".float-cup");
    const liquid = cup.querySelector(".liquid");
    const slot = document.querySelector(".cup-slot");
    const DEPTH = 32; // px of liquid travel inside the 64-unit cup

    let anchors = [];
    let home = null;
    const measure = () => {
      anchors = cfg.cupLevels.map((a) => {
        const el = document.getElementById(a.section);
        return el ? { y: el.getBoundingClientRect().top + window.scrollY, level: a.level } : null;
      }).filter(Boolean).sort((a, b) => a.y - b.y);
      const cs = getComputedStyle(cup);
      const w = parseFloat(cs.width);
      home = {
        x: document.documentElement.clientWidth - parseFloat(cs.right) - w,
        y: window.innerHeight - parseFloat(cs.bottom) - parseFloat(cs.height),
        w,
      };
    };
    measure();
    onLayout(measure);

    const levelAt = (pos) => {
      if (!anchors.length) return 1;
      if (pos <= anchors[0].y) return anchors[0].level;
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i], b = anchors[i + 1];
        if (pos < b.y) return lerp(a.level, b.level, clamp((pos - a.y) / (b.y - a.y)));
      }
      return anchors[anchors.length - 1].level;
    };
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    let lastKey = "";
    onFrame(() => {
      const vh = window.innerHeight;
      let level = levelAt(window.scrollY + vh * 0.5);
      let p = 0;
      if (slot) {
        const r = slot.getBoundingClientRect();
        p = clamp((vh - (r.top + r.height / 2)) / (vh * 0.4));
        const e = ease(p);
        level *= 1 - p;
        if (p > 0 && p < 1) {
          const s = lerp(1, r.width / home.w, e);
          const dx = lerp(0, r.left - home.x, e);
          const dy = lerp(0, r.top - home.y, e) - Math.sin(Math.PI * e) * 40;
          cup.style.transform = `translate(${dx}px, ${dy}px) scale(${s}) rotate(${Math.sin(Math.PI * e) * -14}deg)`;
        } else if (p === 0) {
          cup.style.transform = "";
        }
        cup.classList.toggle("is-docked", p >= 1);
        slot.classList.toggle("is-filled", p >= 1);
      }
      const key = level.toFixed(3);
      if (key !== lastKey) {
        lastKey = key;
        liquid.style.transform = `translateY(${((1 - level) * DEPTH).toFixed(2)}px)`;
        cup.classList.toggle("is-hot", level > 0.8);
      }
    });
  },
});
