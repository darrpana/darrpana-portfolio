/* About: portrait + personal intro + CTA. */
Cafe.register("about", {
  render(cfg) {
    const { esc, icons } = Cafe;
    const a = cfg.about;
    return `
      <span class="doodle doodle--star" aria-hidden="true">${icons.star}</span>
      <span class="doodle doodle--squiggle" aria-hidden="true">${icons.squiggle}</span>
      <div class="container about__grid">
        <figure class="about__figure reveal">
          <img src="${esc(a.portrait)}" alt="${esc(a.portraitAlt)}" width="400" height="480" loading="lazy" decoding="async">
          <figcaption class="about__note" aria-hidden="true">
            <span class="hand">${esc(a.annotation)}</span>
            ${icons.arrowCurveLeft}
          </figcaption>
        </figure>
        <div class="about__text">
          <p class="eyebrow reveal">Sit down</p>
          <h2 class="about__title reveal" style="--d:.06s" id="about-title">${esc(a.heading).replace("Meet me.", "<em>Meet me.</em>")}</h2>
          <div class="about__body reveal" style="--d:.14s">${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <a class="btn reveal" style="--d:.22s" href="${esc(a.cta.href)}">${esc(a.cta.label)}</a>
        </div>
      </div>`;
  },
});
