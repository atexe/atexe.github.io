(function() {
  const canvas = document.getElementById('c');
  const ctx    = canvas.getContext('2d');
  const wrap   = document.getElementById('canvas-wrap');
  const overlay      = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlaySub   = document.getElementById('overlay-sub');
  const startBtn     = document.getElementById('start-btn');
  const scoreEl      = document.getElementById('score-display');
  const levelEl      = document.getElementById('level-display');
  const livesEl      = document.getElementById('lives-display');

  let W = 0, H = 0, dpr = 1;
  let score = 0, lives = 3, level = 1;
  let gameState = 'idle'; // idle | playing | dead | win | gameover
  let particles = [];
  let bricks    = [];
  let paddle    = null;
  let ball      = null;

  // Color palettes - one per level
  const PALETTES = [
    ['#ff006e','#ff4d94','#ff8cb4','#ffc2d8','#00f5ff','#8338ec'],
    ['#06d6a0','#00b4d8','#0077b6','#ffbe0b','#f77f00','#e63946'],
    ['#ff6b35','#f7c59f','#06d6a0','#004e89','#1a936f','#c6dabf'],
    ['#8338ec','#3a86ff','#06d6a0','#ffbe0b','#ff006e','#fb5607'],
    ['#f72585','#7209b7','#3a0ca3','#4361ee','#4cc9f0','#ffffff'],
  ];

  // ── UTILITY FUNCTIONS ──────────────────────────────────

  function pWidth() { 
    return Math.min(W * 0.30, 110); 
  }

  function clamp(v, lo, hi) { 
    return v < lo ? lo : v > hi ? hi : v; 
  }

  function canvasX(clientX) {
    return clientX - canvas.getBoundingClientRect().left;
  }

  // ── CANVAS & RESIZE ────────────────────────────────────

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (!W || !H) return;
    
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
    
    if (paddle) {
      paddle.w = pWidth();
      paddle.y = H - 28;
      paddle.x = clamp(paddle.x, paddle.w/2, W - paddle.w/2);
    }
  }

  // ── GAME INITIALIZATION ────────────────────────────────

  function initGame() {
    particles = [];
    paddle = { x: W/2, y: H - 28, w: pWidth(), h: 10 };
    makeBall();
    buildBricks();
    updateHUD();
  }

  function makeBall() {
    const spd = 4.5 + (level - 1) * 0.4;
    ball = {
      x: paddle.x, y: paddle.y - 20,
      r: 7,
      vx: (Math.random() > 0.5 ? 1 : -1) * spd * 0.55,
      vy: -spd,
      attached: true,
      trail: []
    };
  }

  function buildBricks() {
    bricks = [];
    const cols = 7;
    const rows = Math.min(3 + level, 8);
    const margin = 10;
    const gap = 5;
    const bw = (W - margin*2 - gap*(cols-1)) / cols;
    const bh = 16;
    const pal = PALETTES[(level-1) % PALETTES.length];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hp = (level >= 3 && r < 2) ? 2 : 1;
        bricks.push({
          x: margin + c*(bw+gap),
          y: 10 + r*(bh+gap),
          w: bw, h: bh,
          color: pal[r % pal.length],
          hp, maxHp: hp,
          alive: true,
          shake: 0
        });
      }
    }
  }

  function updateHUD() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    livesEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div');
      d.className = 'life-dot' + (i >= lives ? ' dead' : '');
      livesEl.appendChild(d);
    }
  }

  // ── PARTICLES ──────────────────────────────────────────

  function spawnParticles(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x, y, color,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 1,
        decay: 0.04 + Math.random()*0.04,
        r: 2 + Math.random()*3
      });
    }
  }

  function tickParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life -= p.decay;
      p.r *= 0.97;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  // ── DRAWING HELPERS ────────────────────────────────────

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  // ── RENDER FUNCTIONS ───────────────────────────────────

  function drawBg() {
    ctx.fillStyle = '#05020f';
    ctx.fillRect(0, 0, W, H);
    
    // subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.018)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  function drawBricks() {
    bricks.forEach(b => {
      if (!b.alive) return;
      
      const sx = b.shake ? (Math.random()-0.5)*b.shake : 0;
      b.shake = Math.max(0, b.shake - 0.5);
      const alpha = b.hp < b.maxHp ? 0.55 : 1;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = b.color;
      rrect(b.x+sx, b.y, b.w, b.h, 3);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      rrect(b.x+sx+2, b.y+2, b.w-4, 4, 2);
      ctx.fill();
      
      if (b.hp < b.maxHp) {
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(b.x+b.w*0.3, b.y+2);
        ctx.lineTo(b.x+b.w*0.5, b.y+b.h*0.6);
        ctx.lineTo(b.x+b.w*0.7, b.y+4);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawPaddle() {
    if (!paddle) return;
    
    ctx.save();
    const g = ctx.createLinearGradient(paddle.x-paddle.w/2, 0, paddle.x+paddle.w/2, 0);
    g.addColorStop(0, '#8338ec');
    g.addColorStop(0.5, '#00f5ff');
    g.addColorStop(1, '#8338ec');
    ctx.fillStyle = g;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 16;
    rrect(paddle.x-paddle.w/2, paddle.y-paddle.h/2, paddle.w, paddle.h, 5);
    ctx.fill();
    ctx.restore();
  }

  function drawBall() {
    if (!ball) return;
    
    // draw trail
    const tl = ball.trail.length;
    if (tl > 1) {
      ball.trail.forEach((t, i) => {
        const frac = (i+1) / tl;
        const tr = Math.max(0.5, ball.r * frac * 0.8);
        ctx.save();
        ctx.globalAlpha = frac * 0.3;
        ctx.fillStyle = '#00f5ff';
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(t.x, t.y, tr, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
    }
    
    // draw ball
    ctx.save();
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 22;
    const g = ctx.createRadialGradient(ball.x-2, ball.y-2, 1, ball.x, ball.y, ball.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.4, '#00f5ff');
    g.addColorStop(1, '#0050ff');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.r), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ── PHYSICS & GAME LOGIC ───────────────────────────────

  function updateBall() {
    if (!ball || !paddle) return;

    if (ball.attached) {
      ball.x = paddle.x;
      ball.y = paddle.y - 20;
      return;
    }

    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 10) ball.trail.shift();

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collisions
    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + ball.r > W) {
      ball.x = W - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy = Math.abs(ball.vy);
    }

    // Ball fell off screen
    if (ball.y - ball.r > H + 40) {
      lives--;
      updateHUD();
      if (lives <= 0) {
        gameState = 'gameover';
        setOverlay('GAME OVER', 'Score: ' + score, 'RETRY', '#ff006e');
      } else {
        gameState = 'dead';
        setTimeout(() => {
          if (gameState === 'dead') {
            makeBall();
            gameState = 'playing';
          }
        }, 700);
      }
      return;
    }

    // Paddle collision
    const ph = paddle.h / 2;
    if (ball.vy > 0 &&
        ball.x > paddle.x - paddle.w/2 - ball.r &&
        ball.x < paddle.x + paddle.w/2 + ball.r &&
        ball.y + ball.r > paddle.y - ph &&
        ball.y - ball.r < paddle.y + ph) {
      
      ball.y = paddle.y - ph - ball.r;
      const hit = (ball.x - paddle.x) / (paddle.w/2); // -1..1
      const spd = Math.hypot(ball.vx, ball.vy);
      const angle = hit * 65 * Math.PI / 180;
      ball.vx = spd * Math.sin(angle);
      ball.vy = -spd * Math.cos(angle);
      spawnParticles(ball.x, ball.y, '#8338ec', 4);
    }

    // Brick collisions
    let hitOne = false;
    for (const b of bricks) {
      if (!b.alive || hitOne) continue;
      
      if (ball.x+ball.r > b.x && ball.x-ball.r < b.x+b.w &&
          ball.y+ball.r > b.y && ball.y-ball.r < b.y+b.h) {
        
        hitOne = true;
        b.hp--;
        b.shake = 4;
        const cx = b.x + b.w/2;
        const cy = b.y + b.h/2;
        
        if (b.hp <= 0) {
          b.alive = false;
          score += 10 * level;
          updateHUD();
          spawnParticles(cx, cy, b.color, 12);
        } else {
          spawnParticles(cx, cy, b.color, 5);
        }

        // Reflect ball
        const ol = ball.x + ball.r - b.x;
        const or_ = (b.x + b.w) - (ball.x - ball.r);
        const ot = ball.y + ball.r - b.y;
        const ob = (b.y + b.h) - (ball.y - ball.r);
        if (Math.min(ol, or_) < Math.min(ot, ob)) {
          ball.vx *= -1;
        } else {
          ball.vy *= -1;
        }

        // Check if level complete
        if (bricks.every(b => !b.alive)) {
          level++;
          gameState = 'win';
          setTimeout(() => {
            buildBricks();
            makeBall();
            updateHUD();
            setOverlay('LEVEL '+level, 'Clear the bricks!', 'CONTINUE', '#06d6a0');
          }, 400);
        }
      }
    }
  }

  // ── OVERLAY MANAGEMENT ─────────────────────────────────

  function setOverlay(title, sub, btn, color) {
    color = color || '#00f5ff';
    overlayTitle.textContent = title;
    overlayTitle.style.color = color;
    overlayTitle.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    overlaySub.textContent = sub;
    startBtn.textContent = btn;
    overlay.classList.remove('hidden');
  }

  // ── INPUT HANDLING ─────────────────────────────────────

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!paddle) return;
    const x = canvasX(e.touches[0].clientX);
    paddle.x = clamp(x, paddle.w/2, W - paddle.w/2);
    if (gameState === 'playing' && ball && ball.attached) {
      ball.attached = false;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!paddle) return;
    const x = canvasX(e.touches[0].clientX);
    paddle.x = clamp(x, paddle.w/2, W - paddle.w/2);
  }, { passive: false });

  startBtn.addEventListener('click', () => {
    if (gameState === 'idle' || gameState === 'gameover') {
      score = 0;
      lives = 3;
      level = 1;
    }
    overlay.classList.add('hidden');
    initGame();
    gameState = 'playing';
  });

  // ── GAME LOOP ──────────────────────────────────────────

  function loop() {
    try {
      if (W > 0 && H > 0) {
        drawBg();
        drawBricks();
        drawParticles();
        tickParticles();
        drawPaddle();
        
        if (gameState === 'playing') updateBall();
        if (gameState === 'playing' || gameState === 'dead') drawBall();
      }
    } catch(e) {
      console.error('Game loop error:', e);
    }
    requestAnimationFrame(loop);
  }

  // ── INITIALIZATION ─────────────────────────────────────

  window.addEventListener('resize', () => {
    resize();
    if (gameState !== 'idle') initGame();
  });

  resize();
  loop();
})();
