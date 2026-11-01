/* About page (about.html). Four sections, all from config.aboutPage:
   1. Story (like atulkhola.com) — the page's opening. Pinned while you scroll: Darrpana's
      coffee illustration (a French press pouring into the front cup of a huddle of five;
      scrolling drains the pour, the cups clink then float off like steam, the press stands up), a coffee greeting, then the About text one section at a time in the centre. Each section brings
      its own square photo stickers to the sides; the previous section's photos leave.
      Hover a photo and it talks (a short speech bubble).
   2. Brands: logos on black, trimmed to the same size, lit by a pointer spotlight. The page
      fades from white to black as this section comes in, and stays black from here on.
   3. Espresso & Epilogues: one pile of 7 books (black, thick purple outline, white pages), drawn like a hand-illustrated stack (spine,
      cover on top, pages at one end) at different angles, with twinkling sparkles. Hover a
      book for its title and author; click to slide it out.
   4. Travel: on handmade paper, pinned; one portrait perforated stamp whose photo flips as
      you scroll, with small handwriting either side.
   Sounds (Cafe.sound, if on): a pop as photos land, a chirp when a photo talks, a knock when
   you hover a book, a page flip when you pull one out, a shutter on travel photos. */
Cafe.register("aboutPage", {
  // story photo slots, as centres in % of the pinned stage: desktop (x, y), phone (mx, my).
  // A section with 2 photos uses the first two slots, with 3 the first three.
  SIDE: [
    { x: 14, y: 30, mx: 24, my: 13, r: -5 },
    { x: 86, y: 66, mx: 76, my: 87, r: 5 },
    { x: 85, y: 22, mx: 76, my: 13, r: 4 },
    { x: 15, y: 74, mx: 24, my: 87, r: -4 },
  ],

  render(cfg) {
    const { esc } = Cafe;
    const a = cfg.aboutPage;

    // 1. story
    const steps = a.story.steps;
    // every word is its own span, so words can light up one by one as you scroll
    const words = (txt) => esc(txt).split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? (w.includes("\n") ? "<br>" : " ") : w ? `<span class="w">${w}</span>` : "")).join("");
    const wordHTML = (txt) => txt.split(/(\[\[.+?\]\])/).map((seg) => {
      const m = seg.match(/^\[\[(.+)\]\]$/);
      return m ? `<mark class="ab-mark">${words(m[1])}</mark>` : words(seg);
    }).join("");
    const paras = steps.map((st, i) => `<p class="ab-story__p${st.greeting ? " ab-story__p--greet" : ""}" data-i="${i}">${wordHTML(st.text)}</p>`).join("");
    // the brewing illustration above the greeting (pieces placed in % of its canvas)
    const brew = a.story.brew;
    const brewHTML = brew ? `<div class="ab-brew" aria-hidden="true" style="--cw:${brew.canvas[0]};--ch:${brew.canvas[1]}">${
      Object.entries(brew.pieces).map(([k, pc]) => {
        const [x, y, w, h] = pc.box, [W, H] = brew.canvas;
        return `<img class="ab-brew__${esc(k)}" src="${esc(pc.src)}" alt="" decoding="async" data-fly="${esc((pc.fly || [0, 0, 0]).join(","))}" data-delay="${pc.delay || 0}"
          style="left:${(x / W * 100).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%;width:${(w / W * 100).toFixed(2)}%;height:${(h / H * 100).toFixed(2)}%">`;
      }).join("")}</div>` : "";
    const sideItems = steps.flatMap((st, i) => st.items.map((it, k) => {
      const pos = this.SIDE[k % this.SIDE.length];
      return `<figure class="ab-side${pos.my < 50 ? " ab-side--top" : ""}" data-step="${i}" style="--x:${pos.x}%;--y:${pos.y}%;--mx:${pos.mx}%;--my:${pos.my}%;--r:${pos.r}deg;--d:${k * 0.08}s">
        <img src="${esc(it.src)}" alt="${esc(it.alt || "")}" loading="lazy" decoding="async">
        ${it.say ? `<figcaption class="ab-say">${esc(it.say)}</figcaption>` : ""}</figure>`;
    })).join("");

    // between story and brands: rows of giant words sliding sideways
    const lv = a.loves;
    const bean = `<svg class="ab-loves__bean" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(30 12 12)"/><path d="M9 5.5c3 2.6.6 6.6 3.4 9.2 1.2 1.1 1.6 2.2 1.4 3.4"/></svg>`;
    const lovesHTML = lv ? `
      <section class="ab-loves" aria-label="${esc(lv.label)}">
        <p class="ab-loves__label">${esc(lv.label)}</p>
        ${lv.rows.map((row, k) => {
          const once = row.map((w, j) => `<span class="ab-loves__w${(j + k) % 2 ? " is-solid" : ""}">${esc(w)}</span>${bean}`).join("");
          return `<div class="ab-loves__row" data-dir="${k % 2 ? 1 : -1}"><div class="ab-loves__run">${once}${once}${once}${once}</div></div>`;
        }).join("")}
        <ul class="sr-only">${lv.rows.flat().map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      </section>` : "";

    // 2. brands: logos orbit a counter on two rings (outer and inner) while the section is pinned
    const L = a.brands.logos, nOuter = Math.ceil(L.length * 0.58);
    const orb = (l, k, n, ring) => `
      <li class="ab-logo ab-orb" style="--a:${(360 / n * k).toFixed(2)}deg;--d:${(k * 0.05).toFixed(2)}s" data-ring="${ring}"><img src="${esc(l.src)}" alt="${esc(l.name)}" crossorigin="anonymous" decoding="async"></li>`;
    const outer = L.slice(0, nOuter).map((l, k) => orb(l, k, nOuter, "outer")).join("");
    const inner = L.slice(nOuter).map((l, k) => orb(l, k, L.length - nOuter, "inner")).join("");
    const bigN = (a.brands.heading.match(/\d+/) || ["90"])[0];

    // 3. books: one pile, drawn like a hand-illustrated stack. Each book is a small 3D box in
    // SVG: the spine faces you (title + decorative bands), the cover shows on top, and the
    // page block shows at one end. Books sit at different angles and lean different ways.
    // Sizes/angles are deterministic, so the pile looks hand-stacked but stays put.
    const b = a.books;
    const items = b.items.slice(0, b.show || 7);
    // the longest title makes the longest book: it goes at the bottom, as the pile's base
    const base = items.reduce((m, it, k) => (it.title.length > items[m].title.length ? k : m), 0);
    items.push(items.splice(base, 1)[0]);
    const hex = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
    const mix = (c, t, k) => `rgb(${hex(c).map((v, j) => Math.round(v + ((t ? 255 : 0) - v) * k)).join(",")})`;
    const TILT = [-2.5, 3, -1, 2, -3.5, 1.5, -2, 3.5, -.5, 2.5];
    const OFF = [10, -26, 18, -8, 30, -20, 4, -30, 14, -6];
    const DIR = [1, -1, -1, 1, -1, 1, 1, -1, 1, -1];        // which way the cover/pages face
    const book = (it, i) => {
      const c = b.color || "#716df2";            // every book the same purple
      const w = Math.round(Math.min(640, Math.max(280 + ((i * 41) % 90), it.title.length * 9.6 + 130)));
      const h = 48 + ((i * 7) % 18);           // spine thickness 48–65
      const dy = 14 + ((i * 5) % 9);           // how much cover shows on top
      const dir = DIR[i % DIR.length], dx = dir * dy * 1.3;
      const pad = 6, W = w + Math.abs(dx) + pad * 2, H = h + dy + pad * 2;
      const x0 = pad + (dir < 0 ? -dx : 0), T = pad + dy;  // spine's top-left corner
      const xe = dir > 0 ? x0 + w : x0;                    // the end that shows its pages
      const ink = "#0d0d16"; // black book, thick purple outline (like the coffee illustration)
      const lines = Array.from({ length: Math.floor((h - 16) / 5) }, (_, k) => {
        const y = T + 10 + k * 5;
        return `<path d="M${xe + dir * 5} ${y} L${xe + dx - dir * 6} ${y - dy + 3}"/>`;
      }).join("");
      const svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
        <g stroke="${c}" stroke-width="5" stroke-linejoin="round">
          <path d="M${x0} ${T}H${x0 + w}l${dx} ${-dy}H${x0 + dx}Z" fill="${ink}"/>
          <path d="M${xe} ${T}l${dx} ${-dy}v${h}l${-dx} ${dy}Z" fill="${ink}"/>
          <path d="M${xe + dir * 3} ${T + 5}l${dx - dir * 7} ${-dy + 3}v${h - 10}l${-dx + dir * 7} ${dy - 3}Z" fill="#fff" stroke-width="2"/>
        </g>
        <g stroke="rgba(21,21,21,.35)" stroke-width="1">${lines}</g>
        <rect x="${x0}" y="${T}" width="${w}" height="${h}" fill="${ink}" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>
        <g fill="none" stroke="${c}" stroke-width="2.5">
          <path d="M${x0 + 14} ${T + 6}v${h - 12}M${x0 + 21} ${T + 6}v${h - 12}M${x0 + w - 14} ${T + 6}v${h - 12}M${x0 + w - 21} ${T + 6}v${h - 12}"/>
          <path d="M${x0 + w * .3} ${T - dy * .5 + 1}h${w * .4}" transform="translate(${dx / 2} 0)"/>
        </g>
        <text x="${x0 + w / 2}" y="${T + h / 2}" fill="${c}" text-anchor="middle" dominant-baseline="central">${esc(it.title.toUpperCase())}</text>
      </svg>`;
      return `<li style="--x:${OFF[i % OFF.length]}px;--r:${TILT[i % TILT.length]}deg;--dir:${dir};--lap:${dy + pad}px;--drop:${((items.length - 1 - i) * 0.13).toFixed(2)}s;z-index:${items.length - i}">
        <button type="button" class="ab-book" aria-pressed="false" aria-label="${esc(it.title)} by ${esc(it.author)}">
          ${svg}
          <span class="ab-book__label" aria-hidden="true"><b>${esc(it.title)}</b>${esc(it.author)}</span>
        </button></li>`;
    };
    const piles = `<ul class="ab-pile">${items.map(book).join("")}</ul>`;
    const spark = (x, y, s, d) => `<svg class="ab-spark" style="left:${x}%;top:${y}%;--s:${s}px;--d:${d}s" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10C9.2 14.4 6.4 11.4 0 10c6.4-1.4 9.2-4.4 10-10Z"/></svg>`;
    const sparks = [[22, 14, 22, 0], [18, 58, 14, .9], [64, 4, 18, .4], [80, 30, 14, 1.4], [76, 70, 24, .2], [26, 84, 12, 1.7]].map((v) => spark(...v)).join("");

    // 4. travel: one perforated stamp on handmade paper; scrolling swaps the photo inside,
    // with small handwriting either side
    const t = a.travel;
    const notes = (t.paper && t.paper.notes) || [];
    const paperImgs = t.photos.map((src, i) => `<img src="${esc(src)}" alt="" decoding="async"${i ? "" : ' class="is-on"'}>`).join("");
    const paperSection = t.paper ? `
      <section class="ab-paper" aria-labelledby="ab-paper-title">
        <div class="ab-paper__track" style="--n:${t.photos.length}">
          <div class="ab-paper__pin">
            <h2 class="ab-h ab-paper__h" id="ab-paper-title">${esc(t.heading)}</h2>
            <figure class="ab-paper__card">
              <div class="ab-paper__side ab-paper__side--l hand-note" aria-hidden="true">
                <p class="ab-paper__top">no. <span class="ab-paper__no">01</span> / ${String(t.photos.length).padStart(2, "0")}</p>
                <p>${esc(t.sub)}</p>
              </div>
              <div class="ab-paper__stampwrap">
                <div class="ab-paper__stamp">${paperImgs}</div>
<svg class="ab-paper__postmark" viewBox="0 0 220 120" aria-hidden="true">
                  <defs><path id="ab-pm-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>
                  <path class="ab-paper__waves" d="M108 44q10-6 20 0t20 0 20 0 20 0 20 0M108 60q10-6 20 0t20 0 20 0 20 0 20 0M108 76q10-6 20 0t20 0 20 0 20 0 20 0"/>
                  <g class="ab-paper__pmring">
                    <circle cx="60" cy="60" r="55"/><circle cx="60" cy="60" r="33"/>
                    <text><textPath href="#ab-pm-ring">${esc(t.heading.toUpperCase())} · ${esc(t.sub.toUpperCase())} · </textPath></text>
                  </g>
                </svg>
              </div>
              <figcaption class="ab-paper__side ab-paper__side--r hand-note" aria-hidden="true">
                <span class="ab-paper__note" data-notes="${esc(JSON.stringify(notes))}">${esc(notes[0] || "")}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>` : "";

    return `
      <section class="ab-story" aria-label="Hello">
        <div class="ab-story__track" style="--steps:${steps.length}">
          <div class="ab-story__pin">
            <div class="ab-story__side">${sideItems}</div>
            <div class="ab-story__col">${brewHTML}${paras}</div>
            <p class="ab-story__hint hand" aria-hidden="true">scroll ↓</p>
          </div>
        </div>
      </section>

      ${lovesHTML}

      <section class="ab-brands" aria-labelledby="ab-brands-title">
        <div class="ab-orbit">
          <div class="ab-orbit__pin">
            <div class="ab-orbit__rings">
              <span class="ab-orbit__ring ab-orbit__ring--outer" aria-hidden="true"></span>
              <span class="ab-orbit__ring ab-orbit__ring--inner" aria-hidden="true"></span>
              <ul class="ab-orbit__logos" style="--rot-o:0deg;--rot-i:0deg">${outer}${inner}</ul>
            </div>
            <div class="ab-orbit__core">
              <p class="eyebrow">${esc(a.brands.eyebrow)}</p>
              <p class="ab-orbit__num" aria-hidden="true"><span class="ab-orbit__n" data-to="${bigN}">${bigN}</span>+</p>
              <h2 class="ab-orbit__h" id="ab-brands-title">${esc(a.brands.heading)}</h2>
            </div>
          </div>
        </div>
      </section>

      <section class="ab-books" aria-labelledby="ab-books-title">
        <div class="container">
          <h2 class="ab-h" id="ab-books-title">${esc(b.heading)}</h2>
          <div class="ab-piles" role="group" aria-label="Books I love">${sparks}${piles}</div>
        </div>
      </section>

      ${paperSection}`;
  },

  init(root, cfg) {
    const { clamp } = Cafe;
    const sound = (n) => Cafe.sound && Cafe.sound.play(n);
    document.title = `About — ${cfg.site.name}`;

    /* ---- 1. story: the column moves up one paragraph per step; each step's photos come
       in as its paragraph takes the centre, and the previous step's photos leave ---- */
    const track = root.querySelector(".ab-story__track");
    const pin = root.querySelector(".ab-story__pin");
    const col = root.querySelector(".ab-story__col");
    const hint = root.querySelector(".ab-story__hint");
    const paras = Array.from(col.querySelectorAll(".ab-story__p"));
    const sides = Array.from(root.querySelectorAll(".ab-side"));
    const S = paras.length;
    let centres = [];
    const measure = () => { centres = paras.map((p) => p.offsetTop + p.offsetHeight / 2); };
    measure();
    Cafe.onLayout(measure);
    let lastStep = -1;
    // words light up one by one as you read down; a highlight sweeps in once its words are lit
    const pw = paras.map((p) => ({ words: Array.from(p.querySelectorAll(".w")), marks: Array.from(p.querySelectorAll(".ab-mark")), lit: -1 }));
    const lightTo = (k, n) => {
      const P = pw[k];
      if (P.lit === n) return;
      P.words.forEach((w, j) => w.classList.toggle("on", j < n));
      P.marks.forEach((m) => { const ws = m.querySelectorAll(".w"); m.classList.toggle("on", ws.length && ws[ws.length - 1].classList.contains("on")); });
      P.lit = n;
    };
    // brewing: 0 → 1 over the greeting's step (done before the text moves on)
    const brewEl = col.querySelector(".ab-brew");
    const bp = (n) => brewEl && brewEl.querySelector(`.ab-brew__${n}`);
    const bCups = brewEl ? Array.from(brewEl.querySelectorAll("[class^='ab-brew__cup-']:not(.ab-brew__cup-main)")) : [];
    const bStream = bp("stream"), bTilt = bp("press-tilt"), bUp = bp("press-up"), bCup = bp("cup-main");
    const mainCup = (cfg.aboutPage.story.brew || { pieces: {} }).pieces["cup-main"];
    const settle = mainCup ? (mainCup.settle || 0) / mainCup.box[2] * 100 : 0; // % of the cup's width
    const ease = (v) => v * v * (3 - 2 * v);
    let lastPa = 0;
    // tilted press → upright: move its centre onto the upright press's centre, turn 43° clockwise
    let pressMove = [0, 0, 1];
    const measureBrew = () => {
      if (!brewEl) return;
      const t = bTilt.getBoundingClientRect(), u = bUp.getBoundingClientRect();
      pressMove = [u.left + u.width / 2 - (t.left + t.width / 2), u.top + u.height / 2 - (t.top + t.height / 2), u.height / (t.height * 1.18)];
    };
    const brewAt = (pa) => {
      if (!brewEl) return;
      const drain = ease(clamp(pa / 0.5));                 // stream runs out, top first
      bStream.style.clipPath = `inset(${(drain * 100).toFixed(1)}% 0 0 0)`;
      bStream.classList.toggle("is-pouring", pa < 0.02);
      // cheers: the side cups lean in towards the front cup and clink…
      const lean = Math.sin(Math.PI * clamp(pa / 0.3));
      if (pa > 0.15 && lastPa <= 0.15) sound("clink");
      lastPa = pa;
      bCups.forEach((el) => {
        const [fx, fy, fr] = el.dataset.fly.split(",").map(Number);
        const side = fx < 0 ? 1 : -1;                         // lean towards the middle
        // …then float off one by one like steam: up and out, spinning, shrinking
        const f = ease(clamp((pa - 0.3 - +el.dataset.delay) / 0.4));
        el.style.transform = `translate(${(fx * f + side * 6 * lean).toFixed(1)}%, ${(fy * f - 6 * lean).toFixed(1)}%) rotate(${(side * 12 * lean + fr * f).toFixed(1)}deg) scale(${(1 - 0.45 * f).toFixed(3)})`;
        el.style.opacity = (1 - clamp((f - 0.45) / 0.55)).toFixed(3);
      });
      const up = ease(clamp((pa - 0.4) / 0.5));            // press straightens
      bTilt.style.transform = `translate(${(pressMove[0] * up).toFixed(1)}px, ${(pressMove[1] * up).toFixed(1)}px) rotate(${(43 * up).toFixed(2)}deg) scale(${(1 + (pressMove[2] - 1) * up).toFixed(3)})`;
      bCup.style.transform = `translateX(${(settle * up).toFixed(2)}%)`;   // the cup makes room
      const swap = clamp((up - 0.8) / 0.2);
      bTilt.style.opacity = (1 - swap).toFixed(3);
      bUp.style.opacity = swap.toFixed(3);
    };
    if (brewEl) { requestAnimationFrame(() => { measureBrew(); brewAt(0); }); Cafe.onLayout(() => { bTilt.style.transform = ""; measureBrew(); }); }
    Cafe.onFrame(() => {
      if (Cafe.reducedMotion()) {
        if (brewEl) { brewAt(0); bStream.classList.remove("is-pouring"); }
        col.style.transform = ""; paras.forEach((p, k) => { p.style.opacity = ""; lightTo(k, pw[k].words.length); });
        sides.forEach((el) => el.classList.add("is-in"));
        return;
      }
      const run = Math.max(1, track.offsetHeight - window.innerHeight);
      const s = clamp(-track.getBoundingClientRect().top / run) * (S - 0.001);
      const i = Math.floor(s), f = s - i;
      const g = clamp((f - 0.65) / 0.35);
      const glide = g * g * (3 - 2 * g);
      const c = centres[i] + ((centres[Math.min(S - 1, i + 1)] || centres[i]) - centres[i]) * glide;
      col.style.transform = `translateY(${(pin.clientHeight / 2 - c).toFixed(1)}px)`;
      paras.forEach((p, k) => {
        const o = k === i ? 1 - 0.75 * glide : k === i + 1 ? 0.25 + 0.75 * glide : k < i ? 0.25 : 0;
        p.style.opacity = o.toFixed(3);
      });
      hint.style.opacity = (1 - clamp(s * 4)).toFixed(3);
      paras.forEach((p, k) => {
        const N = pw[k].words.length;
        lightTo(k, k === 0 || k < i ? N : k === i ? Math.round(N * clamp(f / 0.6)) : 0);
      });
      if (brewEl) { brewAt(clamp(s / 0.62)); brewEl.style.opacity = paras[0].style.opacity; }
      const step = Math.min(S - 1, i + (glide > 0.5 ? 1 : 0)); // the paragraph in the centre
      if (step !== lastStep) {
        if (lastStep >= 0 && sides.some((el) => +el.dataset.step === step)) sound("pop");
        lastStep = step;
        sides.forEach((el) => el.classList.toggle("is-in", +el.dataset.step === step));
      }
    });
    sides.forEach((el) => el.addEventListener("pointerenter", () => { if (el.classList.contains("is-in")) sound("chirp"); }));

    /* ---- white → black: the page darkens as the brands section comes in ---- */
    const page = root;
    const brandsEl = root.querySelector(".ab-brands");
    const ink = [21, 21, 21];
    Cafe.onFrame(() => {
      const top = brandsEl.getBoundingClientRect().top / window.innerHeight; // 1 = just below the fold
      const t = clamp((0.72 - top) / 0.5);
      const e = t * t * (3 - 2 * t);
      const ch = ink.map((v) => Math.round(255 + (v - 255) * e));
      page.style.setProperty("--ab-bg", `rgb(${ch.join(",")})`);
      page.style.setProperty("--ab-dark", e.toFixed(3));
    });

    /* ---- the things-I-love band: rows slide sideways with the scroll (opposite directions)
       and lean into fast scrolling, easing back upright when you stop ---- */
    const loves = root.querySelector(".ab-loves");
    if (loves) {
      const rows = Array.from(loves.querySelectorAll(".ab-loves__row")).map((row) => ({ run: row.querySelector(".ab-loves__run"), dir: +row.dataset.dir }));
      let lastY = window.scrollY, skew = 0;
      Cafe.onFrame(() => {
        const r = loves.getBoundingClientRect();
        const y = window.scrollY, v = y - lastY; lastY = y;
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        skew += (clamp(v * 0.35, -10, 10) - skew) * 0.18;
        rows.forEach(({ run, dir }) => {
          const w = run.scrollWidth / 4 || 1;                          // one copy of the words
          const x = ((dir * (y * 0.45 + 2000)) % w + w) % w;           // wraps seamlessly
          run.style.transform = `translate3d(${(-x).toFixed(1)}px,0,0) skewX(${(-dir * skew).toFixed(2)}deg)`;
        });
        if (Math.abs(skew) > 0.05 && !Cafe.reducedMotion()) Cafe.requestFrame();  // ease back upright
      });
    }

    /* ---- 2. brands: pinned; the logos orbit the count on two rings turning opposite ways,
       the rings grow in as the section arrives, and the number counts up to 90 ---- */
    const orbit = root.querySelector(".ab-orbit");
    const orbitList = root.querySelector(".ab-orbit__logos");
    const orbitN = root.querySelector(".ab-orbit__n");
    const orbitTo = orbitN ? +orbitN.dataset.to : 0;
    Cafe.onFrame(() => {
      if (!orbit) return;
      const r = orbit.getBoundingClientRect();
      if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
      if (Cafe.reducedMotion()) { orbit.style.setProperty("--enter", 1); orbitN.textContent = orbitTo; return; }
      const enter = clamp(1 - r.top / window.innerHeight);           // 0 below the fold → 1 pinned
      const p = clamp(-r.top / Math.max(1, orbit.offsetHeight - window.innerHeight));
      orbit.style.setProperty("--enter", enter.toFixed(3));
      orbit.classList.toggle("is-in", enter > 0.55);
      orbitList.style.setProperty("--rot-o", `${(p * 150).toFixed(2)}deg`);
      orbitList.style.setProperty("--rot-i", `${(-p * 210).toFixed(2)}deg`);
      orbitN.textContent = Math.round(orbitTo * ease(clamp((enter - 0.4) / 0.6 * 0.5 + p * 1.2)));
    });

    root.querySelectorAll(".ab-logo img").forEach((img) => {
      const trim = () => {
        try {
          const w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h || img.dataset.trimmed) return;
          const cv = document.createElement("canvas");
          cv.width = w; cv.height = h;
          const ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, w, h).data;
          let x0 = w, y0 = h, x1 = -1, y1 = -1;
          for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
            if (d[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
          }
          if (x1 < 0) return;
          const out = document.createElement("canvas");
          out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
          out.getContext("2d").drawImage(cv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
          img.dataset.trimmed = "1";
          img.src = out.toDataURL("image/png");
          // same visual weight for every logo: equal ink area, whatever its shape
          const r = out.width / out.height;
          img.style.width = `${Math.min(78, 100 * Math.sqrt(0.13 * r / 2.1), 70 * r / 2.1).toFixed(2)}%`;
        } catch (e) { /* cross-origin without CORS: keep the original */ }
      };
      if (img.complete) trim(); else img.addEventListener("load", trim, { once: true });
    });

    /* ---- 3. books: the pile drops in book by book (bottom first) when you reach it ---- */
    const pile = root.querySelector(".ab-pile");
    if (pile) {
      const drop = () => {
        if (pile.classList.contains("is-dropped")) return;
        pile.classList.add("is-dropped");
        if (Cafe.reducedMotion()) return;
        pile.querySelectorAll("li").forEach((li) => setTimeout(() => sound("tap"), parseFloat(li.style.getPropertyValue("--drop")) * 1000 + 420));
      };
      if ("IntersectionObserver" in window && !Cafe.reducedMotion()) {
        pile.classList.add("is-waiting");
        const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { drop(); io.disconnect(); } }, { threshold: 0.35 });
        io.observe(pile);
      } else drop();
    }

    /* ---- 3. books: hover for the label (and a knock), click to pull one out ---- */
    root.querySelectorAll(".ab-book").forEach((btn) => {
      btn.addEventListener("pointerenter", () => sound("tap"));
      btn.addEventListener("click", () => {
        const out = btn.getAttribute("aria-pressed") !== "true";
        root.querySelectorAll(".ab-book[aria-pressed=true]").forEach((x) => x.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", String(out));
        sound("flip");
      });
    });

    /* ---- 4. travel: paper stamp — scroll progress picks the photo (and the note) ---- */
    const paper = root.querySelector(".ab-paper__track");
    if (paper) {
      const imgs = Array.from(paper.querySelectorAll(".ab-paper__stamp img"));
      const no = paper.querySelector(".ab-paper__no");
      const note = paper.querySelector(".ab-paper__note");
      const pnotes = JSON.parse(note.dataset.notes || "[]");
      const pm = paper.querySelector(".ab-paper__postmark");
      let cur = 0;
      Cafe.onFrame(() => {
        const r = paper.getBoundingClientRect();
        if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
        const p = clamp(-r.top / Math.max(1, paper.offsetHeight - window.innerHeight));
        pm.style.setProperty("--pm", `${(p * 320).toFixed(1)}deg`);   // the postmark turns as you go
        const k = Math.min(imgs.length - 1, Math.floor(p * imgs.length));
        if (k === cur) return;
        imgs.forEach((im) => im.classList.remove("is-off"));
        imgs[cur].classList.remove("is-on"); imgs[cur].classList.add(k > cur ? "is-off" : "is-off-back");
        setTimeout(((im) => () => im.classList.remove("is-off", "is-off-back"))(imgs[cur]), 500);
        imgs[k].classList.add("is-on");
        cur = k;
        pm.classList.remove("is-thunk"); void pm.offsetWidth; pm.classList.add("is-thunk");
        no.textContent = String(k + 1).padStart(2, "0");
        if (pnotes.length) note.textContent = pnotes[Math.floor(k / 3) % pnotes.length];
        sound("shutter");
      });
    }

    /* ---- headings rise in letter by letter when they come into view ---- */
    root.querySelectorAll(".ab-books .ab-h, .ab-paper__h, .ab-loves__label").forEach((h) => {
      const txt = h.textContent;
      h.setAttribute("aria-label", txt);
      h.innerHTML = txt.split(" ").map((w) => `<span class="ab-rise__w" aria-hidden="true">${Array.from(w).map((ch) => `<span class="ab-rise__c">${Cafe.esc(ch)}</span>`).join("")}</span>`).join(" ");
      h.querySelectorAll(".ab-rise__c").forEach((c, k) => c.style.setProperty("--k", k));
      h.classList.add("ab-rise");
      if (!("IntersectionObserver" in window) || Cafe.reducedMotion()) { h.classList.add("is-in"); return; }
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { h.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.6 });
      io.observe(h);
    });

    /* ---- espresso-shot scroll progress on the right edge ---- */
    const shot = document.createElement("div");
    shot.className = "ab-shot";
    shot.setAttribute("aria-hidden", "true");
    shot.innerHTML = `<span class="ab-shot__fill"></span>`;
    document.body.appendChild(shot);
    Cafe.onFrame(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      shot.style.setProperty("--fill", clamp(window.scrollY / max).toFixed(4));
      shot.classList.toggle("is-dark", parseFloat(root.style.getPropertyValue("--ab-dark") || 0) > 0.5);
    });
  },
});
