/* Work: six project cards filed in a folder, like papers in a pocket.
   The stage is pinned (CSS sticky) while the page scrolls through a tall track;
   scroll progress p (0 → N) drives the sheets — no hijacking, just normal scrolling:
     - cards rest in the pocket, back ones peeking higher, most of the front card showing
     - in its turn, the front sheet rises out of the pocket to show its thumbnail, holds,
       then is tossed up and away while the next sheet slides forward
   Each card is just the project's thumbnail (full bleed, outlined) and a short title,
   and links to its case study — clickable even while tucked in the pocket.
   The folder is centred and spans the screen; the pocket is a thin purple band with a
   wide notch, so almost all of each card stays visible.
   Reduced motion: no pin; the sheets are laid out as a plain list. */
Cafe.ribbons = (fill = "#151515") => `
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M0 120V70C180 40 320 96 520 78S860 10 1060 30 1340 92 1440 60V120Z" fill="#72cfb8"/>
    <path d="M0 120V86C220 60 360 108 560 92S880 34 1080 52 1330 104 1440 80V120Z" fill="#5b55e0"/>
    <path d="M0 120V100C240 84 400 116 600 106S900 62 1100 74 1340 112 1440 98V120Z" fill="#d62a7e"/>
    <path d="M0 120V110C260 100 420 122 620 116S920 90 1120 96 1350 118 1440 112V120Z" fill="${fill}"/>
  </svg>`;

Cafe.register("work", {
  render(cfg) {
    const { esc } = Cafe;
    const w = cfg.work;
    const n = w.projects.length;
    const pad = (k) => String(k).padStart(2, "0");
    // a card is the thumbnail, full bleed, with a short title tab; nothing else
    const sheets = w.projects.map((p, i) => `
      <a class="sheet" href="${esc(p.href)}" style="--paper:${esc(p.paper || "#f1efea")}" data-i="${i}" data-cursor="espresso">
        <img class="sheet__img" src="${esc(p.image)}" alt="" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">
        <span class="sheet__name">${esc(p.name || p.title)}</span>
        <span class="sr-only">: ${esc(p.title)}. ${esc(p.imageAlt)}</span>
      </a>`).join("");
    return `
      <div class="ribbons ribbons--top">${Cafe.ribbons()}</div>
      <h2 class="sr-only" id="work-title">${esc(w.heading)}</h2>
      <div class="work__track" style="--n:${n}">
        <div class="work__stage">
          <div class="folder">
            <div class="folder__sheets">${sheets}</div>
            <div class="folder__pocket" aria-hidden="true">
              <span class="folder__count"><b class="folder__current">01</b> / ${pad(n)}</span>
            </div>
          </div>
        </div>
      </div>`;
  },

  init(root) {
    const { clamp, onFrame, onLayout } = Cafe;
    const track = root.querySelector(".work__track");
    const sheets = Array.from(root.querySelectorAll(".sheet"));
    const current = root.querySelector(".folder__current");
    const N = sheets.length;
    const END = N - 0.35; // the last card stays out instead of being tossed away
    const JITTER = [0, 16, -14, 12, -10, 8, -6]; // px, so the stack looks hand-filed

    const seg = (v, a, b) => clamp((v - a) / (b - a));
    const ease = (t) => t * t * (3 - 2 * t);
    const animated = () => !Cafe.reducedMotion();

    let run = 1, top = 0;
    const measure = () => {
      run = Math.max(1, track.offsetHeight - window.innerHeight);
      top = track.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    onLayout(measure);

    // keyboard: a focused card is pulled out so it can be seen
    sheets.forEach((s) => s.addEventListener("focus", () => {
      if (!animated()) return;
      const target = Math.min(END, +s.dataset.i + 0.5);
      window.scrollTo({ top: top + (target / END) * run + 1, behavior: "instant" });
    }));

    let last = -1, lastShown = -1;
    const reset = () => sheets.forEach((s) => { s.style.transform = ""; s.style.opacity = ""; s.style.zIndex = ""; s.classList.remove("is-out"); });

    onFrame(() => {
      if (!animated()) { if (last !== -2) { reset(); last = -2; } return; }
      const p = clamp(-track.getBoundingClientRect().top / run) * END;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      const k = Math.min(N - 1, Math.floor(p));
      const t = p - k;
      const rise = ease(seg(t, 0.05, 0.42));
      const exit = k === N - 1 ? 0 : ease(seg(t, 0.68, 1));

      sheets.forEach((s, i) => {
        let tx = 0, ty = 0, rot = 0, sc = 1, op = 1, z = N - i;
        if (i < k) {            // already pulled out and tossed away
          op = 0; ty = -230; rot = -10; tx = -80;
        } else if (i === k) {   // this card's turn: rise fully out, hold, toss
          ty = -18 * rise - 170 * exit;
          tx = -60 * exit;
          rot = -1.2 * rise - 8 * exit;
          sc = 1 + 0.015 * rise - 0.06 * exit;
          op = 1 - seg(exit, 0.55, 1);
          z = N + 1;
        } else {                // waiting in the pocket; moves forward as the front one leaves
          const d = i - k - exit;
          ty = -9.5 * d;
          tx = JITTER[i % JITTER.length] * clamp(d);
          sc = 1 - 0.03 * d;
          op = 1 - clamp(d - 3);
        }
        s.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}%) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
        s.style.opacity = op.toFixed(3);
        s.style.zIndex = z;
        s.classList.toggle("is-out", i === k && rise > 0.5 && exit < 0.3);
      });

      const shown = exit >= 0.5 ? k + 1 : k;
      if (shown !== lastShown) {
        lastShown = shown;
        current.textContent = String(Math.min(N, shown + 1)).padStart(2, "0");
      }
    });
    Cafe.mqReduce.addEventListener("change", () => { last = -1; measure(); Cafe.requestFrame(); });
  },
});
