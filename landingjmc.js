// ─── CANVAS PARTICLES ───
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor(W * H / 12000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.7 ? 280 : 190
    });
  }
}
initParticles();

let mx = W/2, my = H/2;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function drawFrame() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const dx = mx - p.x, dy = my - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 120) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mx, my);
      ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${(1 - dist/120) * 0.08})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    for (let j = i+1; j < particles.length; j++) {
      const q = particles[j];
      const ex = p.x - q.x, ey = p.y - q.y;
      const ed = Math.sqrt(ex*ex + ey*ey);
      if (ed < 90) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${(1 - ed/90) * 0.06})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawFrame);
}
drawFrame();

// ─── TYPING EFFECT ───
const roles = [
  'fullstack engineer',
  'llm architect',
  'ml engineer',
  'dba specialist',
  'iot developer',
  'quantum enthusiast'
];
let ri = 0, ci = 0, deleting = false;
const el = document.getElementById('typed-text');
function type() {
  const word = roles[ri];
  if (!deleting) {
    el.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ─── INTERSECTION OBSERVER ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // animate bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.val + '%';
      });
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-card, .spoiler-card').forEach(el => observer.observe(el));

