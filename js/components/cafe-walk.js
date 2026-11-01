/* Café walk (about-cafe.html): the About page as a walk through a line-drawn café.
   The page pins a 8800 × 1000 scene (scaled to the screen's height) and scrolling moves you
   sideways through it, corner by corner:
     Entrance → Counter (chalkboard hello, receipt, Wi-Fi card, espresso machine)
     → Bookcase (her books on a shelf) → The table (laptop of brand logos, sticky notes of
     things she loves) → Window & gallery wall (travel photos on strings, her art in frames)
     → Pastry case (treats = social links) → exit door.
   Line art is inline SVG (ink strokes on light grey); text, photos, books and links are real
   HTML laid over it in scene units (% of the scene + font sizes in scene units via --k).
   Lamps swing with your speed, foreground props move a touch faster (parallax), each corner
   wakes up as you reach it, and a little map at the bottom jumps between corners.
   Content comes from config.aboutPage / footer.treats; café signs from config.cafeWalk. */
Cafe.register("cafeWalk", {
  W: 8800, H: 1000,

  render(cfg) {
    const { esc } = Cafe;
    const cw = cfg.cafeWalk, ab = cfg.aboutPage, W = this.W, H = this.H;
    const steps = ab.story.steps;
    const strip = (t) => esc(t.replace(/\[\[(.+?)\]\]/g, "$1"));
    const mark = (t) => esc(t).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>");
    // place an HTML block in scene units
    const at = (x, y, w, h, cls, inner, extra = "") =>
      `<div class="cw-at ${cls}" style="left:${(x / W * 100).toFixed(3)}%;top:${(y / H * 100).toFixed(3)}%;width:${(w / W * 100).toFixed(3)}%;${h ? `height:${(h / H * 100).toFixed(3)}%;` : ""}${extra}">${inner}</div>`;

    /* ---------- line-art props ---------- */
    const P = "#716df2";
    const lamp = (x) => `<g class="cw-lamp" style="transform-origin:${x}px 40px">
      <path d="M${x} 40V190"/><path d="M${x - 58} 252L${x - 24} 190H${x + 24}L${x + 58} 252Z" class="cw-fill"/>
      <path d="M${x - 15} 252a15 15 0 0 0 30 0"/>
      <path class="cw-ray" d="M${x - 92} 268l-26 14M${x + 92} 268l26 14M${x} 284v30"/></g>`;
    const plant = (x, y = 860, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-46-96H46L34 0H-34Z" class="cw-fill"/><path d="M-52-110H52V-96H-52Z" class="cw-fill"/>
      <path d="M0-110C-8-170-60-190-92-250C-40-240-14-200 0-110M0-110C6-190 20-240 60-290C66-230 40-170 0-110M0-110C24-150 70-170 118-176C96-140 50-120 0-110M0-110C-18-140-28-180-14-232"/></g>`;
    const chair = (x, d = 1) => `<g transform="translate(${x} 0) scale(${d} 1)">
      <path d="M-40 520V860M-40 690H50V860M-40 520C-30 508-14 506 0 520M-40 560H-6M-40 600H-6M50 700V860M-40 760H50"/></g>`;
    const cupArt = (x, y, s = 1, steam = true) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-34-46H34L26 0H-26Z" class="cw-fill"/><path d="M34-36c22 0 22 26 0 26"/><path d="M-50 2H50"/>
      ${steam ? `<path class="cw-steam" d="M-12-58c-10-14 10-22 0-38M8-58c-10-14 10-22 0-38"/>` : ""}</g>`;

    // the whole café, back wall to floor
    const scene = `
      <svg class="cw-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
        <g class="cw-ink">
          <path d="M0 40H${W}M0 860H${W}M0 842H${W}" class="cw-thin"/>
          ${[700, 1900, 2820, 3550, 4950, 6250, 7900].map(lamp).join("")}

          <!-- entrance: awning, door, OPEN sign, mat, plant -->
          <path d="M90 240H520" /><path d="M90 240${Array.from({ length: 11 }, (_, k) => `a19.5 19.5 0 0 0 39 0`).join("")}" class="cw-fill"/>
          ${Array.from({ length: 10 }, (_, k) => `<path d="M${129 + k * 39} 240V262" class="cw-thin"/>`).join("")}
          <path d="M150 300H460V860H150Z" class="cw-fill"/><path d="M182 330H428V600H182Z"/><path d="M182 640H428V820H182Z" class="cw-thin"/>
          <circle cx="400" cy="620" r="9"/><path d="M250 330L305 380L360 330" class="cw-thin"/>
          <path d="M240 380H370V430H240Z" class="cw-fill cw-accent"/>
          <path d="M120 880H490" class="cw-thin"/>
          ${plant(560, 860, 1.1)}

          <!-- counter: chalkboard, Wi-Fi card, espresso machine, till -->
          <path d="M1490 140H2310V610H1490Z" class="cw-fill" stroke-width="10"/><path d="M1508 158H2292V592H1508Z" class="cw-board"/>
          <path d="M1530 610V632M2270 610V632M1520 632H2280" class="cw-thin"/>
          <path d="M2570 170L2500 230M2570 170L2640 230" class="cw-thin"/><circle cx="2570" cy="168" r="6"/>
          <path d="M2420 230H2720V400H2420Z" class="cw-fill"/>
          <path d="M1440 640H2920V666H1440Z" class="cw-fill"/><path d="M1460 666H2900V860H1460Z" class="cw-fill"/>
          ${[1700, 1950, 2200, 2450, 2700].map((x) => `<path d="M${x} 690V830" class="cw-thin"/>`).join("")}
          <path d="M2200 470H2490V640H2200Z" class="cw-fill"/><path d="M2190 456H2500V470H2190Z" class="cw-fill"/>
          <circle cx="2255" cy="505" r="17"/><circle cx="2435" cy="505" r="17"/><path d="M2255 505l8-8M2435 505l-6-9" class="cw-thin"/>
          <path d="M2290 540H2400V562H2290Z" class="cw-fill"/><path d="M2310 562H2380L2370 580H2320Z"/><path d="M2380 572H2470" stroke-width="7"/>
          <path d="M2318 600H2372L2366 632H2324Z" class="cw-fill"/><path d="M2210 610H2480V626H2210Z" class="cw-thin"/>
          <path class="cw-steam cw-steam--machine" d="M2335 590c-10-14 10-22 0-36M2355 590c-10-14 10-22 0-36"/>
          <path d="M2490 520c40 0 50 30 40 70" class="cw-thin"/>
          <path d="M2700 560L2720 600H2870L2850 560Z" class="cw-fill"/><path d="M2715 600H2875V640H2715Z" class="cw-fill"/><path d="M2740 562H2830" stroke-width="5"/>
          ${cupArt(1640, 640, 0.9, true)}

          <!-- bookcase + hanging sign + armchair -->
          <path d="M3360 40V80M3740 40V80" class="cw-thin"/><path d="M3280 80H3820V150H3280Z" class="cw-fill"/>
          <path d="M3140 170H3960V860H3140Z" class="cw-fill"/><path d="M3120 150H3980V172H3120Z" class="cw-fill"/>
          <path d="M3160 360H3940M3160 374H3940M3160 560H3940M3160 574H3940M3160 744H3940M3160 758H3940"/>
          <path d="M3550 758V860M3500 806h-14M3600 806h14" class="cw-thin"/>
          ${plant(3260, 360, 0.55)}${cupArt(3460, 360, 0.75, false)}
          <path d="M3700 250H3800V358H3700Z" class="cw-fill"/><path d="M3716 266H3784V342H3716Z" class="cw-thin"/>
          <path d="M3200 744H3460V716H3200ZM3216 716H3440V690H3216ZM3194 690H3430V664H3194Z" class="cw-fill"/>
          <path d="M3700 744V650a40 40 0 0 1 80 0V744Z" class="cw-fill"/><path d="M3700 670H3780" class="cw-thin"/>
          <path d="M4010 860V620C4010 560 4050 540 4110 540S4210 560 4210 620V860M3990 700H4230V760H3990ZM3990 700C3970 700 3960 660 3990 640M4230 700C4250 700 4260 660 4230 640M4020 860L4010 880M4200 860L4210 880"/>

          <!-- the table: laptop, cup, sketchbook, chairs -->
          <path d="M4540 600H5470V622H4540Z" class="cw-fill"/><path d="M4580 622V860M5430 622V860M4580 650H5430" />
          <path d="M4680 418H5000V592H4680Z" class="cw-fill"/><path d="M4694 432H4986V578H4694Z" class="cw-screen"/>
          <path d="M4640 592H5040L5056 604H4624Z" class="cw-fill"/>
          ${cupArt(5130, 600, 1, true)}
          <path d="M5230 600L5240 584H5320L5324 600ZM5324 600L5330 584H5412L5422 600Z" class="cw-fill"/>
          <path d="M5250 594c20-6 30 4 50-4M5340 592c16-8 30 2 56-4" class="cw-thin cw-accent"/>
          ${chair(4470, 1)}${chair(5540, -1)}

          <!-- window with a skyline, gallery wall -->
          <path d="M5780 140H6740V640H5780Z" class="cw-fill"/><path d="M5800 160H6720V620H5800Z"/>
          <path d="M6260 160V620M5800 390H6720" class="cw-thin"/><path d="M5760 640H6760V662H5760Z" class="cw-fill"/>
          <path class="cw-thin cw-faint" d="M5800 560H5860V470H5920V520H5990V430H6040V500H6110V450H6170V540H6260M6260 540H6320V460H6380V500H6450V420H6500V520H6580V480H6640V530H6720"/>
          <path d="M6840 180H7460" class="cw-thin cw-faint"/>

          <!-- pastry case + exit door -->
          <path d="M7480 520H8360V700H7480Z" class="cw-glass"/><path d="M7480 520L7520 490H8320L8360 520" class="cw-thin"/>
          <path d="M7500 612H8340" class="cw-thin"/><path d="M7460 700H8380V860H7460Z" class="cw-fill"/>
          ${[7700, 7920, 8140].map((x) => `<path d="M${x} 720V840" class="cw-thin"/>`).join("")}
          <path d="M8480 300H8760V860H8480Z" class="cw-fill"/><path d="M8510 330H8730V560H8510Z"/><circle cx="8505" cy="620" r="9"/>
        </g>
      </svg>`;

    // foreground props (move a little faster than the room: parallax)
    const front = `
      <svg class="cw-front" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
        <g class="cw-ink">${plant(1380, 900, 1.2)}${plant(4320, 900, 1.25)}${plant(8790, 900, 1.3)}</g>
      </svg>`;

    /* ---------- HTML layered on the scene ---------- */
    const greet = steps.find((s) => s.greeting) || steps[0];
    const body = steps.filter((s) => !s.greeting);
    const b = ab.books;
    const books = b.items.slice(0, b.show || 7).map((it, i) => {
      const h = 152 + ((i * 13) % 28), w = 58 + ((i * 17) % 22), lean = i === 3 ? -6 : i === 6 ? 5 : 0;
      return `<button type="button" class="cw-book" style="--h:${h};--w:${w};--lean:${lean}deg" aria-label="${esc(it.title)} by ${esc(it.author)}">
        <span class="cw-book__t" aria-hidden="true">${esc(it.title)}</span>
        <span class="cw-book__label" aria-hidden="true"><b>${esc(it.title)}</b>${esc(it.author)}</span></button>`;
    }).join("");
    const loves = ab.loves ? ab.loves.rows.flat() : [];
    const notes = loves.map((w, i) => `<li class="cw-note" style="--r:${[-4, 3, -2, 5, -3, 2, -5, 4][i % 8]}deg;--d:${(i * 0.06).toFixed(2)}s">${esc(w)}</li>`).join("");
    const logos = ab.brands.logos.map((l) => `<img src="${esc(l.src)}" alt="${esc(l.name)}" decoding="async">`).join("");
    // travel photos hang from three strings across the window
    const t = ab.travel, rows = [8, 7, 7];
    let k = 0;
    const photos = rows.map((n, r) => {
      const y0 = 190 + r * 150, x0 = 5830, span = 860;
      const out = [];
      for (let j = 0; j < n && k < t.photos.length; j++, k++) {
        const u = (j + 0.5) / n, x = x0 + u * span, sag = 34 * 4 * u * (1 - u);
        out.push(at(x - 46, y0 + sag, 92, 0, "cw-photo", `<img src="${esc(t.photos[k])}" alt="" loading="lazy" decoding="async">`, `--r:${((k * 37) % 13) - 6}deg;--d:${(k * 0.04).toFixed(2)}s`));
      }
      const path = `M${x0 - 20} ${y0 - 6}Q${x0 + span / 2} ${y0 + 2 * 34 - 6} ${x0 + span + 20} ${y0 - 6}`;
      return { out: out.join(""), path };
    });
    const strings = `<svg class="cw-strings" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><g class="cw-ink">${photos.map((p) => `<path d="${p.path}" class="cw-thin"/>`).join("")}</g></svg>`;
    const frames = [[6840, 210, 270, 270], [7160, 210, 270, 270], [6840, 520, 270, 0], [7160, 520, 270, 0]];
    const art = cw.art.map((src, i) => at(frames[i][0], i < 2 ? frames[i][1] : 500, frames[i][2], 0, "cw-frame", `<img src="${esc(src)}" alt="One of Darrpana's artworks" loading="lazy" decoding="async">`)).join("");
    const tr = cfg.footer.treats;
    const link = (it) => (cfg.social.links.find((l) => l.name === it.social) || {}).href || "#";
    const treats = tr ? tr.items.map((it, i) => at(7560 + i * 270, 545, 200, 0, "cw-treat-wrap",
      `<a class="cw-treat" href="${esc(link(it))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(it.social)} (opens in a new tab)">
        <span class="cw-treat__food"><img class="cw-treat__fresh" src="${esc(it.fresh)}" alt="" decoding="async"><img class="cw-treat__eaten" src="${esc(it.eaten)}" alt="" decoding="async"></span>
        <span class="cw-treat__tag">${esc(it.label)}</span></a>`)).join("") : "";

    const stations = cw.stations;
    const stops = [0, 1400, 3000, 4300, 5700, 7400];
    return `
      <h1 class="sr-only">About Darrpana</h1>
      <div class="cw-track">
        <div class="cw-pin">
          <div class="cw-scene" style="--W:${W};--H:${H}">
            ${scene}
            <div class="cw-layer">
              ${at(620, 300, 760, 0, "cw-welcome", `<p class="cw-welcome__h">${esc(cw.welcome)}</p><p class="cw-welcome__sub">${esc(cw.welcomeSub)} <span aria-hidden="true">→</span></p>`)}
              ${at(270, 392, 70, 0, "cw-open", "OPEN")}
              ${at(1530, 180, 740, 400, "cw-chalk cw-station", `<p class="cw-chalk__h">${mark(greet.text)}</p>${body[0] ? `<p class="cw-chalk__p">${strip(body[0].text)}</p>` : ""}`, "")}
              ${at(2440, 250, 260, 140, "cw-wifi", `<p><b>${esc(cw.wifi.label)}</b> <span aria-hidden="true">ᯤ</span></p><p class="cw-wifi__k">password</p><p class="cw-wifi__v">${esc(cw.wifi.password)}</p>`)}
              ${at(2712, 290, 176, 272, "cw-receipt-wrap", `<div class="cw-receipt"><p class="cw-receipt__h">ORDER #1</p>${cw.receipt.map((r) => `<p>${esc(r)}</p>`).join("")}<p class="cw-receipt__t">thank you!</p></div>`)}
              ${body[1] ? at(1500, 684, 440, 0, "cw-counter-note", `<p>${strip(body[1].text)}</p>`, "--r:-1.5deg") : ""}
              ${body[2] ? at(1980, 684, 900, 0, "cw-counter-note", `<p>${strip(body[2].text)}</p>`, "--r:1deg") : ""}
              ${at(3290, 92, 520, 50, "cw-sign", esc(b.heading))}
              ${at(3170, 374, 760, 186, "cw-shelf", `<div class="cw-shelf__books" role="group" aria-label="${esc(b.heading)}">${books}</div>`)}
              ${at(4360, 110, 560, 0, "cw-notes-h", esc(cw.notesTitle))}
              ${at(4360, 165, 520, 240, "cw-notes-wrap", `<ul class="cw-notes">${notes}</ul>`)}
              ${at(4694, 432, 292, 146, "cw-screen-ui", `<div class="cw-logos">${logos}</div><p class="cw-screen-ui__n">90+</p>`)}
              ${at(5030, 400, 380, 0, "cw-laptop-note", `<span aria-hidden="true">← </span>${esc(cw.laptop)}`)}
              ${at(5800, 80, 900, 0, "cw-travel-h", `${esc(t.heading)} <span>· ${esc(t.sub)}</span>`)}
              ${photos.map((p) => p.out).join("")}
              ${at(6840, 120, 600, 0, "cw-art-h", esc(cw.artTitle))}
              ${art}
              ${at(7520, 300, 820, 0, "cw-treats-sign", esc(cw.treatsSign))}
              ${treats}
              ${at(8510, 380, 220, 0, "cw-door-sign", esc(cw.door))}
            </div>
            ${strings}
          </div>
          <div class="cw-frontwrap">${front}</div>
          <nav class="cw-map" aria-label="Café corners">
            ${stations.map((s, i) => `<button type="button" class="cw-map__stop" data-x="${stops[i]}"><span class="cw-map__dot" aria-hidden="true"></span><span class="cw-map__label">${esc(s)}</span></button>`).join("")}
          </nav>
        </div>
      </div>`;
  },

  init(root) {
    const { clamp } = Cafe;
    const W = this.W, H = this.H;
    const sound = (n) => Cafe.sound && Cafe.sound.play(n);
    document.title = "Café walk — Darrpana";
    const track = root.querySelector(".cw-track");
    const pin = root.querySelector(".cw-pin");
    const scene = root.querySelector(".cw-scene");
    const front = root.querySelector(".cw-front");
    const lamps = Array.from(root.querySelectorAll(".cw-lamp"));
    const stops = Array.from(root.querySelectorAll(".cw-map__stop"));
    const stopX = stops.map((s) => +s.dataset.x);
    // each corner wakes up when you reach it
    const zones = [
      { x0: 1300, x1: 3000, el: root.querySelector(".cw-chalk"), extra: [root.querySelector(".cw-receipt-wrap")] },
      { x0: 2950, x1: 4350, el: root.querySelector(".cw-shelf") },
      { x0: 4250, x1: 5700, el: root.querySelector(".cw-notes-wrap"), extra: [root.querySelector(".cw-screen-ui")] },
      { x0: 5650, x1: 7500, el: root.querySelector(".cw-layer"), cls: "is-gallery" },
      { x0: 7350, x1: W, el: root.querySelector(".cw-layer"), cls: "is-treats" },
    ];
    let k = 1, sw = W, run = 1;
    const layout = () => {
      k = pin.clientHeight / H;                         // scene units → px
      sw = W * k;
      scene.style.setProperty("--k", k);
      scene.style.width = `${sw}px`;
      front.style.width = `${sw}px`;
      run = Math.max(1, sw - pin.clientWidth);
      track.style.height = `${run + window.innerHeight}px`;  // 1px of scroll = 1px of walking
    };
    layout();
    Cafe.onLayout(layout);
    window.addEventListener("resize", layout);

    let lastY = window.scrollY, swing = 0, lastActive = -1;
    Cafe.onFrame(() => {
      const r = track.getBoundingClientRect();
      const p = clamp(-r.top / run);
      const x = p * run;
      const y = window.scrollY, v = y - lastY; lastY = y;
      scene.style.transform = `translate3d(${(-x).toFixed(1)}px,0,0)`;
      front.style.transform = `translate3d(${(-x * 1.18 + pin.clientWidth * 0.09).toFixed(1)}px,0,0)`;
      if (!Cafe.reducedMotion()) {
        swing += (clamp(-v * 0.25, -9, 9) - swing) * 0.12;   // lamps sway as you walk
        lamps.forEach((l, i) => { l.style.rotate = `${(swing * (i % 2 ? 1 : 0.8)).toFixed(2)}deg`; });
        if (Math.abs(swing) > 0.05) Cafe.requestFrame();
      }
      // which corner is in the middle of the screen (in scene units)
      const mid = (x + pin.clientWidth * 0.5) / k;
      zones.forEach((z) => {
        const on = mid > z.x0 && mid < z.x1;
        if (z.cls) z.el.classList.toggle(z.cls, on);
        else z.el.classList.toggle("is-here", on);
        (z.extra || []).forEach((e) => e.classList.toggle("is-here", on));
      });
      let active = 0;
      stopX.forEach((sx, i) => { if (mid >= sx + 200) active = i; });
      if (active !== lastActive) { lastActive = active; stops.forEach((s, i) => s.classList.toggle("is-on", i === active)); }
    });

    // map: jump to a corner (centre it on screen)
    stops.forEach((s, i) => s.addEventListener("click", () => {
      const target = i ? clamp((stopX[i] + 700) * k - pin.clientWidth * 0.5, 0, run) : 0;
      window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY + target, behavior: Cafe.reducedMotion() ? "instant" : "smooth" });
    }));

    // the laptop cycles through the brand logos while you're at the table
    const logos = Array.from(root.querySelectorAll(".cw-logos img"));
    const screen = root.querySelector(".cw-screen-ui");
    let li = 0;
    setInterval(() => {
      if (!screen.classList.contains("is-here") || Cafe.reducedMotion()) return;
      li = (li + 6) % logos.length;
      logos.forEach((img, j) => img.classList.toggle("is-on", ((j - li + logos.length) % logos.length) < 6));
    }, 1400);
    logos.forEach((img, j) => img.classList.toggle("is-on", j < 6));

    // little sounds and touches
    root.querySelectorAll(".cw-book").forEach((bk) => {
      bk.addEventListener("pointerenter", () => sound("tap"));
      bk.addEventListener("click", () => { bk.classList.toggle("is-out"); sound("flip"); });
    });
    root.querySelectorAll(".cw-photo").forEach((ph) => ph.addEventListener("pointerenter", () => sound("shutter")));
    root.querySelectorAll(".cw-note").forEach((n) => n.addEventListener("pointerenter", () => sound("pop")));
    root.querySelectorAll(".cw-treat").forEach((a) => {
      const bite = () => { a.classList.add("is-eaten"); sound("crunch"); };
      a.addEventListener("pointerenter", bite); a.addEventListener("focus", bite);
      a.addEventListener("pointerleave", () => a.classList.remove("is-eaten")); a.addEventListener("blur", () => a.classList.remove("is-eaten"));
    });
    root.querySelector(".cw-receipt-wrap").addEventListener("click", () => sound("pop"));
    // the espresso machine brews when clicked (hit area over the drawing)
    const machine = document.createElement("button");
    machine.type = "button"; machine.className = "cw-at cw-machine-hit"; machine.setAttribute("aria-label", "Brew an espresso");
    Object.assign(machine.style, { left: `${2190 / W * 100}%`, top: `${456 / H * 100}%`, width: `${310 / W * 100}%`, height: `${184 / H * 100}%` });
    root.querySelector(".cw-layer").appendChild(machine);
    machine.addEventListener("click", () => { scene.classList.remove("is-brewing"); void scene.offsetWidth; scene.classList.add("is-brewing"); sound("brew", 2.4); });
  },
});
