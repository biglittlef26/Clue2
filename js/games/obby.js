// Game 2: Hockey Obby Tycoon. Earn cash from pucks, buy upgrades, beat the obstacle course!
const Obby = {
  title: "🏒 Hockey Obby Tycoon",
  W: 2900, FLAG: 2830,
  plats: [[0,260,260],[340,260,120],[540,230,100],[720,200,100],[900,260,100],[1130,260,80],[1290,220,80],
          [1450,260,70],[1640,230,70],[1820,190,70],[2020,230,60],[2250,260,70],[2490,200,60],[2700,260,200]],
  spikes: [[120,248],[390,248],[940,248],[2770,248]],
  checkpoints: [[1130,200],[2250,200]],
  // Cute girl character: ponytail, bow, dress, little shoes
  drawGirl(c, p, face, t) {
    const cx = p.x + 10, y = p.y, walk = p.vx && p.ground ? Math.sin(t / 3) * 3 : 0, air = !p.ground;
    const hair = "#6b3e26", skin = "#ffdcc2", dress = "#ff7eb3";
    // legs + shoes
    c.fillStyle = skin; c.fillRect(cx - 5 + walk, y + 22, 3, air ? 4 : 6); c.fillRect(cx + 2 - walk, y + 22, 3, air ? 4 : 6);
    c.fillStyle = "#ff3d8b"; c.fillRect(cx - 6 + walk, y + 26, 5, 2); c.fillRect(cx + 1 - walk, y + 26, 5, 2);
    // ponytail
    c.fillStyle = hair; c.beginPath(); c.ellipse(cx - face * 10, y + 10 + Math.sin(t / 6) * 2, 4, 7, face * 0.4, 0, 7); c.fill();
    // dress
    c.fillStyle = dress; c.beginPath(); c.moveTo(cx - 5, y + 16); c.lineTo(cx + 5, y + 16); c.lineTo(cx + 10, y + 24); c.lineTo(cx - 10, y + 24); c.fill();
    // head
    c.fillStyle = skin; c.beginPath(); c.arc(cx, y + 9, 9, 0, 7); c.fill();
    c.fillStyle = hair; c.beginPath(); c.arc(cx, y + 8, 9.5, Math.PI, 0); c.fill(); // hair cap
    c.fillRect(cx - 9.5, y + 7, 3, 5); c.fillRect(cx + 6.5, y + 7, 3, 5);          // side hair
    // face
    c.fillStyle = "#3b2230"; [-3, 3].forEach(dx => { c.beginPath(); c.arc(cx + dx + face * 1.5, y + 11, 1.5, 0, 7); c.fill(); });
    c.fillStyle = "#ffb3c6"; [-6, 6].forEach(dx => { c.beginPath(); c.arc(cx + dx + face, y + 14, 1.8, 0, 7); c.fill(); });
    c.strokeStyle = "#c2447a"; c.lineWidth = 1; c.beginPath(); c.arc(cx + face * 1.5, y + 13.5, 2, 0.2, Math.PI - 0.2); c.stroke();
    // bow
    c.fillStyle = "#ff3d8b"; c.beginPath(); c.moveTo(cx - face * 7, y + 2); c.lineTo(cx - face * 12, y - 1); c.lineTo(cx - face * 12, y + 5); c.fill();
    c.beginPath(); c.moveTo(cx - face * 7, y + 2); c.lineTo(cx - face * 2, y - 2); c.lineTo(cx - face * 2, y + 3); c.fill();
  },
  start(root, win) {
    const S = { money: 0, jump: 0, speed: 0, dbl: false, machines: 0 };
    const price = n => [20, 40, 70][n];
    let income;

    const shop = (note = "") => {
      clearInterval(income);
      const btn = (id, label, p, maxed) => `<button data-id="${id}" data-price="${p}" data-max="${maxed ? 1 : 0}" ${maxed || S.money < p ? "disabled" : ""}>${label} ${maxed ? "(MAX)" : "— $" + p}</button>`;
      root.innerHTML = `<h2>${this.title}</h2><p>${note}</p><h3>💰 $<span id="mny">${S.money}</span></h3>
        <p>Grab 🏒 pucks in the obby to earn cash. Spend it on upgrades, then reach the 🚩! Later gaps are too wide without upgrades, and spikes + 3 lives make it tricky.</p>
        ${btn("jump", `⬆️ Jump Boost Lv${S.jump}`, price(S.jump) ?? 0, S.jump >= 3)}
        ${btn("speed", `👟 Speed Lv${S.speed}`, price(S.speed) ?? 0, S.speed >= 3)}
        ${btn("dbl", "🦘 Double Jump", 60, S.dbl)}
        ${btn("mach", `🏭 Puck Machine (+$1/sec) x${S.machines}`, 30 + 15 * S.machines, S.machines >= 5)}
        <br><button id="go">▶ Start run</button>`;
      root.querySelectorAll("button[data-id]").forEach(b => b.onclick = () => {
        const p = +b.dataset.price; S.money -= p;
        ({ jump: () => S.jump++, speed: () => S.speed++, dbl: () => (S.dbl = true), mach: () => S.machines++ })[b.dataset.id]();
        shop(note);
      });
      go.onclick = run;
      income = setInterval(() => { // tycoon passive income
        S.money += S.machines; mny.textContent = S.money;
        root.querySelectorAll("button[data-id]").forEach(b => (b.disabled = b.dataset.max === "1" || S.money < +b.dataset.price));
      }, 1000);
    };

    const run = () => {
      clearInterval(income);
      root.innerHTML = `<canvas id="cv" width="600" height="320" style="width:100%;background:#ffe3ec;border-radius:10px"></canvas>
        <p><small>← → / A D to move · Space / ↑ to jump</small></p><div><button id="tl">◀</button><button id="tj">⤒ Jump</button><button id="tr">▶</button></div>`;
      const ctx = cv.getContext("2d");
      const keys = {}; let jumpQ = false, alive = true, lives = 3, cp = [20, 200], cam = 0, t = 0, face = 1;
      const taken = new Set();
      const coins = [];
      this.plats.forEach((p, i) => {
        coins.push([p[0] + p[2] / 2, p[1] - 30]);
        const n = this.plats[i + 1]; if (n) coins.push([(p[0] + p[2] + n[0]) / 2, Math.min(p[1], n[1]) - 70]);
      });
      coins.forEach((c, i) => c.push(Math.max(16, 36 - i * 2))); // c[2] = puck size: big at the start, smaller later
      const pl = { x: 20, y: 200, w: 20, h: 28, vx: 0, vy: 0, ground: false, jumps: 0 };

      const kd = e => { const k = e.key.toLowerCase();
        if ([" ", "arrowup", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
        if (k === " " || k === "arrowup" || k === "w") { if (!keys.j) jumpQ = true; keys.j = true; }
        if (k === "arrowleft" || k === "a") keys.l = true;
        if (k === "arrowright" || k === "d") keys.r = true; };
      const ku = e => { const k = e.key.toLowerCase();
        if (k === " " || k === "arrowup" || k === "w") keys.j = false;
        if (k === "arrowleft" || k === "a") keys.l = false;
        if (k === "arrowright" || k === "d") keys.r = false; };
      addEventListener("keydown", kd); addEventListener("keyup", ku);
      const hold = (el, k) => { el.onpointerdown = () => (keys[k] = true); el.onpointerup = el.onpointerleave = () => (keys[k] = false); };
      hold(tl, "l"); hold(tr, "r"); tj.onpointerdown = () => (jumpQ = true);

      const finish = won => {
        alive = false; removeEventListener("keydown", kd); removeEventListener("keyup", ku);
        if (won) { root.innerHTML = `<h2 class="good">Course complete! 🚩🎉</h2>`; setTimeout(win, 1500); }
        else shop("💀 Out of lives! You kept your cash. Upgrade and try again.");
      };
      const die = () => { lives--; if (lives <= 0) return finish(false); Object.assign(pl, { x: cp[0], y: cp[1], vx: 0, vy: 0 }); };
      const hit = (a, b) => a.x < b[0] + b[2] && a.x + a.w > b[0] && a.y < b[1] + b[3] && a.y + a.h > b[1];

      const frame = () => {
        if (!alive) return;
        t++;
        const sp = 2.6 + 0.5 * S.speed, jv = 9.5 + S.jump;
        pl.vx = ((keys.r ? 1 : 0) - (keys.l ? 1 : 0)) * sp;
        if (pl.vx) face = pl.vx > 0 ? 1 : -1;
        if (!pl.ground && pl.jumps === 0) pl.jumps = 1;
        if (jumpQ && pl.jumps < (S.dbl ? 2 : 1)) { pl.vy = -jv * (pl.jumps ? 0.9 : 1); pl.jumps++; pl.ground = false; }
        jumpQ = false;
        pl.x += pl.vx;
        this.plats.forEach(p => { const r = [p[0], p[1], p[2], 80]; if (hit(pl, r)) pl.x = pl.vx > 0 ? r[0] - pl.w : r[0] + r[2]; });
        pl.vy += 0.5; pl.y += pl.vy; pl.ground = false;
        this.plats.forEach(p => { const r = [p[0], p[1], p[2], 80]; if (hit(pl, r)) {
          if (pl.vy > 0) { pl.y = r[1] - pl.h; pl.vy = 0; pl.ground = true; pl.jumps = 0; } else { pl.y = r[1] + r[3]; pl.vy = 0; } } });
        if (pl.x < 0) pl.x = 0;
        this.checkpoints.forEach(c => { if (pl.x > c[0] && cp[0] < c[0]) cp = [c[0] + 5, c[1]]; });
        if (pl.y > 340 || this.spikes.some(s => hit(pl, [s[0], s[1], 20, 12]))) die();
        coins.forEach((c, i) => { if (!taken.has(i) && Math.abs(pl.x + 10 - c[0]) < 12 + c[2] / 2 && Math.abs(pl.y + 14 - c[1]) < 16 + c[2] / 2) { taken.add(i); S.money += 5; } });
        if (pl.x + pl.w >= this.FLAG) return finish(true);

        cam = Math.max(0, Math.min(pl.x - 200, this.W - 600));
        ctx.clearRect(0, 0, 600, 320); ctx.save(); ctx.translate(-cam, 0);
        ctx.fillStyle = "#c2447a"; this.plats.forEach(p => ctx.fillRect(p[0], p[1], p[2], 80));
        ctx.fillStyle = "#ffd1e3"; this.plats.forEach(p => ctx.fillRect(p[0], p[1], p[2], 6));
        ctx.fillStyle = "#6a1b9a"; this.spikes.forEach(s => { ctx.beginPath(); ctx.moveTo(s[0], s[1] + 12); ctx.lineTo(s[0] + 10, s[1]); ctx.lineTo(s[0] + 20, s[1] + 12); ctx.fill(); });
        coins.forEach((c, i) => { if (taken.has(i)) return; // draw hockey pucks
          const r = c[2] / 2, y = c[1] + Math.sin((t + i * 9) / 12) * 2;
          ctx.fillStyle = "#111"; ctx.beginPath(); ctx.ellipse(c[0], y + r * 0.25, r, r * 0.55, 0, 0, 7); ctx.fill();
          ctx.fillStyle = "#3a3a3a"; ctx.beginPath(); ctx.ellipse(c[0], y, r, r * 0.55, 0, 0, 7); ctx.fill();
          ctx.strokeStyle = "#ff9ec7"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(c[0], y, r * 0.7, r * 0.35, 0, 0, 7); ctx.stroke(); });
        ctx.font = "32px sans-serif"; ctx.fillText("🚩", this.FLAG - 10, 258);
        this.drawGirl(ctx, pl, face, t);
        ctx.restore();
        ctx.fillStyle = "#000"; ctx.font = "bold 16px sans-serif";
        ctx.fillText(`❤️ ${lives}   💰 $${S.money}   ${Math.round(pl.x / this.FLAG * 100)}%`, 10, 24);
        requestAnimationFrame(frame);
      };
      frame();
    };
    shop("Welcome to the obby!");
  }
};