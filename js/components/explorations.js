/* Explorations: three café corners, each a different way to browse (no carousels).
   1. Illustrations → "Latte art": cups seen from above on a table; each illustration is the
      latte art in a cup. Hover turns the cup on its saucer; click opens it in the gallery.
   2. Branding → "The packaging shelf": each project is a coffee bag on a shelf, its cover as
      the label. Hover pulls the bag forward; click opens the project.
   3. AI pet projects → "The capsule rack": coffee capsules in a rack under a little machine
      screen. Hover/focus pops a capsule up and shows its project on the screen; click opens it.
   Each corner has a "see all" link to its full page (illustrations.html, branding.html, ai.html).
   Content: config.explorations (illustrations / branding / ai) and config.gallery. */
Cafe.register("explorations", {
  render(cfg) {
    const { esc } = Cafe;
    const e = cfg.explorations;
    const ill = e.illustrations, br = e.branding, ai = e.ai;

    const bar = (id, kicker, title, count, desc, href, label) => `
      <div class="xp-bar">
        <div>
          <p class="xp-bar__kicker">${esc(kicker)}</p>
          <h3 class="xp-bar__title" id="${id}">${esc(title)}<span>${count}</span></h3>
          <p class="xp-bar__desc">${esc(desc)}</p>
        </div>
        <a class="link-cta" href="${esc(href)}">${esc(label)}<span class="arrow" aria-hidden="true">→</span></a>
      </div>`;

    // 1. latte art: six cups from above, the illustration as the latte art
    const cups = cfg.gallery.slice(0, 6).map((g, i) => `
      <li class="xp-cup reveal" style="--d:${(i * 0.07).toFixed(2)}s;--y:${[0, 26, -8, 30, 4, 22][i]}px;--r:${[-18, 24, -6, 30, -26, 12][i]}deg">
        <a href="${esc(ill.href)}?open=${i + 1}" aria-label="Open ${esc(g.title)}">
          <span class="xp-cup__saucer" aria-hidden="true"></span>
          <span class="xp-cup__handle" aria-hidden="true"></span>
          <span class="xp-cup__rim"><img src="${esc(g.src)}" alt="" loading="lazy" decoding="async"></span>
          <span class="xp-cup__steam" aria-hidden="true"></span>
        </a>
      </li>`).join("");
    const more = cfg.gallery.length - 6;

    // 2. packaging shelf: a coffee bag per branding project
    const bags = br.projects.map((b, i) => `
      <li class="xp-bag reveal" style="--d:${(i * 0.06).toFixed(2)}s;--t:${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">
        <a href="/branding/${encodeURIComponent(b.slug)}">
          <span class="xp-bag__crimp" aria-hidden="true"></span>
          <span class="xp-bag__body">
            <span class="xp-bag__label"><img src="${esc(b.cover)}" alt="" loading="lazy" decoding="async"></span>
            <span class="xp-bag__name">${esc(b.title)}</span>
            <span class="xp-bag__tag">${esc(b.tag)}</span>
          </span>
        </a>
      </li>`).join("");

    // 3. capsule rack: a capsule per AI project, a small screen shows the one you pick
    const capsules = ai.projects.map((p, i) => `
      <li class="xp-capsule${i ? "" : " is-on"}" style="--i:${i}">
        <a href="/ai/${encodeURIComponent(p.slug)}" data-i="${i}" aria-label="${esc(p.title)}">
          <span class="xp-capsule__lid" aria-hidden="true"></span>
          <span class="xp-capsule__body" aria-hidden="true"><b>${String(i + 1).padStart(2, "0")}</b></span>
        </a>
      </li>`).join("");
    const first = ai.projects[0];

    return `
      <div class="container explore__intro">
        ${Cafe.sticker(e.sticker, "explore")}
        <p class="eyebrow reveal">Explorations</p>
        <h2 class="section-title reveal" style="--d:.06s" id="explorations-title">${esc(e.heading)}</h2>
        <p class="lede reveal" style="--d:.12s">${esc(e.intro)}</p>

        <section class="xp-block" aria-labelledby="xp-ill">
          ${bar("xp-ill", ill.tableTitle, ill.title, `${cfg.gallery.length}`, ill.description, ill.href, "See all")}
          <div class="xp-table">
            <ul class="xp-cups">${cups}
              <li class="xp-cup xp-cup--more reveal" style="--d:.45s;--y:6px;--r:0deg">
                <a href="${esc(ill.href)}" aria-label="See all ${cfg.gallery.length} illustrations">
                  <span class="xp-cup__saucer" aria-hidden="true"></span>
                  <span class="xp-cup__rim"><span class="xp-cup__more"><strong>+${more}</strong>more</span></span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section class="xp-block" aria-labelledby="xp-brand">
          ${bar("xp-brand", br.shelfTitle, br.title, `${br.projects.length}`, br.description, br.href, "See all")}
          <div class="xp-shelf">
            <ul class="xp-bags">${bags}</ul>
            <span class="xp-shelf__board" aria-hidden="true"></span>
          </div>
        </section>

        <section class="xp-block" aria-labelledby="xp-ai">
          ${bar("xp-ai", ai.rackTitle, ai.title, `${ai.projects.length}`, ai.description, ai.href, "See all")}
          <div class="xp-machine">
            <a class="xp-screen" href="/ai/${encodeURIComponent(first.slug)}" aria-live="polite">
              <span class="xp-screen__img"><img src="${esc(first.cover)}" alt="" decoding="async"></span>
              <span class="xp-screen__text"><span class="xp-screen__tag">${esc(first.tag)}</span><span class="xp-screen__title">${esc(first.title)}</span><span class="xp-screen__go">Brew it <span aria-hidden="true">→</span></span></span>
            </a>
            <ul class="xp-rack">${capsules}</ul>
            <span class="xp-rack__bar" aria-hidden="true"></span>
          </div>
        </section>
      </div>`;
  },

  init(root, cfg) {
    const ai = cfg.explorations.ai.projects;
    const sound = (n) => Cafe.sound && Cafe.sound.play(n);
    const screen = root.querySelector(".xp-screen");
    const caps = Array.from(root.querySelectorAll(".xp-capsule"));
    let cur = 0;
    const pick = (i) => {
      if (i === cur) return;
      cur = i;
      const p = ai[i];
      caps.forEach((c, k) => c.classList.toggle("is-on", k === i));
      screen.classList.remove("is-new"); void screen.offsetWidth; screen.classList.add("is-new");
      screen.href = `/ai/${encodeURIComponent(p.slug)}`;
      screen.querySelector("img").src = p.cover;
      screen.querySelector(".xp-screen__tag").textContent = p.tag;
      screen.querySelector(".xp-screen__title").textContent = p.title;
      sound("pop");
    };
    caps.forEach((c, i) => {
      const a = c.querySelector("a");
      a.addEventListener("pointerenter", () => pick(i));
      a.addEventListener("focus", () => pick(i));
    });
    root.querySelectorAll(".xp-cup a").forEach((a) => a.addEventListener("pointerenter", () => sound("tap")));
    root.querySelectorAll(".xp-bag a").forEach((a) => a.addEventListener("pointerenter", () => sound("flip")));
  },
});
