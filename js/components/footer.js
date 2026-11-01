/* Footer: one line. On pages with <body data-treats>, the social links come first as
   Darrpana's treats: a croissant (LinkedIn), a cookie (Instagram) and a cupcake (Behance).
   Hover (or focus) takes a bite: the eaten version shows, with a crunch. Two looks to compare
   (config.footer.treats.styles): "tray" — one long tray, labels written on its lip — and
   "tissue" — each treat on a diamond tissue with its label written on the tissue. */
Cafe.register("footer", {
  render(cfg) {
    const { esc } = Cafe;
    const line = `<div class="container site-footer__inner"><p>${esc(cfg.footer.text)}</p></div>`;
    const tr = cfg.footer.treats;
    if (!tr || !document.body.hasAttribute("data-treats")) return line;
    const link = (it) => cfg.social.links.find((l) => l.name === it.social) || {};
    // the tissue: a square with a scalloped edge (arcs bulging outwards), drawn as an outline,
    // plus a dotted "lace" line inside; CSS turns it into a diamond
    const n = 9, r = 50 / n;
    const side = (dx, dy) => `a${r} ${r} 0 0 1 ${dx * 2 * r} ${dy * 2 * r}`.repeat(n);
    const tissue = `<svg class="treat__tissue" viewBox="-8 -8 116 116" aria-hidden="true">
        <path d="M0 0${side(1, 0)}${side(0, 1)}${side(-1, 0)}${side(0, -1)}Z"/>
        <rect x="9" y="9" width="82" height="82" class="treat__lace"/>
      </svg>`;
    const treat = (it, st) => `
      <a class="treat treat--${esc(it.treat)}" href="${esc(link(it).href || "#")}" target="_blank" rel="noopener noreferrer" aria-label="${esc(it.social)} (opens in a new tab)">
        ${st === "tissue" ? tissue : ""}<span class="treat__food">
          <img class="treat__fresh" src="${esc(it.fresh)}" alt="" decoding="async">
          <img class="treat__eaten" src="${esc(it.eaten)}" alt="" decoding="async">
        </span>
        <span class="treat__label" aria-hidden="true">${esc(it.label)}</span>
      </a>`;
    const tray = `<svg class="treats__tray" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
        <g fill="#0d0d16" stroke="#716df2" stroke-width="7" stroke-linejoin="round">
          <path d="M80 20H920L985 110H15Z"/>
          <path d="M15 110H985V140H15Z"/>
        </g>
        <g fill="none" stroke="#716df2" stroke-linecap="round" opacity=".55">
          <path d="M104 36H896L946 98H54Z" stroke-width="3"/>
          <path d="M60 125H940" stroke-width="3"/>
        </g>
      </svg>`;
    const blocks = tr.styles.map((st, k) => `
      <div class="treats treats--${esc(st)}">
        ${tr.styles.length > 1 ? `<p class="treats__option" aria-hidden="true">Option ${k + 1} · ${st === "tray" ? "tray" : "tissue"}</p>` : ""}
        <div class="treats__row">${st === "tray" ? tray : ""}${tr.items.map((it) => treat(it, st)).join("")}</div>
      </div>`).join("");
    return `<nav class="treats-wrap" aria-label="Social links">${blocks}</nav>${line}`;
  },
  init(root) {
    root.querySelectorAll(".treat").forEach((a) => {
      const bite = () => { a.classList.add("is-eaten"); if (Cafe.sound) Cafe.sound.play("crunch"); };
      a.addEventListener("pointerenter", bite);
      a.addEventListener("focus", bite);
      a.addEventListener("pointerleave", () => a.classList.remove("is-eaten"));
      a.addEventListener("blur", () => a.classList.remove("is-eaten"));
    });
  },
});
