// Registra service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── Tipos de carro ──────────────────────────────────────────────────────────
const CAR_DEFS = `<defs>
  <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2E3540"/><stop offset="100%" stop-color="#1C2028"/>
  </linearGradient>
  <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3A4250"/><stop offset="100%" stop-color="#2E3540"/>
  </linearGradient>
  <radialGradient id="hlight" cx="100%" cy="50%" r="100%">
    <stop offset="0%" stop-color="rgba(255,255,180,.45)"/><stop offset="100%" stop-color="transparent"/>
  </radialGradient>
</defs>`;

const CAR_WHEELS = `
  <circle cx="54" cy="53" r="13" fill="#111" stroke="rgba(212,160,23,.9)" stroke-width="2"/>
  <g class="wheel-rear">
    <circle cx="54" cy="53" r="8" fill="#1e1e1e" stroke="rgba(212,160,23,.35)" stroke-width="1.5"/>
    <line x1="54" y1="45" x2="54" y2="61" stroke="rgba(212,160,23,.5)" stroke-width="1"/>
    <line x1="46" y1="53" x2="62" y2="53" stroke="rgba(212,160,23,.5)" stroke-width="1"/>
    <line x1="48.3" y1="47.3" x2="59.7" y2="58.7" stroke="rgba(212,160,23,.35)" stroke-width=".8"/>
    <line x1="59.7" y1="47.3" x2="48.3" y2="58.7" stroke="rgba(212,160,23,.35)" stroke-width=".8"/>
    <circle cx="54" cy="53" r="2.5" fill="rgba(212,160,23,.8)"/>
  </g>
  <circle cx="158" cy="53" r="13" fill="#111" stroke="rgba(212,160,23,.9)" stroke-width="2"/>
  <g class="wheel-front">
    <circle cx="158" cy="53" r="8" fill="#1e1e1e" stroke="rgba(212,160,23,.35)" stroke-width="1.5"/>
    <line x1="158" y1="45" x2="158" y2="61" stroke="rgba(212,160,23,.5)" stroke-width="1"/>
    <line x1="150" y1="53" x2="166" y2="53" stroke="rgba(212,160,23,.5)" stroke-width="1"/>
    <line x1="152.3" y1="47.3" x2="163.7" y2="58.7" stroke="rgba(212,160,23,.35)" stroke-width=".8"/>
    <line x1="163.7" y1="47.3" x2="152.3" y2="58.7" stroke="rgba(212,160,23,.35)" stroke-width=".8"/>
    <circle cx="158" cy="53" r="2.5" fill="rgba(212,160,23,.8)"/>
  </g>`;

