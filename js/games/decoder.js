// Game 1: Name Decoder. Find the Nth letter of each name. Together they spell SMITH.
const Decoder = {
  title: "🔤 Name Decoder",
  // [character name, which letter to grab (spaces ignored)]. Edit freely!
  rounds: [["Jensen", 4], ["Summer", 3], ["Dean Di Laurentiis", 6], ["Tucker", 1], ["Hannah", 1]],
  start(root, win) {
    let i = 0, found = "";
    const show = () => {
      if (i === this.rounds.length) {
        root.innerHTML = `<h2>Decoded!</h2><div class="letters good">${found}</div>`;
        return setTimeout(win, 1500);
      }
      const [name, n] = this.rounds[i];
      root.innerHTML = `<h2>${this.title}</h2>
        <p>Decode round ${i + 1}/${this.rounds.length}</p>
        <p>Take letter <b>#${n}</b> of <b>${name}</b> (ignore spaces).</p>
        <div class="letters">${found.padEnd(this.rounds.length, "_")}</div>
        <input id="ans" maxlength="1" autofocus><button id="ok">Submit</button><p id="msg"></p>`;
      const check = () => {
        const want = name.replace(/\s/g, "")[n - 1].toUpperCase();
        if (ans.value.toUpperCase() === want) { found += want; i++; show(); }
        else msg.innerHTML = '<span class="bad">Nope, count again!</span>';
      };
      ok.onclick = check;
      ans.onkeydown = e => e.key === "Enter" && check();
    };
    show();
  }
};
