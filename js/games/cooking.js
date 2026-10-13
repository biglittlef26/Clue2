// Game 3: Cooking Mama style. Help Tucker make mozzarella sticks!
const Cooking = {
  title: "🧀 Tucker's Kitchen",
  steps: [
    { type: "tap", n: 6, emoji: "🧀", text: "Unwrap & cut the cheese: tap 6 times!" },
    { type: "tap", n: 5, emoji: "🌾", text: "Roll the sticks in flour: tap 5 times!" },
    { type: "tap", n: 4, emoji: "🥚", text: "Dip in egg: tap 4 times!" },
    { type: "tap", n: 7, emoji: "🍞", text: "Coat in breadcrumbs: tap 7 times!" },
    { type: "timing", text: "Fry them! Hit the button when the marker is in the GREEN zone." }
  ],
  start(root, win) {
    let s = 0, count = 0, timer;
    const show = () => {
      clearInterval(timer);
      if (s === this.steps.length) {
        root.innerHTML = `<h2 class="good">Order up! 🎉</h2><p>Tucker's mozzarella sticks are perfect.</p><div class="big">🧀🍢</div>`;
        return setTimeout(win, 1800);
      }
      const st = this.steps[s];
      root.innerHTML = `<h2>${this.title}</h2><p>Step ${s + 1}/${this.steps.length}</p><p>${st.text}</p>`;
      if (st.type === "tap") {
        count = 0;
        root.insertAdjacentHTML("beforeend", `<div class="bar"><div class="fill" id="f"></div></div><button class="big" id="b">${st.emoji}</button>`);
        b.onclick = () => { count++; f.style.width = (count / st.n * 100) + "%"; if (count >= st.n) { s++; setTimeout(show, 300); } };
      } else {
        root.insertAdjacentHTML("beforeend", `<div class="bar"><div class="zone"></div><div class="marker" id="m"></div></div><button id="b">🍳 Pull out!</button><p id="msg"></p>`);
        let pos = 0, dir = 1;
        timer = setInterval(() => { pos += dir * 2; if (pos >= 100 || pos <= 0) dir *= -1; m.style.left = `calc(${pos}% - 3px)`; }, 25);
        b.onclick = () => {
          if (pos >= 40 && pos <= 60) { s++; show(); }
          else { clearInterval(timer); msg.innerHTML = `<span class="bad">${pos < 40 ? "Still raw!" : "Burnt!"} Try again.</span>`; setTimeout(show, 900); }
        };
      }
    };
    show();
  }
};
