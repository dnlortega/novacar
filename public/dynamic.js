// Registra service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Carrega conteúdo dinâmico do banco quando o servidor está rodando.
// Se o servidor não estiver ativo, o HTML estático permanece intacto.
(async function loadDynamic() {
  let data;
  try {
    const r = await fetch('/api/public', { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return;
    data = await r.json();
  } catch {
    return; // servidor offline — mantém HTML estático
  }

  const ICONS = {
    'icon-gear':   'M12 15a3 3 0 100-6 3 3 0 000 6zm8.5-3a8.5 8.5 0 01-.1 1.3l2.1 1.6-2 3.5-2.4-.9a8 8 0 01-2.3 1.3l-.3 2.5h-4l-.4-2.5a8 8 0 01-2.2-1.3l-2.5.9-2-3.5 2.1-1.6A8.5 8.5 0 013.5 12a8.5 8.5 0 01.1-1.3L1.5 9.1l2-3.5 2.4.9A8 8 0 018.2 5.2L8.5 2.7h4l.4 2.5a8 8 0 012.2 1.3l2.5-.9 2 3.5-2.1 1.6A8.5 8.5 0 0120.5 12z',
    'icon-brake':  'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-6a4 4 0 110-8 4 4 0 010 8z',
    'icon-tune':   'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    'icon-engine': 'M7 4v2H4v5h3v1H2v2h2v2h2v2h3v-2h6v2h3v-2h2v-2h2v-2h-5v-1h3V6h-3V4H7zm1 2h8v2h1v5h-1.5v-1h-7v1H8V8H7V6h1z',
    'icon-bolt':   'M13 2L4.09 13H11L10 22l9.91-11H14L13 2z',
    'icon-ac':     'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 4-8 4 0-3 3.5-5 8-5-4.5-1-8.5 2.5-8 6C8 7 6 11.5 4 13c4-2.5 7.5-3 10-5l3 .5z',
    'icon-wrench': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
    'icon-piston': 'M9 3h6v4H9zm-2 4h10v2H7zm-3 2h16v2H4zm3 2h10v8H7z',
    'icon-oil':    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z',
    'icon-gauge':  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-3.84 2.73-7.04 6.36-7.78L12 8l1.64-3.78C17.27 4.96 20 8.16 20 12c0 4.42-3.58 8-8 8zm-1-3l1-2 1 2-1 1-1-1z',
  };

  function svgIcon(id) {
    const d = ICONS[id] || ICONS['icon-wrench'];
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  function starsSVG(n) {
    return Array.from({ length: n }, () =>
      `<svg viewBox="0 0 24 24" class="star" aria-hidden="true"><use href="#icon-star"/></svg>`
    ).join('');
  }

  // ── Serviços ────────────────────────────────────────────────────────────────
  const svcGrid = document.getElementById('services-grid');
  if (svcGrid && data.services?.length) {
    svcGrid.innerHTML = data.services.map((s, i) => {
      const isElec = s.icon === 'icon-bolt';
      return `
        <article class="card" data-delay="${i * 100}">
          <div class="card-icon${isElec ? ' card-icon-electric' : ''}">
            ${svgIcon(s.icon)}
            ${isElec ? '<span class="electric-arc" aria-hidden="true"></span>' : ''}
          </div>
          <h3>${s.name}</h3>
          <p>${s.description}</p>
        </article>`;
    }).join('');
    // Re-observa os novos cards
    svcGrid.querySelectorAll('.card').forEach(c => scrollObserver?.observe(c));
  }

  // ── Preços ──────────────────────────────────────────────────────────────────
  const prcGrid = document.getElementById('pricing-grid');
  if (prcGrid && data.pricing?.length) {
    const wa = data.config?.whatsapp || '5514998231408';
    prcGrid.innerHTML = data.pricing.map((p, i) => {
      const feats = Array.isArray(p.features)
        ? p.features
        : (typeof p.features === 'string' ? JSON.parse(p.features || '[]') : []);
      const isFeat = p.featured;
      const waText = encodeURIComponent(`Olá! Quero saber mais sobre ${p.name}.`);
      return `
        <div class="price-card${isFeat ? ' price-featured' : ''}" data-delay="${i * 150}">
          ${p.badge ? `<div class="price-badge-top">${p.badge}</div>` : ''}
          <div class="price-icon">${svgIcon(p.icon)}</div>
          <h3>${p.name}</h3>
          <ul class="price-list">${feats.map(f => `<li>${f}</li>`).join('')}</ul>
          <div class="price-footer">
            <div class="price-value"><span>a partir de</span><strong>${p.price}</strong></div>
            <a href="https://wa.me/${wa}?text=${waText}" target="_blank" rel="noopener noreferrer"
               class="btn ${isFeat ? 'btn-primary' : 'btn-outline'} btn-full">Solicitar Orçamento</a>
          </div>
        </div>`;
    }).join('');
    prcGrid.querySelectorAll('.price-card').forEach(c => scrollObserver?.observe(c));
  }

  // ── Depoimentos ─────────────────────────────────────────────────────────────
  const tstGrid = document.getElementById('testimonials-grid');
  if (tstGrid && data.testimonials?.length) {
    tstGrid.innerHTML = data.testimonials.map((t, i) => `
      <article class="testimonial-card" data-delay="${i * 150}">
        <div class="t-quote" aria-hidden="true">
          <svg viewBox="0 0 24 24"><use href="#icon-quote"/></svg>
        </div>
        <p class="t-text">"${t.text}"</p>
        <div class="t-footer">
          <div class="t-stars" aria-label="${t.rating} estrelas">${starsSVG(t.rating)}</div>
          <div class="t-author">
            <strong>${t.author}</strong>
            <span>${t.car}</span>
          </div>
        </div>
      </article>`).join('');
    tstGrid.querySelectorAll('.testimonial-card').forEach(c => scrollObserver?.observe(c));
  }

  // ── FAQ ─────────────────────────────────────────────────────────────────────
  const faqList = document.getElementById('faq-list');
  if (faqList && data.faq?.length) {
    faqList.innerHTML = data.faq.map(f => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          ${f.question}
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer"><p>${f.answer}</p></div>
      </div>`).join('');

    // Reinicializa o accordion para os itens novos
    faqList.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        faqList.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ── Config: telefone, horários, endereço ────────────────────────────────────
  if (data.config) {
    const c = data.config;
    const wa = c.whatsapp || '5514998231408';

    // Telefone no contato
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
      if (a.href.includes('wa.me/551') || a.href.match(/wa\.me\/\d+$/)) {
        a.href = `https://wa.me/${wa}`;
        if (a.textContent.match(/\(\d{2}\)/)) a.textContent = c.phone || a.textContent;
      }
    });

    // Horário
    const hoursEl = document.querySelector('[itemprop="openingHours"]');
    if (hoursEl && c.hours_weekdays) hoursEl.textContent = c.hours_weekdays;
  }
})();
