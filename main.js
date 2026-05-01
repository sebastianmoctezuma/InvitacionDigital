/* ══════════════════════════════════════
   OVERLAY Y MÚSICA
══════════════════════════════════════ */
(function () {
  const overlay = document.getElementById('welcome-overlay');
  const openBtn = document.getElementById('open-invite-btn');
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');

  // Asegurar volumen suave
  bgMusic.volume = 0.5;

  openBtn.addEventListener('click', () => {
    // 1. Añadir clase open para iniciar la animación 3D del sobre
    openBtn.classList.add('open');

    // 2. Esperar a que la tarjeta salga del sobre antes de ocultar todo
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      musicBtn.classList.remove('hidden');

      bgMusic.play().then(() => {
        musicBtn.classList.add('playing');
      }).catch(err => {
        console.log('Esperando MP3 válido o interacción: ', err);
      });
    }, 1200); // 1.2 segundos de delay
  });

  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.add('playing');
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
    }
  });
})();

/* ══════════════════════════════════════
   PARTICLE BACKGROUND
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(201,168,76,', 'rgba(240,208,128,', 'rgba(139,105,20,'];

  function randomParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random(),
      va: (Math.random() - 0.5) * 0.007,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  for (let i = 0; i < 130; i++) particles.push(randomParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
    grad.addColorStop(0, 'rgba(61,0,18,1)');
    grad.addColorStop(0.5, 'rgba(32,0,8,1)');
    grad.addColorStop(1, 'rgba(14,0,4,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const t = Date.now() * 0.00025;
    const sweep = ctx.createRadialGradient(
      W * (0.5 + 0.28 * Math.sin(t)),
      H * (0.5 + 0.18 * Math.cos(t * 0.75)),
      0, W * 0.5, H * 0.5, W * 0.65
    );
    sweep.addColorStop(0, 'rgba(201,168,76,0.08)');
    sweep.addColorStop(0.5, 'rgba(201,168,76,0.02)');
    sweep.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

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
  const ctx = canvas.getContext('2d');
  let W, H, sparks = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 4; i++) {
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5 - 1,
        r: Math.random() * 3 + 0.5,
        life: 1,
        decay: Math.random() * 0.04 + 0.02
      });
    }
  });

  function drawSparks() {
    ctx.clearRect(0, 0, W, H);
    sparks = sparks.filter(s => s.life > 0);
    sparks.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.06; s.life -= s.decay;
      const r = s.r * s.life;
      if (r <= 0) return;          // evita radio negativo → IndexSizeError
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.life * 0.85})`;
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
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = Math.random() * 9 + 5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size * 1.7}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 14}s;
    `;
    layer.appendChild(p);
  }
})();

/* ══════════════════════════════════════
   TEXT SPLIT — PALABRAS (word-reveal)
══════════════════════════════════════ */
(function () {
  document.querySelectorAll('.word-reveal').forEach(el => {
    // Guardar el HTML original con <br> intactos
    const html = el.innerHTML;
    // Separar por <br/> o <br>
    const lines = html.split(/<br\s*\/?>/gi);
    let wordIndex = 0;

    const result = lines.map(line => {
      // Quita tags HTML extras como <strong> pero preserva el texto
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = line;
      const text = tempDiv.textContent || '';

      return text.split(/(\s+)/).map(part => {
        if (/^\s+$/.test(part)) return part; // espacios simples
        if (!part.trim()) return '';
        const delay = (wordIndex++ * 0.08).toFixed(2);
        return `<span class="word"><span class="word-inner" style="--wd:${delay}s">${part}</span></span>`;
      }).join('');
    }).join('<br/>');

    el.innerHTML = result;
  });
})();

/* ══════════════════════════════════════
   TEXT SPLIT — CARACTERES (char-reveal)
══════════════════════════════════════ */
(function () {
  document.querySelectorAll('.char-reveal').forEach(el => {
    const text = el.textContent;
    let html = '';
    [...text].forEach((char, i) => {
      if (char === ' ') {
        html += ' ';
      } else {
        const delay = (i * 0.045).toFixed(3);
        html += `<span class="char" style="--cd:${delay}s">${char}</span>`;
      }
    });
    el.innerHTML = html;
  });
})();

/* ══════════════════════════════════════
   SCROLL REVEAL — INTERSECTION OBSERVER
══════════════════════════════════════ */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  // También observar word-reveal y char-reveal que estén fuera de .reveal
  document.querySelectorAll('.word-reveal, .char-reveal').forEach(el => {
    if (!el.closest('.reveal')) observer.observe(el);
  });
})();

/* ══════════════════════════════════════
   PARALLAX HERO
══════════════════════════════════════ */
(function () {
  const frame = document.querySelector('.photo-frame');
  if (!frame) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const scale = Math.max(0.88, 1 - y * 0.00018);
    const opacity = Math.max(0, 1 - y * 0.0014);
    frame.style.transform = `scale(${scale})`;
    frame.style.opacity = opacity;
  }, { passive: true });
})();

/* ══════════════════════════════════════
   LIVE COUNTDOWN — 30 Mayo 2026, 7:00 PM
══════════════════════════════════════ */
(function () {
  const target = new Date('2026-05-30T19:00:00').getTime();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  const section = document.getElementById('countdown-section');

  function pad(n) { return String(n).padStart(2, '0'); }

  function flash(el, val) {
    if (el.textContent !== val) {
      el.classList.add('flip');
      setTimeout(() => el.classList.remove('flip'), 280);
    }
    el.textContent = val;
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      [elDays, elHours, elMins, elSecs].forEach(e => e.textContent = '00');
      section.classList.add('celebrate');
      return;
    }
    flash(elDays, pad(Math.floor(diff / 86400000)));
    flash(elHours, pad(Math.floor((diff % 86400000) / 3600000)));
    flash(elMins, pad(Math.floor((diff % 3600000) / 60000)));
    flash(elSecs, pad(Math.floor((diff % 60000) / 1000)));
  }

  tick();
  setInterval(tick, 1000);
})();