/* Social links: three pinned notes on a noticeboard. */
Cafe.register("social", {
  render(cfg) {
    const { esc, icons } = Cafe;
    const s = cfg.social;
    const notes = s.links.map((l) => `
      <li>
        <a class="note note--${esc(l.accent)}" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer"
           aria-label="${esc(l.name)}: ${esc(l.handle)} (opens in a new tab)">
          <span class="note__icon">${icons[l.icon] || ""}</span>
          <span><span class="note__name">${esc(l.name)}</span><span class="note__handle">${esc(l.handle)}</span></span>
        </a>
      </li>`).join("");
    return `
      <div class="container social__inner">
        <div>
          <p class="eyebrow">Noticeboard</p>
          <h2 class="social__title" id="social-title">${esc(s.heading)}</h2>
        </div>
        <ul class="notes" aria-labelledby="social-title">${notes}</ul>
      </div>`;
  },
});
