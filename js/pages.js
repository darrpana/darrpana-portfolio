/* Subpage components: illustration gallery, branding detail, case-study detail.
   All content comes from js/config.js. */

/* ---------- Illustration gallery (illustrations.html) ---------- */
Cafe.register("galleryPage", {
  render(cfg) {
    const { esc } = Cafe;
    const ill = cfg.explorations.illustrations;
    const tiles = cfg.gallery.map((g, i) => `
      <li><button class="gallery__btn" type="button" data-index="${i}" aria-label="Open ${esc(g.title)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" width="800" height="800" ${i < 8 ? "" : 'loading="lazy"'} decoding="async">
      </button></li>`).join("");
    return `
      <div class="container">
        <a class="back" href="explorations.html"><span aria-hidden="true">←</span> Back to explorations</a>
        <h1 class="page__title">${esc(ill.title)}</h1>
        <p class="page__intro">${esc(ill.description)}</p>
        <ul class="gallery">${tiles}</ul>
      </div>
      <dialog class="lightbox" aria-label="Illustration viewer">
        <figure class="lightbox__fig">
          <img src="" alt="" width="800" height="800">
          <figcaption class="lightbox__bar">
            <span class="lightbox__caption"><span data-title></span><span class="lightbox__count" data-count></span></span>
            <span class="lightbox__ctrl">
              <button class="icon-btn" type="button" data-prev aria-label="Previous illustration">←</button>
              <button class="icon-btn" type="button" data-next aria-label="Next illustration">→</button>
              <button class="icon-btn" type="button" data-close aria-label="Close viewer">✕</button>
            </span>
          </figcaption>
        </figure>
      </dialog>`;
  },

  init(root, cfg) {
    const items = cfg.gallery;
    const dialog = root.querySelector(".lightbox");
    const img = dialog.querySelector("img");
    const title = dialog.querySelector("[data-title]");
    const count = dialog.querySelector("[data-count]");
    let index = 0, opener = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const it = items[index];
      img.src = it.src;
      img.alt = it.alt;
      title.textContent = it.title;
      count.textContent = `${index + 1} / ${items.length}`;
    };
    const open = (i, from) => {
      opener = from || null;
      show(i);
      if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    };

    root.querySelector(".gallery").addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__btn");
      if (btn) open(Number(btn.dataset.index), btn);
    });
    dialog.querySelector("[data-prev]").addEventListener("click", () => show(index - 1));
    dialog.querySelector("[data-next]").addEventListener("click", () => show(index + 1));
    dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); }); // backdrop
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    dialog.addEventListener("close", () => { if (opener) opener.focus(); });

    // index.html preview tiles link here with ?open=N
    const req = Number(Cafe.query("open"));
    if (req >= 1 && req <= items.length) {
      open(req - 1, root.querySelector(`.gallery__btn[data-index="${req - 1}"]`));
    }
  },
});

/* ---------- Collection pages: branding.html and ai.html ----------
   Without ?p= → every project in the group as a grid of cards; with ?p=slug → that project.
   Groups live in config.explorations (branding, ai). */
const collectionPage = (key, file) => ({
  render(cfg) {
    const { esc } = Cafe;
    const g = cfg.explorations[key];
    const list = g.projects;
    const i = list.findIndex((b) => b.slug === Cafe.query("p"));
    const back = `<a class="back" href="explorations.html"><span aria-hidden="true">←</span> Back to explorations</a>`;
    if (i < 0) {
      document.title = `${g.title} — Darrpana`;
      return `<div class="container">${back}
        <h1 class="page__title">${esc(g.title)}</h1>
        <p class="page__intro">${esc(g.description)}</p>
        <ul class="coll-grid">${list.map((b) => `
          <li><a class="brand-card" href="${file}?p=${encodeURIComponent(b.slug)}">
            <div class="brand-card__media"><img src="${esc(b.cover)}" alt="" loading="lazy" decoding="async"></div>
            <span class="brand-card__tag">${esc(b.tag)}</span>
            <h2 class="brand-card__title">${esc(b.title)}</h2>
            <span class="brand-card__go">View project <span aria-hidden="true">→</span></span>
          </a></li>`).join("")}</ul></div>`;
    }
    const b = list[i];
    const next = list[(i + 1) % list.length];
    document.title = `${b.title} — Darrpana`;
    return `
      <article class="container">
        <a class="back" href="${file}"><span aria-hidden="true">←</span> All ${esc(g.title.toLowerCase())}</a>
        <p class="eyebrow">${esc(b.tag)}</p>
        <h1 class="page__title">${esc(b.title)}</h1>
        <p class="page__intro">${esc(b.summary)}</p>
        <figure class="page__hero-img"><img src="${esc(b.cover)}" alt="${esc(b.title)} cover (placeholder)"></figure>
        <div class="page__gallery">
          ${b.images.map((src, k) => `<img src="${esc(src)}" alt="${esc(b.title)} image ${k + 1} (placeholder)" loading="lazy" decoding="async">`).join("")}
        </div>
        <nav class="page__next" aria-label="More projects">
          <a class="link-cta" href="${file}">All ${esc(g.title.toLowerCase())}</a>
          <a class="link-cta" href="${file}?p=${encodeURIComponent(next.slug)}">Next: ${esc(next.title)}<span class="arrow" aria-hidden="true">→</span></a>
        </nav>
      </article>`;
  },
});
Cafe.register("brandingPage", collectionPage("branding", "branding.html"));
Cafe.register("aiPage", collectionPage("ai", "ai.html"));

