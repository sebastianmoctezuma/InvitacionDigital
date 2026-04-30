/* ══════════════════════════════════════
   PARTICLE BACKGROUND
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(201,168,76,', 'rgba(240,208,128,', 'rgba(139,105,20,'];

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random(),
      va: (Math.random() - 0.5) * 0.008,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  for (let i = 0; i < 120; i++) particles.push(randomParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Radial gradient base
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.75);
    grad.addColorStop(0,   'rgba(20,14,2,1)');
    grad.addColorStop(0.5, 'rgba(10,8,4,1)');
    grad.addColorStop(1,   'rgba(2,2,2,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Gold nebula sweeps
    const t = Date.now() * 0.0003;
    const sweep = ctx.createRadialGradient(
      W * (0.5 + 0.3 * Math.sin(t)),
      H * (0.5 + 0.2 * Math.cos(t * 0.7)),
      0,
      W * 0.5, H * 0.5, W * 0.6
    );
    sweep.addColorStop(0,   'rgba(201,168,76,0.07)');
    sweep.addColorStop(0.5, 'rgba(201,168,76,0.02)');
    sweep.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a += p.va;
      if (p.a > 1 || p.a < 0) p.va *= -1;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.a + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════
   SPARKLE CURSOR
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('sparkle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, sparks = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        r: Math.random() * 3 + 1,
        life: 1,
        decay: Math.random() * 0.04 + 0.02
      });
    }
  });

  function drawSparks() {
    ctx.clearRect(0, 0, W, H);
    sparks = sparks.filter(s => s.life > 0);
    sparks.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.life -= s.decay;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.life * 0.8})`;
      ctx.fill();
    });
    requestAnimationFrame(drawSparks);
  }
  drawSparks();
})();

/* ══════════════════════════════════════
   FALLING PETALS
══════════════════════════════════════ */
(function () {
  const layer = document.getElementById('petals');
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = Math.random() * 8 + 5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size * 1.7}px;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: 0;
      transform: rotate(${Math.random()*360}deg);
    `;
    layer.appendChild(p);
  }
})();

/* ══════════════════════════════════════
   LIVE COUNTDOWN  – 30 Mayo 2026, 7:00 PM
══════════════════════════════════════ */
(function () {
  const target = new Date('2026-05-30T19:00:00').getTime();

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');
  const section = document.getElementById('countdown-section');

  function pad(n) { return String(n).padStart(2, '0'); }

  function flash(el, val) {
    const old = el.textContent;
    if (old !== val) {
      el.classList.add('flip');
      setTimeout(() => el.classList.remove('flip'), 300);
    }
    el.textContent = val;
  }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      section.classList.add('celebrate');
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    flash(elDays,  pad(days));
    flash(elHours, pad(hours));
    flash(elMins,  pad(mins));
    flash(elSecs,  pad(secs));
  }

  tick();
  setInterval(tick, 1000);
})();
