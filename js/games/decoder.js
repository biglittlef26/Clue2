// Game 1: Name Decoder. Solve 5 puzzles. The answers spell SMITH.
const Decoder = {
  title: "🔤 Name Decoder",
  // q = puzzle (HTML ok), a = one-letter answer, hint = optional help. Edit freely!
  rounds: [
    { q: "Write <b>HANNAH WELLS</b> backwards. What's the <b>first</b> letter you write?",
      a: "S", hint: "Start from the very end of her last name." },
    { q: "Sort the letters of <b>GRAHAM</b> (Garrett's last name) from A to Z. Which letter is <b>second-to-last</b>?",
      a: "M", hint: "The sorted order starts: A, A, G, H ..." },
    { q: "In <b>LAURENTIIS</b> (Dean's last name), exactly one letter appears <b>twice</b>. Which one?",
      a: "I", hint: "The repeat is near the end of the name." },
    { q: "🔐 Cipher time! A letter was shifted <b>forward 3</b> places in the alphabet and now reads <b>W</b>. What was the original letter?",
      a: "T", hint: "Count back 3 from W: W → V → U → ?" },
    { q: "Count the letters in <b>GARRETT</b>, add <b>1</b>, then turn that number into a letter (A=1, B=2, C=3...).",
      a: "H", hint: "Count the name first, then count through the alphabet." }
  ],
  start(root, win) {
    let i = 0, found = "";
    const show = (msg = "", showHint = false) => {
      if (i === this.rounds.length) {
        root.innerHTML = `<h2>Decoded! 💖</h2><div class="letters good">${found}</div>`;
        return setTimeout(win, 1500);
      }
      const r = this.rounds[i];
      root.innerHTML = `<h2>${this.title}</h2>
        <p>Puzzle ${i + 1}/${this.rounds.length}</p>
        <div class="clue">${r.q}</div>
        <div class="letters">${found.padEnd(this.rounds.length, "_")}</div>
        <input id="ans" maxlength="3" autocomplete="off"><button id="ok" type="button">Submit</button>
        <button id="hint" type="button">💡 Hint</button>
        <p id="msg">${showHint ? "💡 " + r.hint : msg}</p>`;
      const input = root.querySelector("#ans");
      input.focus();
      const check = () => {
        const typed = input.value.trim().toUpperCase();
        if (typed === r.a) { found += r.a; i++; show(); }
        else show(`<span class="bad">"${typed || "?"}" isn't right. Try again!</span>`);
      };
      root.querySelector("#ok").addEventListener("click", check);
      root.querySelector("#hint").addEventListener("click", () => show("", true));
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    };
    show();
  }
};