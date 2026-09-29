//
// ===== SOUND EFFECTS (crunchy + kawaii) =====
// Every sound is synthesized with the Web Audio API — no audio files.
// Change the volume with MASTER_VOLUME. Mute with the 🔊 button (top right) or the "M" key.
// Optional add-on: needs the markup from index.html and must load after script.js.
//
(() => {
  "use strict";
  const MASTER_VOLUME = 0.55;

  const $ = (s) => document.querySelector(s);
  const links = document.querySelectorAll(".link-card");
  const pfpButton = $("#pfpButton");
  const pfpWrap = $(".pfp-wrap");
  const bannerWrap = $("#bannerWrap");
  const nameEl = $("#name");
  const crit = $(".critters"); // created by script.js
  const closePicker = $("#closePicker");
  const bubble = $("#bubble");

  // Browsers only allow audio after a user gesture; don't touch AudioContext before that.
  let unlocked = false;
  ["pointerdown", "keydown"].forEach((ev) =>
    addEventListener(
      ev,
      () => {
        unlocked = true;
      },
      { capture: true },
    ),
  );

  const sfx = (() => {
    let ctx, master, noiseBuf;
    let on = true;
    try {
      on = localStorage.getItem("sfx") !== "off";
    } catch (e) {}

    function init() {
      if (ctx) return ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain();
      master.gain.value = MASTER_VOLUME;
      master.connect(comp);
      comp.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return ctx;
    }

    function ready() {
      if (!on || !unlocked || !init()) return false;
      if (ctx.state === "suspended") ctx.resume();
      return true;
    }

    const R = (a, b) => a + Math.random() * (b - a);
    const pent = [0, 2, 4, 7, 9]; // pentatonic = always pleasant
    const note = (i) =>
      523.25 * Math.pow(2, (pent[i % 5] + 12 * Math.floor(i / 5)) / 12);

    // soft tone (sine/triangle) with glide & vibrato
    function tone({
      f = 600,
      f2 = null,
      dur = 0.15,
      type = "sine",
      vol = 0.3,
      delay = 0,
      vib = 0,
    }) {
      const t = ctx.currentTime + delay;
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.85);
      if (vib) {
        const l = ctx.createOscillator(),
          lg = ctx.createGain();
        l.frequency.value = 9;
        lg.gain.value = vib;
        l.connect(lg);
        lg.connect(o.frequency);
        l.start(t);
        l.stop(t + dur + 0.05);
      }
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    // a single tiny "crack" made from noise
    function tick(t, { freq = 2800, q = 1.3, vol = 0.5, dur = 0.03 }) {
      const s = ctx.createBufferSource();
      s.buffer = noiseBuf;
      s.playbackRate.value = R(0.8, 1.4);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = freq * R(0.8, 1.3);
      bp.Q.value = q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      s.connect(bp);
      bp.connect(g);
      g.connect(master);
      s.start(t, R(0, 0.1), dur + 0.02);
    }

    // 🍎 KRUNCH: retakan tajam + serpihan + gedebuk kecil
    function crunch(size = 1) {
      if (!ready()) return;
      let t = ctx.currentTime;
      tick(t, { freq: 4200, q: 2, vol: 0.7 * size, dur: 0.02 });
      const n = Math.round(R(3, 6) * size);
      for (let i = 0; i < n; i++) {
        t += R(0.012, 0.04);
        tick(t, {
          freq: R(1500, 4200),
          q: R(0.8, 2),
          vol: R(0.25, 0.55) * size,
          dur: R(0.02, 0.05),
        });
      }
      tone({ f: 150, f2: 60, dur: 0.09, vol: 0.28 * size });
    }

    // 🫧 cute pop
    function pop(i = 0, v = 0.28) {
      if (!ready()) return;
      const f = note(i);
      tone({ f: f * 0.8, f2: f * 1.5, dur: 0.09, vol: v });
    }

    // cheek boop
    function boop() {
      if (!ready()) return;
      tone({ f: 300, f2: 620, dur: 0.14, type: "triangle", vol: 0.4 });
      tone({
        f: 620,
        f2: 380,
        dur: 0.12,
        type: "triangle",
        vol: 0.3,
        delay: 0.1,
      });
    }

    // tiny animal squeak
    function squeak(p = 1) {
      if (!ready()) return;
      tone({ f: 900 * p, f2: 1800 * p, dur: 0.1, vol: 0.28, vib: 30 });
      tone({ f: 1500 * p, f2: 1100 * p, dur: 0.08, vol: 0.2, delay: 0.09 });
    }

    // awooo~
    function awoo() {
      if (!ready()) return;
      tone({ f: 380, f2: 820, dur: 0.35, vol: 0.28, vib: 14 });
      tone({ f: 820, f2: 620, dur: 0.4, vol: 0.26, vib: 18, delay: 0.3 });
    }

    // ✨ rising sparkle
    function sparkle() {
      if (!ready()) return;
      [0, 2, 4, 6, 8].forEach((n, k) =>
        tone({
          f: note(n + 5),
          dur: 0.16,
          type: "triangle",
          vol: 0.2,
          delay: k * 0.055,
        }),
      );
    }

    // ting ting
    function chime(i = 0) {
      if (!ready()) return;
      tone({ f: note(i + 3), dur: 0.22, type: "triangle", vol: 0.3 });
      tone({
        f: note(i + 5),
        dur: 0.3,
        type: "triangle",
        vol: 0.25,
        delay: 0.09,
      });
    }

    // tiny xylophone on hover
    function xylo(i) {
      if (!ready()) return;
      tone({ f: note(i + 2), dur: 0.12, type: "triangle", vol: 0.16 });
    }

    // 🍓 strawberry rain: nom-nom-nom + happy arpeggio
    function feast() {
      if (!ready()) return;
      for (let i = 0; i < 6; i++) setTimeout(() => crunch(0.8), i * 130);
      [0, 2, 4, 5, 7, 9].forEach((n, k) =>
        tone({
          f: note(n),
          dur: 0.2,
          type: "triangle",
          vol: 0.24,
          delay: 0.1 + k * 0.08,
        }),
      );
    }

    function setOn(v) {
      on = v;
      try {
        localStorage.setItem("sfx", v ? "on" : "off");
      } catch (e) {}
      if (v) {
        ready();
        chime(0);
      }
    }

    return {
      crunch,
      pop,
      boop,
      squeak,
      awoo,
      sparkle,
      chime,
      xylo,
      feast,
      setOn,
      isOn: () => on,
    };
  })();

  // wrap handlers so an audio error can NEVER break the page
  const safe =
    (fn) =>
    (...a) => {
      try {
        fn(...a);
      } catch (e) {}
    };

  //
  // ---- Attach to elements ----
  //
  let hoverT = 0;
  links.forEach((l, i) => {
    l.addEventListener(
      "pointerenter",
      safe(() => {
        if (performance.now() - hoverT < 80) return;
        hoverT = performance.now();
        sfx.xylo(i);
      }),
    );
    l.addEventListener(
      "pointerdown",
      safe(() => {
        sfx.crunch(1.2);
        sfx.pop(i + 3);
      }),
    );
  });

  pfpButton.addEventListener(
    "pointerdown",
    safe(() => {
      sfx.boop();
      setTimeout(() => sfx.squeak(1.2), 120);
    }),
  );
  pfpWrap.addEventListener(
    "pointerenter",
    safe(() => sfx.pop(4, 0.14)),
  );
  bannerWrap.addEventListener(
    "pointerdown",
    safe(() => sfx.sparkle()),
  );
  document.querySelectorAll(".chip").forEach((c, i) =>
    c.addEventListener(
      "pointerdown",
      safe(() => sfx.chime(i)),
    ),
  );

  let nameN = 0;
  nameEl.addEventListener(
    "pointerdown",
    safe(() => {
      nameN++;
      if (nameN % 5 === 0) sfx.feast();
      else sfx.squeak(0.9 + (nameN % 5) * 0.12);
    }),
  );

  crit.addEventListener(
    "pointerdown",
    safe((e) => {
      if (!e.target.closest(".critter")) return;
      sfx.squeak(0.8 + Math.random() * 0.6);
      setTimeout(() => sfx.crunch(0.9), 110);
    }),
  );

  closePicker.addEventListener(
    "pointerdown",
    safe(() => sfx.pop(1)),
  );
  document.querySelectorAll(".profile-option").forEach((o) =>
    o.addEventListener(
      "pointerdown",
      safe(() => sfx.sparkle()),
    ),
  );

  // tap anywhere = small pop (unless the element has its own sound)
  addEventListener(
    "pointerdown",
    safe((e) => {
      if (
        e.target.closest(
          ".link-card,.critter,.pfp-button,.chip,#name,.banner-wrap,.sound-btn,dialog",
        )
      )
        return;
      sfx.pop(Math.floor(Math.random() * 8), 0.2);
    }),
  );

  // clicking the speech bubble = real howl
  bubble.style.pointerEvents = "auto";
  bubble.style.cursor = "pointer";
  bubble.addEventListener(
    "pointerdown",
    safe(() => sfx.awoo()),
  );

  //
  // ---- Mute button ----
  //
  const soundBtn = document.createElement("button");
  soundBtn.className = "sound-btn hint";
  soundBtn.type = "button";
  document.body.appendChild(soundBtn);
  function paintBtn() {
    soundBtn.textContent = sfx.isOn() ? "🔊" : "🔇";
    soundBtn.setAttribute(
      "aria-label",
      sfx.isOn() ? "Matikan suara" : "Nyalakan suara",
    );
    soundBtn.setAttribute("aria-pressed", String(sfx.isOn()));
    soundBtn.classList.toggle("off", !sfx.isOn());
  }
  paintBtn();
  soundBtn.addEventListener("click", () => {
    sfx.setOn(!sfx.isOn());
    paintBtn();
  });
  addEventListener("keydown", (e) => {
    if (
      (e.key === "m" || e.key === "M") &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      sfx.setOn(!sfx.isOn());
      paintBtn();
    }
  });
  // sound is only allowed after the first touch -> stop the pulsing hint
  addEventListener("pointerdown", () => soundBtn.classList.remove("hint"), {
    once: true,
  });
})();
