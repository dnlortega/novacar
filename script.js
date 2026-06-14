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

  document.getElementById('lgpd-accept')?.addEventListener('click', () => {
    localStorage.setItem('lgpd', 'accepted');
    bar.setAttribute('hidden', '');
  });
  document.getElementById('lgpd-decline')?.addEventListener('click', () => {
    localStorage.setItem('lgpd', 'declined');
    bar.setAttribute('hidden', '');
  });
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
