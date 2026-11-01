/* Closing time: laptop shut, lamp off; the persistent cup lands in .cup-slot on the table. */
Cafe.register("closing", {
  render(cfg) {
    const { esc, mailto } = Cafe;
    const c = cfg.closing;
    return `
      <div class="container">
        <div class="closing__scene reveal">
          <img src="${esc(c.image)}" alt="${esc(c.imageAlt)}" width="600" height="520" loading="lazy" decoding="async">
          <span class="hand closing__zzz" aria-hidden="true">see you soon</span>
          <span class="cup-slot" aria-hidden="true">${Cafe.cupSVG("slot-cup-clip", false)}</span>
        </div>
        <h2 class="closing__title reveal" id="hello-title">${esc(c.heading)}</h2>
        <p class="closing__line reveal" style="--d:.08s">${esc(c.line)}</p>
        <a class="btn reveal" style="--d:.16s" href="${esc(mailto())}">${esc(c.cta)}<span class="sr-only"> (opens your email app)</span></a>
      </div>`;
  },
  init(root) {
    // the docked cup is always empty
    const liquid = root.querySelector(".cup-slot .liquid");
    if (liquid) liquid.style.transform = "translateY(32px)";
  },
});
