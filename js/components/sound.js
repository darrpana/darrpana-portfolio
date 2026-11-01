/* Café sounds, synthesised with the Web Audio API (no audio files):
     brew()    espresso machine: low rumble, gurgling bubbles, a rising hiss of steam
     flip()    a page turning
     tap()     a soft knock on wood (a book on the shelf)
     shutter() a camera click
     pop()     a light pop (a photo landing)
     chirp()   two quick rising notes, like a chat message (a photo talking)
     clink()   cups touching: two bright, quickly fading bell tones
     crunch()  a bite of something crisp: a quick scatter of filtered noise crackles
   Browsers only allow sound after the visitor interacts, so the context starts on the first
   click/key. The toggle in the corner turns everything on or off (remembered per browser).
   Reduced-motion visitors are not affected; sound is separate and always optional. */
Cafe.sound = (() => {
  const KEY = "cafe-sound";
  let ctx = null, master = null, noise = null;
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) { /* storage blocked: default on */ }

  const init = () => {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
    // two seconds of white noise, reused by every sound
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  };
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn(on));
  const unlock = () => {
    if (!on || !init()) return;
    if (ctx.state === "suspended") ctx.resume().then(notify); else notify();
  };
  ["pointerdown", "keydown", "touchend"].forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
  const ready = () => on && ctx && ctx.state === "running";

  const env = (g, t, a, peak, dur) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };
  const noiseSrc = (t, dur) => {
    const s = ctx.createBufferSource();
    s.buffer = noise; s.loop = true;
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    return s;
  };
  const chain = (...nodes) => { nodes.reduce((a, b) => (a.connect(b), b)); nodes[nodes.length - 1].connect(master); };

  const sounds = {
    tap() {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(230, t);
      o.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      env(g, t, 0.004, 0.09, 0.11);
      chain(o, g); o.start(t); o.stop(t + 0.12);
    },
    flip() {
      const t = ctx.currentTime;
      const s = noiseSrc(t, 0.4), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "bandpass"; f.Q.value = 0.9;
      f.frequency.setValueAtTime(900, t);
      f.frequency.exponentialRampToValueAtTime(3800, t + 0.16);
      f.frequency.exponentialRampToValueAtTime(1400, t + 0.36);
      env(g, t, 0.03, 0.22, 0.38);
      chain(s, f, g);
    },
    shutter() {
      const t = ctx.currentTime;
      [0, 0.07].forEach((dt, i) => {
        const s = noiseSrc(t + dt, 0.04), f = ctx.createBiquadFilter(), g = ctx.createGain();
        f.type = "highpass"; f.frequency.value = 2200;
        env(g, t + dt, 0.002, i ? 0.12 : 0.18, 0.04);
        chain(s, f, g);
      });
    },
    pop() {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(520, t);
      o.frequency.exponentialRampToValueAtTime(980, t + 0.07);
      env(g, t, 0.005, 0.07, 0.12);
      chain(o, g); o.start(t); o.stop(t + 0.13);
    },
    chirp() {
      const t = ctx.currentTime;
      [[660, 0], [990, 0.075]].forEach(([f, dt]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, t + dt);
        o.frequency.exponentialRampToValueAtTime(f * 1.12, t + dt + 0.05);
        env(g, t + dt, 0.004, 0.06, 0.09);
        chain(o, g); o.start(t + dt); o.stop(t + dt + 0.1);
      });
    },
    crunch() {
      const t = ctx.currentTime;
      for (let i = 0; i < 7; i++) {
        const at = t + i * 0.028 + Math.random() * 0.02;
        const n = noiseSrc(at, 0.05), f = ctx.createBiquadFilter(), g = ctx.createGain();
        f.type = "bandpass"; f.Q.value = 1.4; f.frequency.value = 1400 + Math.random() * 2600;
        env(g, at, 0.002, 0.16 + Math.random() * 0.12, 0.045 + Math.random() * 0.03);
        chain(n, f, g);
      }
    },
    clink() {
      const t = ctx.currentTime;
      [[2350, 0, 0.07], [3120, 0.012, 0.05], [2600, 0.09, 0.05]].forEach(([f, dt, peak]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(f, t + dt);
        env(g, t + dt, 0.002, peak, 0.35);
        chain(o, g); o.start(t + dt); o.stop(t + dt + 0.4);
      });
    },
    brew(dur = 3.2) {
      const t = ctx.currentTime;
      // pump rumble
      const r = noiseSrc(t, dur), rf = ctx.createBiquadFilter(), rg = ctx.createGain();
      rf.type = "lowpass"; rf.frequency.value = 320;
      rg.gain.setValueAtTime(0.0001, t);
      rg.gain.exponentialRampToValueAtTime(0.32, t + 0.35);
      rg.gain.setValueAtTime(0.32, t + dur - 0.7);
      rg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      chain(r, rf, rg);
      // gurgling bubbles
      for (let i = 0; i < dur * 16; i++) {
        const bt = t + 0.25 + Math.random() * (dur - 0.6);
        const o = ctx.createOscillator(), g = ctx.createGain();
        const f0 = 160 + Math.random() * 380;
        o.type = "sine";
        o.frequency.setValueAtTime(f0, bt);
        o.frequency.exponentialRampToValueAtTime(f0 * 1.7, bt + 0.045);
        env(g, bt, 0.004, 0.035 + Math.random() * 0.04, 0.07);
        chain(o, g); o.start(bt); o.stop(bt + 0.08);
      }
      // steam hiss, rising towards the end
      const h = noiseSrc(t, dur), hf = ctx.createBiquadFilter(), hg = ctx.createGain();
      hf.type = "highpass"; hf.frequency.value = 3800;
      hg.gain.setValueAtTime(0.0001, t);
      hg.gain.exponentialRampToValueAtTime(0.012, t + dur * 0.5);
      hg.gain.exponentialRampToValueAtTime(0.06, t + dur - 0.4);
      hg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      chain(h, hf, hg);
    },
  };

  let lastAt = {};
  const play = (name, ...args) => {
    if (!ready() || !sounds[name]) return;
    const now = performance.now();
    if (now - (lastAt[name] || 0) < 70) return; // no machine-gunning on fast hovers
    lastAt[name] = now;
    sounds[name](...args);
  };
  const set = (v) => {
    on = v;
    try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (e) { /* ignore */ }
    if (v) unlock(); else if (ctx) ctx.suspend();
    notify();
  };
  return { play, set, isOn: () => on, isLive: () => ready(), onChange: (fn) => listeners.add(fn) };
})();

