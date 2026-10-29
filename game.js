(() => {
  const $ = id => document.getElementById(id);
  const arena = $('arena'), targets = $('targets');
  const scoreEl = $('score'), bestEl = $('best'), timeEl = $('time');
  const statusPill = $('statusPill'), intro = $('intro'), endPanel = $('endPanel');
  const countdownEl = $('countdown'), feedback = $('feedback');
  let score = 0, best = 0, timeLeft = 30, playing = false, soundOn = true;
  let spawnTimer = null, clockTimer = null, feedbackTimer = null, audioCtx = null;
  let targetId = 0, misses = 0;
  try { best = Number(localStorage.getItem('pulsoNeonBest') || 0); } catch {}
  bestEl.textContent = best;

  function tone(freq=600, duration=.07, type='sine') {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = type; osc.frequency.value = freq; gain.gain.value = .045;
      osc.connect(gain); gain.connect(audioCtx.destination);
      gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
      osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }
  function setFeedback(text, color) {
    feedback.textContent = text;
    feedback.style.color = color;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedback.textContent = '', 500);
  }
  function updateScore(delta) {
    score = Math.max(0, score + delta);
    scoreEl.textContent = score;
  }
  function clearTargets() { targets.replaceChildren(); }
  function spawnTarget() {
    if (!playing) return;
    const rect = arena.getBoundingClientRect();
    const size = Math.max(42, 57 - Math.floor(score / 50));
    const bad = Math.random() < Math.min(.28, .12 + score / 500);
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'target ' + (bad ? 'bad' : 'good');
    el.setAttribute('aria-label', bad ? 'Objetivo rojo: no tocar' : 'Objetivo verde: tocar');
    el.style.width = size + 'px'; el.style.height = size + 'px';
    const margin = size / 2 + 8;
    el.style.left = (margin + Math.random() * Math.max(1, rect.width - margin * 2)) + 'px';
    el.style.top = (margin + Math.random() * Math.max(1, rect.height - margin * 2)) + 'px';
    el.dataset.id = ++targetId;
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (!playing || !el.isConnected) return;
      if (bad) {
        updateScore(-15); setFeedback('−15', '#ff4f78'); tone(180,.12,'sawtooth');
      } else {
        updateScore(10); setFeedback('+10', '#b8ff4d'); tone(700 + Math.min(score,500),.06,'triangle');
      }
      el.remove();
      // Tapping the wrong target still ends only that target, keeping the round going.
      scheduleSpawn();
    }, { once: true });
    targets.appendChild(el);
    // Targets disappear if ignored.
    const lifespan = Math.max(620, 1450 - score * 2);
    el._expire = setTimeout(() => {
      if (el.isConnected) {
        el.remove();
        if (playing) { misses++; updateScore(-2); setFeedback('¡Se escapó! −2', '#ffc857'); }
        scheduleSpawn();
      }
    }, lifespan);
  }
  let nextSpawn = null;
  function scheduleSpawn() {
    clearTimeout(nextSpawn);
    if (!playing) return;
    const delay = Math.max(240, 650 - score * 2);
    nextSpawn = setTimeout(() => {
      if (playing && targets.childElementCount < 2) spawnTarget();
      scheduleSpawn();
    }, delay);
  }
  function reset() {
    score = 0; misses = 0; timeLeft = 30;
    scoreEl.textContent = '0'; timeEl.textContent = timeLeft;
    clearTargets(); endPanel.classList.add('hidden'); intro.classList.add('hidden');
    countdownEl.classList.remove('hidden');
    let count = 3; countdownEl.textContent = count; tone(440,.08);
    const countTimer = setInterval(() => {
      count--;
      if (count > 0) { countdownEl.textContent = count; tone(440 + count*70,.08); }
      else {
        clearInterval(countTimer); countdownEl.classList.add('hidden');
        startRound();
      }
    }, 650);
  }
  function startRound() {
    playing = true; statusPill.textContent = '¡EN JUEGO!'; statusPill.style.color = '#b8ff4d';
    spawnTarget(); scheduleSpawn();
    clockTimer = setInterval(() => {
      timeLeft--; timeEl.textContent = timeLeft;
      if (timeLeft <= 0) finish();
    }, 1000);
  }
  function finish() {
    playing = false; clearInterval(clockTimer); clearTimeout(nextSpawn);
    targets.querySelectorAll('.target').forEach(el => { if (el._expire) clearTimeout(el._expire); });
    clearTargets(); timeLeft = Math.max(0, timeLeft); timeEl.textContent = timeLeft;
    statusPill.textContent = 'RONDA TERMINADA'; statusPill.style.color = '#a4a5c4';
    if (score > best) {
      best = score; bestEl.textContent = best;
      try { localStorage.setItem('pulsoNeonBest', String(best)); } catch {}
      $('endTitle').textContent = '¡Nuevo récord!';
      $('endMessage').textContent = 'Has superado tu mejor puntuación. ¿Una más?';
      tone(880,.2,'triangle');
    } else {
      $('endTitle').textContent = score >= 100 ? '¡Muy buena ronda!' : '¡Buen intento!';
      $('endMessage').textContent = '¿Puedes superar tu récord de ' + best + ' puntos?';
    }
    $('finalScore').textContent = score;
    endPanel.classList.remove('hidden');
  }
  $('startBtn').addEventListener('click', reset);
  $('againBtn').addEventListener('click', reset);
  $('soundBtn').addEventListener('click', () => {
    soundOn = !soundOn; $('soundBtn').textContent = soundOn ? '🔊' : '🔇';
    $('soundBtn').setAttribute('aria-label', soundOn ? 'Desactivar sonido' : 'Activar sonido');
    if (soundOn) tone(600,.06);
  });
  $('shareBtn').addEventListener('click', async () => {
    const text = `He conseguido ${score} puntos en Pulso Neon. ¿Puedes superarme?`;
    try {
      if (navigator.share) await navigator.share({ title: 'Pulso Neon', text });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(text); setFeedback('¡Resultado copiado!', '#5de8ff'); }
      else setFeedback(text, '#5de8ff');
    } catch {}
  });
  // Prevent the browser from selecting the game while tapping quickly.
  arena.addEventListener('contextmenu', e => e.preventDefault());
  $('startBtn').focus({preventScroll:true});
})();