/* ---------- Case study (case-study.html?p=project-01) ---------- */
Cafe.register("caseStudyPage", {
  render(cfg) {
    const { esc } = Cafe;
    const list = cfg.work.projects;
    const i = list.findIndex((p) => p.href.endsWith(`p=${Cafe.query("p")}`));
    const back = `<a class="back" href="index.html#work"><span aria-hidden="true">←</span> Back to the menu</a>`;
    if (i < 0) {
      document.title = "Case studies — Darrpana";
      return `<div class="container">${back}<h1 class="page__title">Case studies</h1>
        <ul class="page__meta">${list.map((p) => `<li><a class="link-cta" href="${esc(p.href)}">${esc(p.number)}. ${esc(p.title)}</a></li>`).join("")}</ul></div>`;
    }
    const p = list[i];
    const next = list[(i + 1) % list.length];
    document.title = `${p.title} — Darrpana`;
    if (p.caseStudy) return this.full(cfg, p, next);
    return `
      <article class="container">
        ${back}
        <p class="eyebrow">Case study No. ${esc(p.number)}</p>
        <h1 class="page__title">${esc(p.title)}</h1>
        <p class="page__intro">${esc(p.description)}</p>
        <ul class="tags page__meta">${p.disciplines.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        <figure class="page__hero-img"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="1200" height="800"></figure>
        <p class="placeholder-note">The full case study is being plated. This page is a placeholder — add the write-up here.</p>
        <nav class="page__next" aria-label="More projects">
          <a class="link-cta" href="index.html#work">All projects</a>
          <a class="link-cta" href="${esc(next.href)}">Next: ${esc(next.title)}<span class="arrow" aria-hidden="true">→</span></a>
        </nav>
      </article>`;
  },

  // Full case study, same layout as darrpana.com/convora:
  // dark intro (title + hero shot) → white body (meta | overview + task, introduction,
  // slides edge to edge) → project nav band → sign-off footer.
  full(cfg, p, next) {
    const { esc, mailto } = Cafe;
    const c = p.caseStudy;
    const end = cfg.caseStudyEnd;
    document.body.classList.add("has-case-study");
    const img = (im, i) => {
      const style = im.radius ? ` style="border-radius:${esc(im.radius)}"` : "";
      const tag = `<img src="${esc(im.src)}" alt="${esc(im.alt || `${p.title} case study, part ${i + 1}`)}"${style} loading="lazy" decoding="async">`;
      return im.panel ? `<div class="cs__panel">${tag}</div>` : tag;
    };
    // LinkedIn, then Instagram (as on darrpana.com)
    const social = ["linkedin", "instagram"].map((n) => cfg.social.links.find((l) => l.name.toLowerCase() === n)).filter(Boolean);
    return `
      <article class="cs">
        <header class="cs__intro">
          <div class="cs__wrap">
            <h1 class="cs__title">${esc(c.title)}</h1>
            <img class="cs__hero" src="${esc(c.hero.src)}" alt="${esc(c.hero.alt)}" fetchpriority="high">
          </div>
        </header>
        <div class="cs__body">
          <div class="cs__wrap">
            <div class="cs__about">
              <dl class="cs__meta">${c.meta.map((m) => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join("")}</dl>
              <div class="cs__overview">
                <h2 class="cs__h">${esc(c.overview.heading)}</h2>
                <p class="cs__p">${esc(c.overview.text)}</p>
                <p class="cs__label">Task</p>
                <p class="cs__p cs__p--strong">${esc(c.task)}</p>
              </div>
            </div>
            <section class="cs__introduction">
              <h2 class="cs__h">${esc(c.intro.heading)}</h2>
              <p class="cs__p">${esc(c.intro.text)}</p>
            </section>
            <div class="cs__slides">${c.images.map(img).join("")}</div>
          </div>
        </div>
        <nav class="cs__nav" aria-label="More projects">
          <div class="cs__wrap">
            <a class="cs__navlink" href="index.html#work">
              <span class="cs__navlabel"><img class="cs__arrow cs__arrow--back" src="${esc(end.arrow)}" alt="">${esc(end.allProjects.label)}</span>
              <img class="cs__navart" src="${esc(end.allProjects.image)}" alt="">
            </a>
            <a class="cs__navlink cs__navlink--next" href="${esc(next.href)}">
              <span class="cs__navlabel">${esc(end.next.label)}<img class="cs__arrow" src="${esc(end.arrow)}" alt=""><span class="sr-only">: ${esc(next.title)}</span></span>
              <img class="cs__navart" src="${esc(end.next.image)}" alt="">
            </a>
          </div>
        </nav>
        <footer class="cs__footer">
          <div class="cs__wrap">
            <a class="cs__ahoy" href="${esc(mailto())}">${esc(end.greeting)}</a>
            <div class="cs__links">
              ${social.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.name)}</a>`).join("")}
              <a class="cs__mail" href="${esc(mailto())}">${esc(cfg.site.email)}</a>
            </div>
            <p class="cs__copy">${esc(end.copyright)}</p>
          </div>
        </footer>
      </article>`;
  },
});
