// Game 2: Character quiz. Pass with 4/5. Edit the questions to match what you know!
const Trivia = {
  title: "🏒 Briar Trivia",
  passMark: 4,
  questions: [
    { q: "What sport do the Briar guys play?", a: ["Hockey", "Soccer", "Baseball"], c: 0 },
    { q: "What is Hannah's big passion?", a: ["Music", "Boxing", "Chemistry"], c: 0 },
    { q: "Which university do they attend?", a: ["Briar", "Harvard", "Yale"], c: 0 },
    { q: "Who plays hockey with Garrett?", a: ["Dean", "Taylor Swift", "Santa"], c: 0 },
    { q: "Which of these is a character in the series?", a: ["Tucker", "Sherlock", "Gandalf"], c: 0 }
  ],
  start(root, win) {
    let i = 0, score = 0;
    const show = () => {
      if (i === this.questions.length) {
        if (score >= this.passMark) { root.innerHTML = `<h2 class="good">You passed ${score}/${this.questions.length}!</h2>`; return setTimeout(win, 1500); }
        root.innerHTML = `<h2 class="bad">${score}/${this.questions.length}. Need ${this.passMark}.</h2><button id="r">Try again</button>`;
        return (r.onclick = () => { i = 0; score = 0; show(); });
      }
      const { q, a, c } = this.questions[i];
      // shuffle answers
      const opts = a.map((t, idx) => ({ t, ok: idx === c })).sort(() => Math.random() - .5);
      root.innerHTML = `<h2>${this.title}</h2><p>Question ${i + 1}/${this.questions.length}</p><h3>${q}</h3>
        <div class="opts">${opts.map((o, k) => `<button data-k="${k}">${o.t}</button>`).join("")}</div>`;
      root.querySelectorAll("button").forEach(b => b.onclick = () => { if (opts[b.dataset.k].ok) score++; i++; show(); });
    };
    show();
  }
};
