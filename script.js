/* ============================================================
   script.js – Mechanical Tech Business Interactive Logic
   ============================================================ */

// ===========================
// 1. PARTICLE CANVAS
// ===========================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 80;
  const COLORS = ['rgba(0, 229, 255, 0.7)', 'rgba(255, 215, 0, 0.5)', 'rgba(122, 162, 200, 0.6)'];

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.6 + 0.2,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===========================
// 2. NAVBAR SCROLL EFFECT
// ===========================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

// ===========================
// 3. TYPED TEXT ANIMATION
// ===========================
(function initTyped() {
  const phrases = [
    '數位商管跨領域人才',
    '商業經營愛好者',
    '電子商務探索者',
    '智慧科技追求者',
    '南山高中學生',
  ];
  const el = document.getElementById('typed-text');
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 100);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 50);
    }
  }
  tick();
})();

// ===========================
// 4. STAT COUNTER ANIMATION
// ===========================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let triggered = false;

  function animateCounter(el, target, duration = 2000) {
    const start = Date.now();
    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          animateCounter(counter, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();

// ===========================
// 5. SKILL BAR ANIMATION
// ===========================
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();

// ===========================
// 6. FADE IN ON SCROLL
// ===========================
(function initFadeIn() {
  const elements = document.querySelectorAll(
    '.about-card, .about-main, .about-desc-box, .skill-card, .passion-card, .vision-banner, .contact-info, .contact-terminal'
  );

  elements.forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
})();

// ===========================
// 7. ACTIVE NAV LINK
// ===========================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--cyan)';
      }
    });
  });
})();

// ===========================
// 8. SMOOTH NAV CLICK
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===========================
// 9. CONTACT FORM
// ===========================
function sendMessage() {
  const name = document.getElementById('msg-name').value.trim();
  const content = document.getElementById('msg-content').value.trim();
  const btn = document.getElementById('send-msg-btn');
  const success = document.getElementById('msg-success');

  if (!name || !content) {
    btn.style.background = 'linear-gradient(135deg, #ff3860, #cc0033)';
    btn.querySelector('span').textContent = '> 請填寫所有欄位';
    setTimeout(() => {
      btn.style.background = '';
      btn.querySelector('span').textContent = '> 發送訊息';
    }, 2000);
    return;
  }

  btn.style.background = 'linear-gradient(135deg, #00ff9d, #00aa66)';
  btn.querySelector('span').textContent = '> 發送中...';

  setTimeout(() => {
    document.getElementById('msg-name').value = '';
    document.getElementById('msg-content').value = '';
    btn.style.background = '';
    btn.querySelector('span').textContent = '> 發送訊息';
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  }, 1200);
}

// ===========================
// 10. GEAR PARALLAX
// ===========================
(function initParallax() {
  window.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 20;
    const my = (e.clientY / window.innerHeight - 0.5) * 20;
    const avatarWrapper = document.querySelector('.hero-avatar-wrapper');
    if (avatarWrapper) {
      avatarWrapper.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
    }
  });
})();

// ===========================
// 11. SECTION ENTRY ANIMATIONS
// ===========================
(function initSectionHeadings() {
  const headings = document.querySelectorAll('.section-heading');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'heading-slide-in 0.7s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Inject keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heading-slide-in {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  headings.forEach(h => {
    h.style.opacity = '0';
    observer.observe(h);
  });
})();
