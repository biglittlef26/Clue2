// Background music: a cute looping tune made with the Web Audio API (no audio files needed).
const Music = (() => {
    let ac, master, timer, step = 0, nextTime = 0, muted = false, started = false, btn;
    const eighth = 60 / 100 / 2; // 100 bpm
    const chords = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]]; // C Am F G
    const melody = [
      [659.25, 0, 783.99, 0, 880, 0, 783.99, 0],
      [880, 0, 783.99, 0, 659.25, 0, 0, 587.33],
      [880, 0, 783.99, 0, 880, 0, 1046.5, 0],
      [783.99, 0, 587.33, 0, 783.99, 0, 0, 0]
    ];
    function note(f, t, d, type, vol) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.05);
    }
    function schedule() {
      while (nextTime < ac.currentTime + 0.4) {
        const bar = Math.floor(step / 8) % 4, s = step % 8, ch = chords[bar];
        note(ch[[0, 1, 2, 1, 0, 1, 2, 1][s]] * 2, nextTime, eighth * 1.6, "triangle", 0.5);
        if (s === 0 || s === 4) note(ch[0] / 2, nextTime, eighth * 3, "sine", 0.7);
        if (melody[bar][s]) note(melody[bar][s], nextTime, eighth * 2, "sine", 0.45);
        nextTime += eighth; step++;
      }
    }
    function makeButton() {
      btn = document.createElement("button");
      btn.textContent = "🔊";
      btn.title = "Music on/off";
      btn.setAttribute("style", "position:fixed;top:12px;right:12px;width:46px;height:46px;padding:0;font-size:1.3rem;z-index:10");
      btn.onclick = () => { muted = !muted; master.gain.value = muted ? 0 : 0.12; btn.textContent = muted ? "🔇" : "🔊"; btn.blur(); };
      document.body.appendChild(btn);
    }
    return {
      // Call from a click (browsers block audio until the person interacts)
      start() {
        if (started) return;
        try {
          ac = new (window.AudioContext || window.webkitAudioContext)();
          master = ac.createGain(); master.gain.value = 0.12; master.connect(ac.destination);
          nextTime = ac.currentTime + 0.1; started = true;
          timer = setInterval(schedule, 100); makeButton();
        } catch (e) { console.warn("Music unavailable", e); }
      }
    };
  })();