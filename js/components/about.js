/* About: the "Meet the Traveller" card from Darrpana's Framer site —
   purple card, heading top-left, her illustration left, intro text + "Take a detour" link right. */
Cafe.register("about", {
  render(cfg) {
    const { esc } = Cafe;
    const a = cfg.about;
    const bold = (t) => esc(t).replace(/\[\[(.+?)\]\]/g, "<strong>$1</strong>");
    return `
      <div class="container">
        <div class="traveller reveal">
          <h2 class="traveller__title" id="about-title">${esc(a.heading)}</h2>
          <div class="traveller__grid">
            <img class="traveller__img" src="${esc(a.portrait)}" alt="${esc(a.portraitAlt)}" width="900" height="844" loading="lazy" decoding="async">
            <div class="traveller__text">
              ${a.paragraphs.map((p) => `<p>${bold(p)}</p>`).join("")}
              <a class="traveller__cta" href="${esc(a.cta.href)}">${esc(a.cta.label)}<img src="${esc(a.cta.icon)}" alt="" width="27" height="30"></a>
            </div>
          </div>
        </div>
      </div>`;
  },
});
