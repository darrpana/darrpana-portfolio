/* Career journey: a hand-drawn path that draws itself with scroll while a coffee
   bean travels along it, lighting up each milestone. Psychology runs alongside
   as a branch. At the end the bean becomes a cup.
   Desktop: the stage pins (CSS sticky) while you scroll through a tall track.
   Mobile: vertical timeline in normal flow, same logic.
   Reduced motion: fully drawn, static. Data lives in config.career. */
Cafe.register("career", {
  ICONS: { type: "type", wireframe: "wireframe", overlap: "overlap", kite: "kite", star: "star2" },
  DOT_Y: [176, 150, 184, 156, 170], // desktop wave, px from top of each column

  render(cfg) {
    const { esc, icons } = Cafe;
    const c = cfg.career;
    const n = c.milestones.length;
    const inf = c.influence;
    const mid = inf ? Math.floor((inf.from + inf.to) / 2) : -1;
    const items = c.milestones.map((m, i) => {
      const icon = icons[this.ICONS[m.icon] || m.icon] || icons.star2;
      const li = `
        <li class="tl__item" style="--dot-y:${this.DOT_Y[i % this.DOT_Y.length]}px">
          <span class="tl__dot" aria-hidden="true"></span>
          <span class="tl__icon" aria-hidden="true">${icon}</span>
          <span class="tl__year">${esc(m.year)}</span>
          <span class="tl__role">${esc(m.role)}</span>
        </li>`;
      const note = i === mid ? `
        <li class="tl__influence" aria-label="Parallel influence: ${esc(inf.label)}">
          ${icons.brain}<span class="hand">${esc(inf.label)}</span>
        </li>` : "";
      return li + note;
    }).join("");

    return `
      <div class="ribbons ribbons--top career__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 120V64C220 26 460 104 720 74S1220 18 1440 58V120Z" fill="#151515"/></svg>
      </div>
      <div class="career__track">
        <div class="career__stage">
          <div class="container">
            <div class="career__head">
              <div>
                <p class="eyebrow">The long way round</p>
                <h2 class="section-title" id="career-title">${esc(c.heading)}</h2>
              </div>
              ${Cafe.sticker(c.sticker, "career")}
              <p class="career__hint" aria-hidden="true">follow the bean ↓</p>
            </div>
            <div class="tl" style="--n:${n}">
              <svg class="tl__svg" aria-hidden="true" focusable="false">
                <defs><mask id="tl-branch-mask" maskUnits="userSpaceOnUse"><path class="tl__branch-reveal" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/></mask></defs>
                <path class="tl__ghost"/>
                <path class="tl__branch" mask="url(#tl-branch-mask)"/>
                <path class="tl__path"/>
                <g class="tl__bean">
                  <g class="tl__bean-shape">
                    <circle r="15" fill="#72cfb8" opacity=".16"/>
                    <ellipse rx="10" ry="7" fill="#72cfb8" stroke="#151515" stroke-width="2"/>
                    <path d="M-8 1C-3-4 3 4 8-1" stroke="#151515" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                  </g>
                  <g class="tl__cup-shape"><svg x="-30" y="-40" width="60" height="60" viewBox="0 0 48 48">${icons.cupSmall.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg></g>
                </g>
              </svg>
              <ol class="tl__list" aria-labelledby="career-title">${items}</ol>
            </div>
          </div>
        </div>
      </div>
      <div class="ribbons ribbons--bottom" aria-hidden="true">${Cafe.ribbons()}</div>`;
  },

  init(root, cfg) {
    const { clamp, onFrame, onLayout } = Cafe;
    const inf = cfg.career.influence;
    const tl = root.querySelector(".tl");
    const svg = root.querySelector(".tl__svg");
    const track = root.querySelector(".career__track");
    const path = root.querySelector(".tl__path");
    const ghost = root.querySelector(".tl__ghost");
    const branch = root.querySelector(".tl__branch");
    const reveal = root.querySelector(".tl__branch-reveal");
    const bean = root.querySelector(".tl__bean");
    const items = Array.from(root.querySelectorAll(".tl__item"));
    const note = root.querySelector(".tl__influence");

    let g = null; // geometry
    let vertical = false, pinned = false;

    const measure = () => {
      vertical = window.innerWidth < 900;
      pinned = !vertical && !Cafe.reducedMotion() && window.innerHeight >= 640;
      root.classList.toggle("is-pinned", pinned);
      root.classList.toggle("is-vertical", vertical);
      if (note) { note.style.left = ""; note.style.top = ""; }

      const box = tl.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const dots = items.map((li) => {
        const r = li.querySelector(".tl__dot").getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });

      // Build path through dots, measuring cumulative length at each milestone.
      const start = vertical ? { x: dots[0].x, y: dots[0].y - 56 } : { x: dots[0].x - 56, y: dots[0].y + 26 };
      let d = `M${start.x} ${start.y}`;
      const lens = [];
      let prev = start;
      dots.forEach((p, i) => {
        if (vertical) {
          const w = i % 2 ? -16 : 16, dy = p.y - prev.y;
          d += ` C${prev.x + w} ${prev.y + dy * 0.5} ${p.x - w} ${p.y - dy * 0.5} ${p.x} ${p.y}`;
        } else {
          const dx = p.x - prev.x;
          d += ` C${prev.x + dx * 0.5} ${prev.y} ${p.x - dx * 0.5} ${p.y} ${p.x} ${p.y}`;
        }
        path.setAttribute("d", d);
        lens.push(path.getTotalLength());
        prev = p;
      });
      ghost.setAttribute("d", d);
      const L = lens[lens.length - 1];
      path.style.strokeDasharray = `${L} ${L}`;

      // Psychology branch
      let bLen = 0;
      if (inf && dots[inf.from] && dots[inf.to]) {
        const a = dots[inf.from], b = dots[inf.to];
        let bd;
        if (vertical) {
          const cx = Math.max(2, a.x - 34);
          bd = `M${a.x} ${a.y} C${cx} ${a.y + 40} ${cx} ${b.y - 40} ${b.x} ${b.y}`;
        } else {
          const lift = Math.min(a.y, b.y) - 150;
          bd = `M${a.x} ${a.y} C${a.x + 60} ${lift} ${b.x - 60} ${lift} ${b.x} ${b.y}`;
          if (note) {
            note.style.left = `${(a.x + b.x) / 2}px`;
            note.style.top = `${Math.max(0, lift + 40 - 52)}px`;
          }
        }
        branch.setAttribute("d", bd);
        reveal.setAttribute("d", bd);
        bLen = reveal.getTotalLength();
        reveal.style.strokeDasharray = `${bLen} ${bLen}`;
      }

      // y-samples for vertical progress lookup
      const samples = [];
      if (vertical) for (let s = 0; s <= 120; s++) { const l = (L * s) / 120; samples.push({ l, y: path.getPointAtLength(l).y }); }

      g = { L, lens, bLen, samples, inf };
      update(true);
    };

    const progress = () => {
      if (Cafe.reducedMotion()) return 1;
      const vh = window.innerHeight;
      if (pinned) {
        const r = track.getBoundingClientRect();
        return clamp(-r.top / ((r.height - vh) * 0.9));
      }
      if (vertical && g.samples.length) {
        const target = vh * 0.6 - tl.getBoundingClientRect().top;
        const s = g.samples;
        if (target <= s[0].y) return 0;
        for (let i = 1; i < s.length; i++) {
          if (s[i].y >= target) {
            const t = (target - s[i - 1].y) / (s[i].y - s[i - 1].y || 1);
            return (s[i - 1].l + (s[i].l - s[i - 1].l) * t) / g.L;
          }
        }
        return 1;
      }
      const r = tl.getBoundingClientRect();
      return clamp((vh * 0.75 - r.top) / (r.height * 0.9));
    };

    let lastP = -1;
    const update = (force) => {
      if (!g) return;
      const p = progress();
      if (!force && Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      const at = g.L * p;
      path.style.strokeDashoffset = `${g.L - at}`;

      const pt = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(Math.min(g.L, at + 1));
      const behind = path.getPointAtLength(Math.max(0, at - 1));
      const ang = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      const complete = p >= 0.995;
      tl.classList.toggle("is-complete", complete);
      bean.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${complete ? 0 : ang.toFixed(1)})`);

      let current = -1;
      items.forEach((li, i) => {
        const on = at >= g.lens[i] - 1;
        li.classList.toggle("is-active", on);
        if (on) current = i;
      });
      items.forEach((li, i) => li.classList.toggle("is-current", i === current));

      if (g.inf && g.bLen) {
        const a = g.lens[g.inf.from], b = g.lens[g.inf.to];
        const pb = clamp((at - a) / (b - a));
        reveal.style.strokeDashoffset = `${g.bLen * (1 - pb)}`;
        if (note) note.classList.toggle("is-shown", pb >= 0.3);
      }
    };

    measure();
    onLayout(measure);
    Cafe.mqReduce.addEventListener("change", measure);
    onFrame(() => update(false));
  },
});
