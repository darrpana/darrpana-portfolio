/* Hero: Darrpana's cup composition, laid out exactly as the original artwork
   (pieces in % of config.hero.canvas), followed by a scroll-driven "dive".

   Immersive mode (motion allowed): the stage is pinned with CSS sticky while the
   page scrolls through a tall track. Scroll progress p (0 → 1) drives:
     .02–.38  labels drift outward and fade
     .12–.80  the scene zooms into the black of the cup (around config.hero.dive)
     .50–.80  a coffee-dark circle opens from that point and fills the screen
     .80–.97  the intro (sign, headline, subheading) rises in on the dark
   then the stage unpins straight into the dark Work section. Nothing is hijacked:
   it is ordinary scrolling, and every piece is plain content underneath.
   Reduced motion: no pin, no zoom; the composition sits above the intro. */
Cafe.register("hero", {
  render(cfg) {
    const { esc, icons } = Cafe;
    const h = cfg.hero;
    const { w: W, h: H } = h.canvas;
    // place a piece on the canvas in %
    const box = (p) => `left:${(p.x / W) * 100}%;top:${(p.y / H) * 100}%;width:${(p.w / W) * 100}%;`;
    // *text* in the headline becomes an accented <em>
    const headline = esc(h.headline).replace(/\*(.+?)\*/g, "<em>$1</em>");
    const ill = h.illustration;
    const labels = h.labels.map((l, i) => `
      <span class="h-label" style="${box(l)}--i:${i};--depth:${i % 2 ? -1 : 1}">
        <span class="h-label__fly"><img src="${esc(l.src)}" width="${l.w}" height="${l.h}" alt="${esc(l.text)}" decoding="async"></span>
      </span>`).join("");
    return `
      <div class="hero__track">
        <div class="hero__stage">
          <div class="scene" style="aspect-ratio:${W} / ${H}">
            <button class="h-sticker" type="button" style="${box(ill)}" aria-label="Say hi">
              <span class="h-sticker__wobble">
                <img src="${esc(ill.src)}" width="${ill.w}" height="${ill.h}" alt="${esc(ill.alt)}" fetchpriority="high">
              </span>
            </button>
            ${labels}
            <p class="bubble" role="status" aria-live="polite"></p>
          </div>
          <div class="hero__coffee" aria-hidden="true"></div>
          <p class="hero__hint hand" aria-hidden="true">${esc(h.scrollHint)}</p>
          <div class="hero__intro">
            <p class="cafe-sign"><span class="cafe-sign__dot" aria-hidden="true"></span>${esc(h.sign)}</p>
            <h1 class="hero__title">${headline}</h1>
            <p class="hero__sub">${h.subheading.map((s) => `<span>${esc(s)}</span>`).join("")}</p>
            <a class="hero__scroll" href="#work">${icons.arrowDown}See what's on the menu</a>
          </div>
        </div>
      </div>`;
  },

  init(root, cfg) {
    const { clamp, onFrame, onLayout } = Cafe;
    const h = cfg.hero;
    const track = root.querySelector(".hero__track");
    const stage = root.querySelector(".hero__stage");
    const scene = root.querySelector(".scene");
    const sticker = scene.querySelector(".h-sticker");
    const bubble = scene.querySelector(".bubble");
    const coffee = root.querySelector(".hero__coffee");
    const hint = root.querySelector(".hero__hint");
    const intro = root.querySelector(".hero__intro");
    const flyers = Array.from(scene.querySelectorAll(".h-label__fly"));

    // poke: wiggle + greeting (re-triggerable)
    let timer;
    sticker.addEventListener("click", () => {
      scene.classList.remove("is-poked");
      void scene.offsetWidth; // restart the wiggle
      scene.classList.add("is-poked");
      bubble.textContent = h.greeting;
      Cafe.sound.play("brew", 2.6);
      clearTimeout(timer);
      timer = setTimeout(() => { scene.classList.remove("is-poked"); bubble.textContent = ""; }, 2600);
    });

    // gentle mouse parallax for the labels (fine pointers, motion allowed)
    let tx = 0, ty = 0, mx = 0, my = 0, praf = 0;
    const step = () => {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      scene.style.setProperty("--mx", mx.toFixed(3));
      scene.style.setProperty("--my", my.toFixed(3));
      praf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    root.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !Cafe.finePointer() || Cafe.reducedMotion()) return;
      const r = scene.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.6, 0.6);
      ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.6, 0.6);
      if (!praf) praf = requestAnimationFrame(step);
    }, { passive: true });
    root.addEventListener("pointerleave", () => { tx = ty = 0; if (!praf) praf = requestAnimationFrame(step); });

    // ---- scroll dive ----
    const { w: W, h: H } = h.canvas;
    const DX = h.dive.x / W, DY = h.dive.y / H;
    scene.style.transformOrigin = `${DX * 100}% ${DY * 100}%`;
    // each label flies away from the canvas centre
    const dirs = h.labels.map((l) => {
      const vx = l.x + l.w / 2 - W / 2, vy = l.y + l.h / 2 - H / 2;
      const len = Math.hypot(vx, vy) || 1;
      return { x: vx / len, y: vy / len };
    });

    const seg = (p, a, b) => clamp((p - a) / (b - a));
    const smooth = (t) => t * t * (3 - 2 * t);
    const immersive = () => !Cafe.reducedMotion();

    let m = null;
    const measure = () => {
      m = {
        vw: stage.clientWidth, vh: stage.clientHeight,
        // layout position (untransformed) of the dive point inside the stage
        x: scene.offsetLeft + DX * scene.offsetWidth,
        y: scene.offsetTop + DY * scene.offsetHeight,
        run: Math.max(1, track.offsetHeight - window.innerHeight),
      };
    };
    measure();
    onLayout(measure);

    const reset = () => {
      scene.style.transform = ""; coffee.style.clipPath = ""; coffee.style.removeProperty("--ink-in"); hint.style.opacity = "";
      intro.style.opacity = ""; intro.style.transform = ""; intro.classList.remove("is-live");
      flyers.forEach((f) => { f.style.transform = ""; f.style.opacity = ""; });
    };

    let last = -1, wasBrewing = false;
    onFrame(() => {
      if (!immersive()) { if (last !== -2) { reset(); last = -2; } return; }
      const p = clamp(-track.getBoundingClientRect().top / m.run);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;

      // labels drift outward
      const lt = seg(p, 0.02, 0.38);
      const fly = lt * lt * m.vw * 0.55;
      flyers.forEach((f, i) => {
        const d = dirs[i];
        f.style.transform = lt ? `translate(${(d.x * fly).toFixed(1)}px, ${(d.y * fly).toFixed(1)}px) rotate(${(d.x * 18 * lt).toFixed(2)}deg)` : "";
        f.style.opacity = (1 - Math.pow(lt, 1.4)).toFixed(3);
      });

      // zoom into the cup: exponential scale feels like a constant-speed dive
      const zt = seg(p, 0.12, 0.8);
      const scale = Math.pow(h.dive.zoom, zt * zt);
      const ct = smooth(seg(p, 0.12, 0.6));
      const ox = (m.vw / 2 - m.x) * ct, oy = (m.vh / 2 - m.y) * ct;
      scene.style.transform = zt || ct ? `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px) scale(${scale.toFixed(4)})` : "";

      // coffee-dark circle opens from the dive point
      const rt = seg(p, 0.5, 0.8);
      const r = rt * rt * Math.hypot(m.vw, m.vh);
      coffee.style.clipPath = `circle(${r.toFixed(1)}px at ${(m.x + ox).toFixed(1)}px ${(m.y + oy).toFixed(1)}px)`;
      coffee.style.setProperty("--ink-in", seg(p, 0.8, 0.95).toFixed(3));
      // the espresso machine runs as the coffee fills the screen (once per dive, either way)
      const brewing = p > 0.42 && p < 0.9;
      if (brewing && !wasBrewing) Cafe.sound.play("brew", 3.4);
      wasBrewing = brewing;

      hint.style.opacity = (1 - seg(p, 0, 0.05)).toFixed(3);
      if (p > 0.02) bubble.textContent = "";

      // intro rises in on the dark
      const it = seg(p, 0.8, 0.97);
      const e = 1 - Math.pow(1 - it, 3);
      intro.style.opacity = e.toFixed(3);
      intro.style.transform = `translateY(${((1 - e) * 40).toFixed(1)}px)`;
      intro.classList.toggle("is-live", it > 0.5);
    });

    // keyboard users: focusing the intro link scrolls the dive to its end
    intro.addEventListener("focusin", () => {
      if (!immersive()) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY < top + m.run * 0.95) window.scrollTo({ top: top + m.run * 0.97, behavior: "instant" });
    });
    Cafe.mqReduce.addEventListener("change", () => { last = -1; measure(); Cafe.requestFrame(); });
  },
});