/* The toggle: a small round button in the bottom-left corner. */
Cafe.register("sound", {
  render() {
    return `<button type="button" class="sound-toggle" aria-pressed="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="sound-toggle__waves" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="sound-toggle__off" d="M16 9.5l5 5M21 9.5l-5 5"/>
      </svg>
      <span class="sound-toggle__label">Sound on</span>
    </button>`;
  },
  init(root) {
    const btn = root.querySelector(".sound-toggle");
    // before the first click the browser keeps audio locked: invite a tap instead
    const sync = (on) => {
      const waiting = on && !Cafe.sound.isLive();
      btn.setAttribute("aria-pressed", String(on));
      btn.classList.toggle("is-waiting", waiting);
      btn.querySelector(".sound-toggle__label").textContent = waiting ? "Tap for café sounds" : on ? "Sound on" : "Sound off";
    };
    sync(Cafe.sound.isOn());
    Cafe.sound.onChange(sync);
    // the window-level unlock runs after this (bubbling), so note the state first
    let wasWaiting = false;
    btn.addEventListener("pointerdown", () => { wasWaiting = btn.classList.contains("is-waiting"); });
    btn.addEventListener("click", () => {
      if (wasWaiting || btn.classList.contains("is-waiting")) { wasWaiting = false; sync(true); setTimeout(() => Cafe.sound.play("pop"), 80); return; }
      Cafe.sound.set(!Cafe.sound.isOn());
      if (Cafe.sound.isOn()) setTimeout(() => Cafe.sound.play("pop"), 80);
    });
  },
});
