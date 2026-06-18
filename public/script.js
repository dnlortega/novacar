// ---- Proteção de conteúdo ----
(function protect() {
  // Aviso no console
  const s = [
    'color:#D4A017;font-size:16px;font-weight:bold',
    'color:#888;font-size:12px',
  ];
  console.log('%c⚙ NovaCar Studio Automotivo', s[0]);
  console.log('%c© 2026 Desenvolvido por Daniel Ortega — linkedin.com/in/daniel-op\nA cópia deste código sem autorização é proibida.', s[1]);

  // Desabilita botão direito
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Bloqueia atalhos de desenvolvedor e salvar
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;

    // F12
    if (e.key === 'F12') { e.preventDefault(); return; }

    // Ctrl+U (ver código-fonte), Ctrl+S (salvar página)
    if (ctrl && (e.key === 'u' || e.key === 'U' ||
                 e.key === 's' || e.key === 'S')) {
      e.preventDefault(); return;
    }

    // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspecionar)
    if (ctrl && e.shiftKey && (
      e.key === 'i' || e.key === 'I' ||
      e.key === 'j' || e.key === 'J' ||
      e.key === 'c' || e.key === 'C'
    )) { e.preventDefault(); return; }
  });

  // Desabilita drag de imagens e elementos
  document.addEventListener('dragstart', e => {
    if (e.target.tagName !== 'INPUT') e.preventDefault();
  });
})();

// ---- Preloader ----
window.addEventListener('load', () => {
  const pl = document.getElementById('preloader');
  if (pl) setTimeout(() => pl.classList.add('hidden'), 400);
});

// ---- Footer year ----
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Voltar ao topo
  const btt = document.getElementById('back-to-top');
  if (btt) {
    if (window.scrollY > 400) btt.removeAttribute('hidden');
    else btt.setAttribute('hidden', '');
  }
}, { passive: true });

// ---- Mobile menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ---- Voltar ao topo ----
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Counter animation ----
function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ---- Skill bars ----
function triggerSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.pct + '%';
  });
}

// ---- Intersection Observer ----
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (el.classList.contains('card') || el.classList.contains('testimonial-card') || el.classList.contains('price-card')) {
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      scrollObserver.unobserve(el);
    }

    if (el.classList.contains('hero-stats')) {
      el.querySelectorAll('.counter').forEach(c => animateCounter(c, Number(c.dataset.target)));
      const fill   = el.querySelector('.gauge-fill');
      const needle = el.querySelector('.gauge-needle');
      if (fill)   setTimeout(() => fill.classList.add('animated'),   100);
      if (needle) setTimeout(() => needle.classList.add('animated'), 100);
      scrollObserver.unobserve(el);
    }

    if (el.classList.contains('skill-bars')) {
      triggerSkillBars(el);
      scrollObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .testimonial-card, .price-card, .cert-card').forEach(c => scrollObserver.observe(c));
document.querySelector('.hero-stats') && scrollObserver.observe(document.querySelector('.hero-stats'));
document.querySelector('.skill-bars')  && scrollObserver.observe(document.querySelector('.skill-bars'));

// ---- Reveal lateral / section-header / info-items / form ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal], .section-header, .info-item, .agendamento-form').forEach(el => {
  revealObserver.observe(el);
});