const CARS = {
  sedan: CAR_DEFS + `
    <path d="M198 32 L248 16 L248 52 L198 44 Z" fill="url(#hlight)" opacity=".7"/>
    <path d="M22 50 L188 50 L186 52 L24 52 Z" fill="rgba(0,0,0,.4)"/>
    <path d="M18 50 L18 36 Q18 32 22 30 L52 20 Q60 14 76 13 L144 13 Q158 14 166 20 L186 30 Q190 32 192 36 L192 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.95)" stroke-width="1.5"/>
    <path d="M57 28 L80 14 L140 14 L162 28 Z" fill="url(#roofGrad)" stroke="rgba(212,160,23,.3)" stroke-width=".8"/>
    <path d="M61 27 L80 16 L140 16 L158 27 Z" fill="rgba(100,180,240,.30)" stroke="rgba(150,210,255,.4)" stroke-width=".8"/>
    <line x1="107" y1="16" x2="107" y2="27" stroke="rgba(212,160,23,.4)" stroke-width="1"/>
    <path d="M85 15 L100 13.5 L115 13.5 L130 15 L115 15.5 L100 15.5 Z" fill="rgba(255,255,255,.08)"/>
    ` + CAR_WHEELS + `
    <ellipse cx="190" cy="33" rx="5" ry="3.5" fill="rgba(255,255,200,.95)"/>
    <ellipse cx="190" cy="41" rx="4" ry="2.5" fill="rgba(255,200,80,.9)"/>
    <ellipse cx="190" cy="33" rx="7" ry="5" fill="none" stroke="rgba(255,255,180,.25)" stroke-width="1"/>
    <rect x="17" y="33" width="4" height="5" rx="1.5" fill="rgba(255,30,30,.9)"/>
    <rect x="17" y="39" width="4" height="3" rx="1" fill="rgba(255,100,20,.7)"/>
    <line x1="18" y1="47" x2="4" y2="47" stroke="rgba(212,160,23,.5)" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="49" width="170" height="2.5" rx="1" fill="rgba(212,160,23,.35)"/>
    <text x="107" y="41" text-anchor="middle" font-size="5.5" fill="rgba(212,160,23,.65)" font-family="Inter,sans-serif" font-weight="700" letter-spacing=".05em">NOVACAR</text>`,

  suv: CAR_DEFS + `
    <path d="M202 22 L248 8 L248 56 L202 48 Z" fill="url(#hlight)" opacity=".6"/>
    <path d="M24 50 L196 50 L194 52 L26 52 Z" fill="rgba(0,0,0,.4)"/>
    <path d="M18 50 L18 13 Q18 7 28 7 L192 7 Q202 7 202 13 L202 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.95)" stroke-width="1.5"/>
    <path d="M30 7 L30 23 L103 23 L103 7 Z" fill="rgba(100,180,240,.28)" stroke="rgba(150,210,255,.3)" stroke-width=".8"/>
    <path d="M109 7 L109 23 L192 23 L192 7 Z" fill="rgba(100,180,240,.22)" stroke="rgba(150,210,255,.3)" stroke-width=".8"/>
    <rect x="104" y="7" width="6" height="16" fill="#1a1e28"/>
    <rect x="32" y="5" width="156" height="2.5" rx="1" fill="rgba(212,160,23,.4)"/>
    <rect x="36" y="3.5" width="8" height="1.5" rx=".5" fill="rgba(212,160,23,.25)"/>
    <rect x="50" y="3.5" width="8" height="1.5" rx=".5" fill="rgba(212,160,23,.25)"/>
    <rect x="162" y="3.5" width="8" height="1.5" rx=".5" fill="rgba(212,160,23,.25)"/>
    <rect x="176" y="3.5" width="8" height="1.5" rx=".5" fill="rgba(212,160,23,.25)"/>
    ` + CAR_WHEELS + `
    <rect x="198" y="19" width="5" height="10" rx="1.5" fill="rgba(255,255,200,.95)"/>
    <rect x="198" y="31" width="5" height="7" rx="1" fill="rgba(255,200,80,.9)"/>
    <rect x="17" y="19" width="4" height="12" rx="1.5" fill="rgba(255,30,30,.9)"/>
    <rect x="17" y="33" width="4" height="8" rx="1" fill="rgba(255,100,20,.7)"/>
    <line x1="18" y1="44" x2="5" y2="44" stroke="rgba(212,160,23,.5)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="47" x2="8" y2="47" stroke="rgba(212,160,23,.35)" stroke-width="2" stroke-linecap="round"/>
    <rect x="22" y="49" width="178" height="2.5" rx="1" fill="rgba(212,160,23,.35)"/>
    <text x="110" y="40" text-anchor="middle" font-size="5.5" fill="rgba(212,160,23,.65)" font-family="Inter,sans-serif" font-weight="700" letter-spacing=".05em">NOVACAR</text>`,

  hatchback: CAR_DEFS + `
    <path d="M194 30 L248 14 L248 52 L194 46 Z" fill="url(#hlight)" opacity=".65"/>
    <path d="M22 50 L190 50 L188 52 L24 52 Z" fill="rgba(0,0,0,.4)"/>
    <path d="M18 50 L18 36 L34 16 Q46 9 64 9 L144 9 Q162 9 180 17 L192 30 Q196 36 196 42 L196 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.95)" stroke-width="1.5"/>
    <path d="M18 36 L34 16 L62 10 L62 26 L40 36 Z" fill="rgba(100,180,240,.25)" stroke="rgba(150,210,255,.35)" stroke-width=".8"/>
    <path d="M98 9 L98 25 L178 25 L178 18 L162 11 L144 9 Z" fill="rgba(100,180,240,.28)" stroke="rgba(150,210,255,.35)" stroke-width=".8"/>
    <line x1="95" y1="9" x2="95" y2="26" stroke="rgba(212,160,23,.4)" stroke-width="1.2"/>
    ` + CAR_WHEELS + `
    <ellipse cx="192" cy="33" rx="5" ry="3.5" fill="rgba(255,255,200,.95)"/>
    <ellipse cx="192" cy="41" rx="4" ry="2.5" fill="rgba(255,200,80,.9)"/>
    <rect x="17" y="30" width="4" height="7" rx="1.5" fill="rgba(255,30,30,.9)"/>
    <rect x="17" y="38" width="4" height="4" rx="1" fill="rgba(255,100,20,.7)"/>
    <line x1="18" y1="46" x2="5" y2="46" stroke="rgba(212,160,23,.5)" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="49" width="172" height="2.5" rx="1" fill="rgba(212,160,23,.35)"/>
    <text x="107" y="39" text-anchor="middle" font-size="5.5" fill="rgba(212,160,23,.65)" font-family="Inter,sans-serif" font-weight="700" letter-spacing=".05em">NOVACAR</text>`,

  pickup: CAR_DEFS + `
    <path d="M205 16 L248 8 L248 52 L205 46 Z" fill="url(#hlight)" opacity=".6"/>
    <path d="M24 50 L200 50 L198 52 L26 52 Z" fill="rgba(0,0,0,.4)"/>
    <path d="M88 50 L88 11 Q88 7 98 7 L196 7 Q206 7 206 11 L206 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.95)" stroke-width="1.5"/>
    <path d="M18 50 L18 27 Q18 23 26 23 L86 23 L86 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.7)" stroke-width="1.2"/>
    <line x1="20" y1="38" x2="84" y2="38" stroke="rgba(212,160,23,.2)" stroke-width="1"/>
    <rect x="84" y="23" width="3" height="27" fill="rgba(212,160,23,.4)"/>
    <path d="M154 7 L154 23 L196 23 L196 7 Z" fill="rgba(100,180,240,.28)" stroke="rgba(150,210,255,.35)" stroke-width=".8"/>
    <path d="M100 7 L100 23 L148 23 L148 7 Z" fill="rgba(100,180,240,.22)" stroke="rgba(150,210,255,.3)" stroke-width=".8"/>
    <rect x="149" y="7" width="6" height="16" fill="#1a1e28"/>
    ` + CAR_WHEELS + `
    <rect x="202" y="18" width="5" height="9" rx="1.5" fill="rgba(255,255,200,.95)"/>
    <rect x="202" y="30" width="5" height="6" rx="1" fill="rgba(255,200,80,.9)"/>
    <rect x="17" y="27" width="3" height="9" rx="1" fill="rgba(255,30,30,.9)"/>
    <rect x="17" y="37" width="3" height="5" rx="1" fill="rgba(255,100,20,.7)"/>
    <line x1="18" y1="46" x2="5" y2="46" stroke="rgba(212,160,23,.5)" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="49" width="182" height="2.5" rx="1" fill="rgba(212,160,23,.35)"/>
    <text x="150" y="38" text-anchor="middle" font-size="5" fill="rgba(212,160,23,.6)" font-family="Inter,sans-serif" font-weight="700" letter-spacing=".05em">NOVACAR</text>`,

  sports: CAR_DEFS + `
    <path d="M200 34 L248 18 L248 52 L200 48 Z" fill="url(#hlight)" opacity=".7"/>
    <path d="M22 50 L192 50 L190 52 L24 52 Z" fill="rgba(0,0,0,.4)"/>
    <path d="M18 50 L18 44 L32 38 Q42 34 52 32 L72 27 Q84 22 100 21 L140 21 Q160 22 178 30 L192 38 Q198 42 200 46 L200 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,.95)" stroke-width="1.5"/>
    <path d="M54 32 L72 27 Q84 22 100 21 L140 21 Q156 22 174 29 L174 34 L54 34 Z" fill="url(#roofGrad)" stroke="rgba(212,160,23,.3)" stroke-width=".8"/>
    <path d="M58 32 L74 27 Q84 23 100 22 L140 22 Q154 23 170 28 L170 33 L58 33 Z" fill="rgba(100,180,240,.3)" stroke="rgba(150,210,255,.4)" stroke-width=".8"/>
    <line x1="112" y1="21" x2="112" y2="33" stroke="rgba(212,160,23,.35)" stroke-width="1"/>
    <path d="M52 33 L36 40 L22 44 L22 48 L36 44 L52 38 Z" fill="rgba(100,180,240,.2)" stroke="rgba(150,210,255,.3)" stroke-width=".6"/>
    <rect x="17" y="42" width="3" height="3" rx=".8" fill="rgba(212,160,23,.5)"/>
    ` + CAR_WHEELS + `
    <ellipse cx="196" cy="39" rx="5" ry="3" fill="rgba(255,255,200,.95)"/>
    <ellipse cx="196" cy="45" rx="4" ry="2" fill="rgba(255,200,80,.9)"/>
    <rect x="17" y="39" width="3" height="4" rx="1" fill="rgba(255,30,30,.9)"/>
    <rect x="17" y="44" width="3" height="3" rx="1" fill="rgba(255,100,20,.7)"/>
    <line x1="18" y1="48" x2="5" y2="47" stroke="rgba(212,160,23,.5)" stroke-width="2" stroke-linecap="round"/>
    <line x1="18" y1="46" x2="9" y2="44" stroke="rgba(212,160,23,.3)" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="22" y="49" width="176" height="2" rx="1" fill="rgba(212,160,23,.35)"/>
    <text x="112" y="30" text-anchor="middle" font-size="5" fill="rgba(212,160,23,.6)" font-family="Inter,sans-serif" font-weight="700" letter-spacing=".05em">NOVACAR</text>`,
};

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

  // ── Config ──────────────────────────────────────────────────────────────────
  if (data.config) {
    const c = data.config;
    const wa = c.whatsapp || '5514998231408';

    // WhatsApp em todos os links
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
      const url = new URL(a.href);
      const txt = url.searchParams.get('text');
      a.href = `https://wa.me/${wa}${txt ? `?text=${encodeURIComponent(txt)}` : ''}`;
      if (a.textContent.match(/\(\d{2}\)/)) a.textContent = c.phone || a.textContent;
    });

    // Horário — lê chaves por dia
    const hoursEl = document.querySelector('[itemprop="openingHours"]');
    if (hoursEl) {
      const DAYS_PT = { seg:'Seg', ter:'Ter', qua:'Qua', qui:'Qui', sex:'Sex', sab:'Sáb', dom:'Dom' };
      const parts = [];
      for (const [key, label] of Object.entries(DAYS_PT)) {
        if (c[`hours_${key}_enabled`] === '1') {
          const o = c[`hours_${key}_open`] || '08:00';
          const cl = c[`hours_${key}_close`] || '18:00';
          parts.push(`${label}: ${o}–${cl}`);
        }
      }
      if (parts.length) hoursEl.textContent = parts.join(' | ');
    }

    // ── Hero ──
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };

    if (c.hero_badge) set('hero-badge', c.hero_badge);

    if (c.hero_title_before || c.hero_title_highlight) {
      const h1 = document.getElementById('hero-title');
      if (h1) h1.innerHTML = `${c.hero_title_before || 'Seu carro merece a'} <span class="highlight">${c.hero_title_highlight || 'melhor mecânica'}</span>`;
    }

    if (c.hero_subtitle) {
      const el = document.getElementById('hero-subtitle');
      if (el) { el.classList.remove('typewriter'); el.textContent = c.hero_subtitle; }
    }

    if (c.hero_cta_text) {
      const btn = document.getElementById('hero-cta-btn');
      if (btn) btn.textContent = c.hero_cta_text;
    }

    // ── Stats ──
    if (c.stat_cars) {
      const el = document.getElementById('stat-cars');
      if (el) { el.dataset.target = c.stat_cars; el.textContent = '0'; }
    }
    set('stat-cars-label', c.stat_cars_label);
    if (c.stat_years) {
      const el = document.getElementById('stat-years');
      if (el) { el.dataset.target = c.stat_years; el.textContent = '0'; }
    }
    set('stat-years-label', c.stat_years_label);

    // ── Sobre ──
    if (c.about_title) {
      const el = document.getElementById('about-title');
      if (el) el.innerHTML = c.about_title;
    }
    set('about-text-1', c.about_text1);
    set('about-text-2', c.about_text2);

    // ── CTA Banner ──
    set('cta-title',    c.cta_title);
    set('cta-subtitle', c.cta_subtitle);
    if (c.cta_btn_text) {
      const btn = document.getElementById('cta-btn');
      if (btn) btn.textContent = c.cta_btn_text;
    }

    // ── Contato extra ──
    if (c.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
        const handle = c.instagram.replace('@', '');
        a.href = `https://www.instagram.com/${handle}`;
        const span = a.querySelector('span') || a.parentElement?.querySelector('span');
        if (span) span.textContent = c.instagram.startsWith('@') ? c.instagram : `@${c.instagram}`;
      });
    }
    if (c.maps_url) {
      document.querySelectorAll('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"]').forEach(a => {
        a.href = c.maps_url;
      });
    }
    if (c.maps_embed) {
      const iframe = document.querySelector('.map-wrap iframe');
      if (iframe) iframe.src = c.maps_embed;
    }

    // ── SEO ──
    if (c.seo_title) document.title = c.seo_title;
    if (c.seo_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', c.seo_description);
    }

    // ── Carro animado ──
    if (c.car_type && CARS[c.car_type]) {
      const svg = document.querySelector('.car-svg');
      if (svg) {
        svg.innerHTML = CARS[c.car_type];
        // Reinicia a animação car-drive explicitamente (troca de innerHTML pode pausá-la em alguns browsers)
        svg.style.animation = 'none';
        void svg.offsetWidth;
        svg.style.animation = 'car-drive 8s linear infinite';
      }
    }
  }
})();
