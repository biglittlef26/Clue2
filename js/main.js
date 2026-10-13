const app = document.getElementById("app");
const games = [Decoder, Obby, Cooking];
const earned = []; // indexes of won games

function intro() {
  app.innerHTML = `<h1>🏒 Off Campus: Clue Quest</h1><p class="intro">${CONFIG.intro}</p><button id="go">Let's play!</button>`;
  go.onclick = () => { Music.start(); menu(); };
}

function menu() {
  if (earned.length === games.length) return finalGuess();
  const next = earned.length; // games unlock in order
  app.innerHTML = `<h2>Pick a minigame</h2>
    ${games.map((g, i) => `<button data-i="${i}" ${i !== next ? "disabled" : ""}>${earned.includes(i) ? "✅ " : i > next ? "🔒 " : ""}${g.title}</button>`).join("<br>")}
    <h3>Your clues</h3>${earned.map(i => `<div class="clue">🔎 ${CONFIG.clues[i]}</div>`).join("") || "<p>None yet. Win a game!</p>"}
    <p><small>${CONFIG.contactMessage}</small></p>`;
  app.querySelectorAll("button[data-i]").forEach(b => b.onclick = () => play(+b.dataset.i));
}

function play(i) {
  games[i].start(app, () => {
    earned.push(i);
    app.innerHTML = `<h2 class="good">Level cleared! 🎉</h2><p>Here's your clue:</p><div class="clue">🔎 ${CONFIG.clues[i]}</div><button id="c">Continue</button>`;
    c.onclick = menu;
  });
}

function finalGuess() {
  app.innerHTML = `<h2>Two truths and a lie!</h2><p>Which clue is the LIE?</p><div class="opts">
    ${CONFIG.clues.map((c, i) => `<button data-i="${i}">${c}</button>`).join("")}</div><p id="res"></p>`;
  app.querySelectorAll("button").forEach(b => b.onclick = () => {
    res.innerHTML = +b.dataset.i === CONFIG.lieIndex
      ? '<span class="good">🎉 Correct! You spotted the lie!</span>'
      : '<span class="bad">Hmm, not that one. Try again!</span>';
  });
}

intro();