// ---- FAQ accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Formulário → WhatsApp ----
document.getElementById('agendamento-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form    = e.target;
  const nome    = form.nome.value.trim();
  const tel     = form.tel.value.trim();
  const servico = form.servico.value;
  const msg     = form.msg.value.trim();

  // Validação básica
  let valid = true;
  [form.nome, form.tel].forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    } else {
      field.classList.remove('error');
    }
  });
  if (!valid) return;

  const texto = [
    `Olá! Gostaria de agendar um serviço na NovaCar Studio Automotivo.`,
    `*Nome:* ${nome}`,
    `*Telefone:* ${tel}`,
    `*Serviço:* ${servico}`,
    msg ? `*Mensagem:* ${msg}` : ''
  ].filter(Boolean).join('\n');

  // Salva no banco (silencioso — não bloqueia o WA)
  fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nome, phone: tel, service: servico, message: msg }),
  }).catch(() => {});

  window.open(`https://wa.me/5514998231408?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
});

// Remove erro ao digitar
document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ---- LGPD ----
(function initLGPD() {
  if (localStorage.getItem('lgpd')) return;
  const bar = document.getElementById('lgpd-bar');
  if (!bar) return;
  bar.removeAttribute('hidden');

  function dismissLGPD(val) {
    localStorage.setItem('lgpd', val);
    bar.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bar.style.opacity = '0';
    bar.style.transform = 'translateY(100%)';
    setTimeout(() => { bar.style.display = 'none'; }, 320);
  }

  document.getElementById('lgpd-accept')?.addEventListener('click', () => dismissLGPD('accepted'));
  document.getElementById('lgpd-decline')?.addEventListener('click', () => dismissLGPD('declined'));
})();

// ---- Active nav highlight ----
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'var(--white)' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObs.observe(s));

// ---- Scroll Progress Bar ----
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ---- Custom Cursor (apenas desktop) ----
if (window.matchMedia('(hover: hover)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.innerHTML = `<svg viewBox="0 0 24 24" fill="rgba(212,160,23,0.7)" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6zm8.5-3a8.5 8.5 0 01-.1 1.3l2.1 1.6-2 3.5-2.4-.9a8 8 0 01-2.3 1.3l-.3 2.5h-4l-.4-2.5a8 8 0 01-2.2-1.3l-2.5.9-2-3.5 2.1-1.6A8.5 8.5 0 013.5 12a8.5 8.5 0 01.1-1.3L1.5 9.1l2-3.5 2.4.9A8 8 0 018.2 5.2L8.5 2.7h4l.4 2.5a8 8 0 012.2 1.3l2.5-.9 2 3.5-2.1 1.6A8.5 8.5 0 0120.5 12z"/>
  </svg>`;
  document.body.appendChild(cursor);
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function animCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7) rotate(45deg)');
  document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)');
}

// ---- Typewriter no hero ----
(function initTypewriter() {
  const el = document.querySelector('.hero-content p');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  el.classList.add('typewriter');
  let i = 0;
  function type() {
    if (i < text.length) { el.textContent = text.slice(0, ++i); requestAnimationFrame(() => setTimeout(type, 28)); }
    else el.classList.remove('typewriter');
  }
  setTimeout(type, 1200);
})();

// ---- Hero Spark Particles ----
(function initHeroSparks() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    s.className = 'hero-spark';
    const size = (1.5 + Math.random() * 3).toFixed(1);
    s.style.cssText = [
      `left:${(Math.random() * 96).toFixed(1)}%`,
      `top:${(15 + Math.random() * 72).toFixed(1)}%`,
      `width:${size}px`,
      `height:${size}px`,
      `animation-delay:${(Math.random() * 7).toFixed(2)}s`,
      `animation-duration:${(2.8 + Math.random() * 4.5).toFixed(1)}s`,
    ].join(';');
    hero.appendChild(s);
  }
})();

// ---- Exhaust Puffs no carro ----
(function initExhaustPuffs() {
  const strip = document.querySelector('.car-strip');
  if (!strip || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 4; i++) {
    const puff = document.createElement('span');
    puff.className = 'car-exhaust';
    const size = 8 + i * 4;
    puff.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `bottom:${42 + i * 4}px`,
      `left:${8 + i * 3}px`,
      `animation-duration:${1.4 + i * 0.3}s`,
      `animation-delay:${i * 0.35}s`,
    ].join(';');
    strip.appendChild(puff);
  }
})();

// ---- Counter: dispara 'done' no fim ----
(function patchCounter() {
  const orig = window.animateCounter;
  if (!orig) return;
  window.animateCounter = function(el, target, duration) {
    orig(el, target, duration);
    setTimeout(() => el.classList.add('done'), (duration || 1800) + 50);
  };
})();

// ---- Exit Intent Popup ----
(function initExitIntent() {
  if (sessionStorage.getItem('exit-shown')) return;
  const popup = document.createElement('div');
  popup.id = 'exit-popup';
  popup.setAttribute('hidden', '');
  popup.innerHTML = `
    <div class="exit-popup-box">
      <button class="exit-popup-close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="exit-popup-icon">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      </div>
      <span class="exit-popup-badge">⚡ OFERTA EXCLUSIVA</span>
      <h3>Avaliação Gratuita<br/>do seu veículo</h3>
      <p>Diagnóstico completo + orçamento detalhado <strong>sem custo</strong> e sem compromisso. Profissionais certificados.</p>
      <div class="exit-popup-trust">
        <span class="exit-stars">★★★★★</span>
        <span>+500 clientes atendidos em Bauru</span>
      </div>
      <a href="https://wa.me/5514998231408?text=Olá!%20Vi%20a%20oferta%20no%20site%20e%20quero%20agendar%20minha%20avaliação%20gratuita."
         target="_blank" rel="noopener noreferrer" class="exit-popup-cta">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Quero minha avaliação grátis
      </a>
      <button class="exit-popup-dismiss exit-popup-close">Não, obrigado</button>
    </div>`;
  document.body.appendChild(popup);

  function show() {
    if (sessionStorage.getItem('exit-shown')) return;
    sessionStorage.setItem('exit-shown', '1');
    popup.removeAttribute('hidden');
  }
  function hide() { popup.setAttribute('hidden', ''); }
  popup.querySelectorAll('.exit-popup-close').forEach(b => b.addEventListener('click', hide));
  popup.addEventListener('click', e => { if (e.target === popup) hide(); });

  // Desktop: mouse sai pelo topo
  document.addEventListener('mouseleave', e => { if (e.clientY < 10) show(); });
  // Mobile: usuário ficou 45s sem interagir
  let idleTimer = setTimeout(show, 45000);
  ['touchstart','scroll','click'].forEach(ev =>
    document.addEventListener(ev, () => { clearTimeout(idleTimer); idleTimer = setTimeout(show, 45000); }, { passive: true, once: false })
  );
})();

// ---- 3D Tilt nos cards de serviço ----
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${(-y * 8).toFixed(1)}deg) rotateY(${(x * 8).toFixed(1)}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ---- Auto-save formulário no localStorage ----
(function initFormSave() {
  const form = document.getElementById('agendamento-form');
  if (!form) return;
  const fields = ['f-nome', 'f-tel', 'f-servico', 'f-msg'];
  // Restaura
  fields.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem('nc_form_' + id);
    if (el && saved) el.value = saved;
  });
  // Salva ao digitar
  fields.forEach(id => {
    document.getElementById(id)?.addEventListener('input', e => {
      localStorage.setItem('nc_form_' + id, e.target.value);
    });
  });
  // Limpa após envio
  form.addEventListener('submit', () => {
    fields.forEach(id => localStorage.removeItem('nc_form_' + id));
  });
})();

// ---- Tema Claro/Escuro ----
(function initTheme() {
  const saved = localStorage.getItem('nc_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nc_theme', next);

    // Mini spin feedback
    btn.style.transform = 'rotate(360deg) scale(1.15)';
    setTimeout(() => { btn.style.transform = ''; }, 350);
  });
})();

// ---- Parallax nas engrenagens do hero ----
(function initParallax() {
  const g1 = document.querySelector('.gear-1');
  const g2 = document.querySelector('.gear-2');
  const g3 = document.querySelector('.gear-3');
  if (!g1 && !g2 && !g3) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (g1) g1.style.translate = '0 ' + (y * 0.07).toFixed(1) + 'px';
    if (g2) g2.style.translate = '0 ' + (y * -0.04).toFixed(1) + 'px';
    if (g3) g3.style.translate = '0 ' + (y * 0.11).toFixed(1) + 'px';
  }, { passive: true });
})();

// ---- Smooth scroll sem hash na URL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  });
});
