"use strict";

(() => {
  const pfpButton = document.getElementById("pfpButton");
  const pfp = document.getElementById("pfp");
  const picker = document.getElementById("picker");
  const closePicker = document.getElementById("closePicker");
  const bannerWrap = document.getElementById("bannerWrap");
  const banner = document.getElementById("banner");
  const links = document.querySelectorAll(".link-card");

  //
  // PROFILE PICKER
  //
  pfpButton.addEventListener("click", () => {
    picker.showModal();
  });

  closePicker.addEventListener("click", () => {
    picker.close();
  });

  picker.addEventListener("click", (event) => {
    if (event.target === picker) picker.close();
  });

  document.querySelectorAll(".profile-option").forEach((option) => {
    option.addEventListener("click", () => {
      const src = option.dataset.src;
      if (!src) return;

      pfp.src = src;

      document.querySelectorAll(".profile-option").forEach((item) => {
        item.classList.remove("active");
      });
      option.classList.add("active");

      pfp.animate(
        [
          { transform: "scale(.82) rotate(-5deg)", opacity: 0.5 },
          { transform: "scale(1.08) rotate(2deg)", opacity: 1 },
          { transform: "scale(1) rotate(0deg)" },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(.2,.8,.2,1)",
        },
      );

      picker.close();
    });
  });

  //
  // BANNER PARALLAX
  // Desktop only; intentionally subtle so it doesn't feel gimmicky.
  //
  if (window.matchMedia("(pointer:fine)").matches) {
    bannerWrap.addEventListener("pointermove", (event) => {
      const rect = bannerWrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      banner.style.transform = `scale(1.11) translate(${x * 8}px, ${y * 5}px)`;
    });

    bannerWrap.addEventListener("pointerleave", () => {
      banner.style.transform = "scale(1.08) translate(0, 0)";
    });
  }

  //
  // TINY BUTTON TILT
  // Gives each link a physical/card-like feel without going crazy.
  //
  links.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      if (!window.matchMedia("(pointer:fine)").matches) return;

      const rect = link.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const tilt = x * 1.8;

      link.style.setProperty("--tilt", `${tilt}deg`);
    });

    link.addEventListener("pointerleave", () => {
      link.style.setProperty("--tilt", "0deg");
    });
  });

  //
  // LITTLE RANDOMIZED SPARKLE BURST WHEN THE PAGE LOADS
  //
  window.addEventListener("load", () => {
    const colors = ["#ffad8a", "#ffd166", "#9ed8ff", "#c8b6ff", "#9fe6b8"];

    for (let i = 0; i < 9; i++) {
      const dot = document.createElement("span");
      dot.textContent = i % 2 ? "✦" : "•";
      dot.style.position = "fixed";
      dot.style.left = `${10 + Math.random() * 80}%`;
      dot.style.top = `${8 + Math.random() * 84}%`;
      dot.style.color = colors[i % colors.length];
      dot.style.fontSize = `${7 + Math.random() * 8}px`;
      dot.style.pointerEvents = "none";
      dot.style.zIndex = "0";
      dot.style.opacity = "0";
      document.body.appendChild(dot);

      dot
        .animate(
          [
            { opacity: 0, transform: "translateY(10px) scale(.5)" },
            { opacity: 0.65, transform: "translateY(0) scale(1)" },
            { opacity: 0, transform: "translateY(-18px) scale(.7)" },
          ],
          {
            duration: 1800 + Math.random() * 1800,
            delay: Math.random() * 900,
            easing: "ease-out",
          },
        )
        .finished.then(() => dot.remove());
    }
  });

  //
  // ===== CUTE & CHAOTIC EXTRAS =====
  //
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Name: split into letters so each one can wave
  const nameEl = document.getElementById("name");
  nameEl.setAttribute("aria-label", nameEl.textContent);
  nameEl.innerHTML = [...nameEl.textContent]
    .map((c, i) => `<span aria-hidden="true" style="--i:${i}">${c}</span>`)
    .join("");

  // Emoji that keep floating upwards
  const floaters = document.getElementById("floaters");
  const stuff = [
    "🐺",
    "🍓",
    "🍎",
    "🍃",
    "🌸",
    "⭐",
    "💖",
    "🎵",
    "☁️",
    "🫧",
    "🌱",
    "✨",
    "🍵",
    "🍫",
  ];
  function floaty() {
    if (reduce || document.hidden) return;
    const s = document.createElement("span");
    s.textContent = pick(stuff);
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 14 + Math.random() * 22 + "px";
    s.style.setProperty("--dx", (Math.random() - 0.5) * 160 + "px");
    s.style.setProperty("--rot", (Math.random() - 0.5) * 360 + "deg");
    s.style.animationDuration = 9 + Math.random() * 8 + "s";
    floaters.appendChild(s);
    setTimeout(() => s.remove(), 17500);
  }
  setInterval(floaty, 700);
  for (let i = 0; i < 6; i++) setTimeout(floaty, i * 250);

  // Emoji burst
  const bursts = ["💖", "✨", "⭐", "🍓", "🌸", "🎉", "🐾", "💫", "🍎"];
  function burst(x, y, n = 12) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "burst";
      b.textContent = pick(bursts);
      b.style.left = x + "px";
      b.style.top = y + "px";
      document.body.appendChild(b);
      const a = Math.random() * Math.PI * 2,
        d = 60 + Math.random() * 110;
      b.animate(
        [
          { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 30}px)) scale(1.2) rotate(${Math.random() * 300}deg)`,
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 90}px)) scale(.4)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: "cubic-bezier(.2,.8,.3,1)",
        },
      ).finished.then(() => b.remove());
    }
  }
  addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY, 8));
  links.forEach((l) =>
    l.addEventListener("click", (e) => burst(e.clientX, e.clientY, 18)),
  );

  // Cursor trail
  let lastTrail = 0;
  addEventListener("pointermove", (e) => {
    if (
      reduce ||
      e.pointerType === "touch" ||
      performance.now() - lastTrail < 45
    )
      return;
    lastTrail = performance.now();
    const t = document.createElement("span");
    t.className = "trail";
    t.textContent = pick(["✦", "♡", "·", "✧"]);
    t.style.left = e.clientX + "px";
    t.style.top = e.clientY + "px";
    t.style.color = pick([
      "#ffad8a",
      "#ffd166",
      "#9ed8ff",
      "#c8b6ff",
      "#ff8fb8",
    ]);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 800);
  });

  // Speech bubble + boop
  const bubble = document.getElementById("bubble");
  const pfpWrap = document.querySelector(".pfp-wrap");
  const lines = [
    "halo! 🐺",
    "awoooo~",
    "sudah minum air?",
    "aku bukan serigala… mungkin",
    "pssst, klik aku",
    "lagi nyiram stroberi 🍓",
    "boop!",
    "jangan lupa istirahat ☁️",
    "apel hari ini manis 🍎",
    "uwu.exe running",
    "kamu lucu, serius",
  ];
  let li = 0;
  function say(t) {
    bubble.textContent = t;
    bubble.style.animation = "none";
    bubble.offsetWidth;
    bubble.style.animation = "";
  }
  setInterval(() => say(lines[++li % lines.length]), 3600);
  pfpButton.addEventListener("pointerdown", () => {
    pfpWrap.classList.remove("boop");
    pfpWrap.offsetWidth;
    pfpWrap.classList.add("boop");
    say(pick(["boop!", "eek!", "hehe geli", "aww 💖", "awooo!"]));
  });

  // Click the name 5x = emoji rain
  let nameClicks = 0;
  nameEl.addEventListener("click", () => {
    if (++nameClicks % 5) return;
    say("HUJAN STROBERI 🍓🍓");
    for (let i = 0; i < 40; i++)
      setTimeout(() => {
        const d = document.createElement("span");
        d.className = "burst";
        d.textContent = pick(["🍓", "🍎", "🍫", "🍃", "💖"]);
        d.style.left = Math.random() * 100 + "vw";
        d.style.top = "-30px";
        d.style.fontSize = 18 + Math.random() * 18 + "px";
        document.body.appendChild(d);
        d.animate(
          [
            { transform: "translateY(0) rotate(0)" },
            {
              transform: `translateY(110vh) rotate(${Math.random() * 720}deg)`,
            },
          ],
          {
            duration: 1800 + Math.random() * 1400,
            easing: "cubic-bezier(.4,0,.8,.6)",
          },
        ).finished.then(() => d.remove());
      }, i * 60);
  });

  // Playful tab title while the tab is hidden
  const title = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "hei, balik dong 🥺" : title;
  });

  //
  // ===== COLORFUL + KAWAII EXTRAS =====
  //
  // Tiny blinking face on every link button
  links.forEach((l) => {
    const f = document.createElement("span");
    f.className = "face";
    f.innerHTML = "<i></i><i></i>";
    l.appendChild(f);
  });

  // Little critters running along the bottom
  const crit = document.createElement("div");
  crit.className = "critters";
  document.body.appendChild(crit);
  const cast = ["🐺", "🐰", "🐥", "🐱", "🐸", "🦊", "🐼", "🐹"];
  cast.forEach((e, i) => {
    const c = document.createElement("div");
    c.className = "critter" + (i % 2 ? " back" : "");
    c.style.setProperty("--dur", 14 + Math.random() * 14 + "s");
    c.style.setProperty("--del", -Math.random() * 20 + "s");
    c.innerHTML = `<b>${e}</b>`;
    c.addEventListener("click", (ev) => {
      c.classList.remove("wow");
      c.offsetWidth;
      c.classList.add("wow");
      burst(ev.clientX, ev.clientY, 14);
      say(
        pick([
          "hehe ketangkep!",
          "kyaa~",
          "lari lagi ah 🏃",
          e + " halo!",
          "jangan cubit 🥺",
        ]),
      );
    });
    crit.appendChild(c);
  });

  // Click the banner = sticker appears
  bannerWrap.addEventListener("click", (e) => {
    const r = bannerWrap.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "sticker";
    s.textContent = pick([
      "🌸",
      "⭐",
      "💖",
      "🍓",
      "🐾",
      "🌈",
      "🫧",
      "🍡",
      "🎀",
      "🦋",
    ]);
    s.style.left = e.clientX - r.left - 15 + "px";
    s.style.top = e.clientY - r.top - 15 + "px";
    s.style.setProperty("--r", (Math.random() - 0.5) * 50 + "deg");
    bannerWrap.appendChild(s);
    if (bannerWrap.querySelectorAll(".sticker").length > 14)
      bannerWrap.querySelector(".sticker").remove();
  });

  // Big confetti burst when the page opens
  addEventListener("load", () => {
    setTimeout(() => {
      burst(innerWidth * 0.25, innerHeight * 0.3, 14);
      burst(innerWidth * 0.75, innerHeight * 0.3, 14);
      burst(innerWidth * 0.5, innerHeight * 0.2, 18);
    }, 500);
  });

  // Chips: click = change the bubble text
  document.querySelectorAll(".chip").forEach((c) =>
    c.addEventListener("click", (e) => {
      burst(e.clientX, e.clientY, 10);
      say(c.textContent + "!");
    }),
  );
})();
