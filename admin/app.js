// ── Estado ────────────────────────────────────────────────────────────────────
const state = { token: localStorage.getItem('nc_token') };
const API   = '/api';

// ── Utilitários ───────────────────────────────────────────────────────────────
const $   = id => document.getElementById(id);
const esc = s  => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

async function req(method, path, body) {
  try {
    const r = await fetch(API + path, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) { logout(); return null; }
    const json = await r.json();
    return json;
  } catch (err) {
    console.error('req error:', err);
    toast('Erro de conexão com o servidor', 'error');
    return null;
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(title, html) {
  $('modal-title').textContent = title;
  $('modal-body').innerHTML = html;
  $('modal-overlay').hidden = false;
}
function closeModal() {
  $('modal-overlay').hidden = true;
  $('modal-body').innerHTML = '';
}
$('modal-close').onclick = closeModal;
$('modal-overlay').onclick = e => { if (e.target === $('modal-overlay')) closeModal(); };

// ── Auth ──────────────────────────────────────────────────────────────────────
function showLogin()     { $('login-screen').hidden = false; $('dashboard').hidden = true; }
function showDashboard() { $('login-screen').hidden = true;  $('dashboard').hidden = false; navigate('overview'); loadBadge(); startSessionTimer(); }
function logout()        { localStorage.removeItem('nc_token'); state.token = null; showLogin(); }

$('login-form').onsubmit = async e => {
  e.preventDefault();
  const btn = $('login-btn');
  btn.disabled = true; btn.textContent = 'Entrando…';
  try {
    const r = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: $('login-pwd').value }),
    });
    if (r.ok) {
      const { token } = await r.json();
      localStorage.setItem('nc_token', token);
      state.token = token;
      showDashboard();
    } else {
      $('login-error').hidden = false;
      btn.disabled = false; btn.textContent = 'Entrar';
    }
  } catch {
    $('login-error').hidden = false;
    btn.disabled = false; btn.textContent = 'Entrar';
  }
};

$('pwd-toggle').onclick = () => {
  const i = $('login-pwd');
  i.type = i.type === 'password' ? 'text' : 'password';
};
$('logout-btn').onclick = logout;

// ── Navegação ─────────────────────────────────────────────────────────────────
function navigate(sec) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.sec === sec));
  ({ overview, config, services, pricing, testimonials, faq, bookings, changePassword })[sec]?.();
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => navigate(btn.dataset.sec);
});

async function loadBadge() {
  const stats = await req('GET', '/stats');
  if (!stats || !stats.new_bookings) return;
  const b = $('booking-badge');
  b.textContent = stats.new_bookings;
  b.hidden = false;
}

// ── Layout de página com lista ────────────────────────────────────────────────
function listPage(title, subtitle, addLabel, tableHtml, onAdd) {
  $('main-content').innerHTML = `
    <div class="page">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
        <div><h2>${title}</h2><p>${subtitle}</p></div>
        <button id="btn-add" class="btn-sm gold">+ ${addLabel}</button>
      </div>
      <div class="section-card">
        <div class="section-card-body" style="padding:0">
          <div id="list-area">${tableHtml}</div>
        </div>
      </div>
    </div>`;
  $('btn-add').onclick = onAdd;
}

// ── Ícones ────────────────────────────────────────────────────────────────────
const ICON_OPTS = ['icon-gear','icon-brake','icon-tune','icon-engine','icon-bolt','icon-ac','icon-wrench','icon-piston','icon-oil','icon-gauge'];
const iconSel = (name, val) =>
  `<select name="${name}">${ICON_OPTS.map(i =>
    `<option value="${i}"${i===val?' selected':''}>${i.replace('icon-','')}</option>`
  ).join('')}</select>`;

// ── Formulário genérico ───────────────────────────────────────────────────────
function formData(formEl) {
  return Object.fromEntries(new FormData(formEl));
}

// ── Overview ──────────────────────────────────────────────────────────────────
async function overview() {
  $('main-content').innerHTML = `<div class="page"><div class="page-header"><h2>Dashboard</h2><p>Visão geral do site NovaCar Studio</p></div><div id="stats-grid" class="stat-grid"><p style="color:var(--muted)">Carregando…</p></div></div>`;
  const s = await req('GET', '/stats');
  if (!s) return;
  $('stats-grid').innerHTML = [
    ['Serviços ativos',    s.services,          false],
    ['Pacotes de preço',   s.pricing,           false],
    ['Depoimentos',        s.testimonials,      false],
    ['Perguntas FAQ',      s.faq,               false],
    ['Agendamentos totais',s.bookings,          false],
    ['Novos (7 dias)',     s.new_bookings,      true ],
    ['Cliques WhatsApp',   s.wa_clicks,         false],
    ['Formulários enviados',s.form_submissions, false],
  ].map(([label, num, hl]) => `
    <div class="stat-card${hl?' highlight':''}">
      <div class="stat-num">${num}</div>
      <div class="stat-label">${label}</div>
    </div>`).join('');
}

// ── Config ────────────────────────────────────────────────────────────────────
async function config() {
  $('main-content').innerHTML = `<div class="page"><div class="page-header"><h2>Configurações</h2><p>Informações gerais do negócio</p></div><div id="cfg-wrap">Carregando…</div></div>`;
  const cfg = await req('GET', '/config');
  if (!cfg) return;
  $('cfg-wrap').innerHTML = `
    <div class="section-card">
      <div class="section-card-header"><h3>Informações do Negócio</h3></div>
      <div class="section-card-body">
        <form id="cfg-form" class="admin-form">
          <div class="form-row">
            <div class="form-group"><label>Nome da Empresa</label><input name="business_name" value="${esc(cfg.business_name)}"/></div>
            <div class="form-group"><label>Telefone (exibição)</label><input name="phone" value="${esc(cfg.phone)}"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>WhatsApp (só números)</label><input name="whatsapp" value="${esc(cfg.whatsapp)}" placeholder="5514999999999"/></div>
            <div class="form-group"><label>Instagram (URL completa)</label><input name="instagram" value="${esc(cfg.instagram)}"/></div>
          </div>
          <div class="form-group"><label>Endereço</label><input name="address" value="${esc(cfg.address)}"/></div>
          <div class="form-row">
            <div class="form-group"><label>Horário Seg–Sex</label><input name="hours_weekdays" value="${esc(cfg.hours_weekdays)}"/></div>
            <div class="form-group"><label>Sábado</label><input name="hours_saturday" value="${esc(cfg.hours_saturday)}"/></div>
          </div>
          <div class="form-group"><label>Domingo</label><input name="hours_sunday" value="${esc(cfg.hours_sunday)}"/></div>
          <div class="form-submit"><button type="submit">Salvar Configurações</button></div>
        </form>
      </div>
    </div>`;
  $('cfg-form').onsubmit = async e => {
    e.preventDefault();
    const r = await req('PUT', '/config', formData(e.target));
    if (r?.ok) toast('Configurações salvas!');
    else toast('Erro ao salvar', 'error');
  };
}

// ── Serviços ──────────────────────────────────────────────────────────────────
async function services() {
  const rows = await req('GET', '/services');
  if (!Array.isArray(rows)) return;

  const html = rows.length
    ? `<p class="drag-hint">⠿ Arraste as linhas para reordenar</p>
       <table class="data-table">
        <thead><tr><th class="drag-handle-col">⠿</th><th>Nome</th><th>Descrição</th><th>Ícone</th><th>Ativo</th><th></th></tr></thead>
        <tbody id="svc-sortable">${rows.map(r => `
          <tr data-id="${r.id}">
            <td class="drag-handle-col"><span class="drag-handle">⠿</span></td>
            <td class="td-name">${esc(r.name)}</td>
            <td class="td-desc">${esc(r.description)}</td>
            <td><span class="chip">${esc(r.icon)}</span></td>
            <td><label class="toggle">
              <input type="checkbox" class="toggle-active" data-id="${r.id}"${r.active?' checked':''}>
              <span class="toggle-slider"></span>
            </label></td>
            <td class="td-actions">
              <button class="btn-sm btn-edit" data-id="${r.id}">Editar</button>
              <button class="btn-sm danger btn-del" data-id="${r.id}">Excluir</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<p class="no-data">Nenhum serviço cadastrado.</p>`;

  listPage('Serviços', 'Serviços exibidos no site', 'Novo Serviço', html, () => svcModal());

  if (window.Sortable && $('svc-sortable')) {
    new Sortable($('svc-sortable'), {
      handle: '.drag-handle',
      animation: 150,
      onEnd: async () => {
        const order = [...$('svc-sortable').querySelectorAll('tr')].map((tr, i) => ({ id: Number(tr.dataset.id), sort_order: i + 1 }));
        await req('PATCH', '/services/reorder', order);
        toast('Ordem salva!');
      },
    });
  }

  $('list-area').onclick = async e => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn  = e.target.closest('.btn-del');
    if (editBtn) { const r = rows.find(x => x.id == editBtn.dataset.id); if (r) svcModal(r); }
    if (delBtn)  {
      if (!confirm('Excluir este serviço?')) return;
      const res = await req('DELETE', `/services/${delBtn.dataset.id}`);
      if (res?.ok !== false) { toast('Serviço excluído'); services(); }
    }
  };
  $('list-area').onchange = async e => {
    const cb = e.target.closest('.toggle-active');
    if (!cb) return;
    const r = rows.find(x => x.id == cb.dataset.id);
    if (r) await req('PUT', `/services/${r.id}`, { ...r, active: cb.checked });
  };
}

function svcModal(row = {}) {
  openModal(row.id ? 'Editar Serviço' : 'Novo Serviço', `
    <form id="modal-form" class="admin-form">
      <div class="form-group"><label>Nome</label>
        <input name="name" value="${esc(row.name)}" required/>
      </div>
      <div class="form-group"><label>Descrição</label>
        <textarea name="description">${esc(row.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Ícone</label>${iconSel('icon', row.icon || 'icon-gear')}</div>
        <div class="form-group"><label>Ordem</label>
          <input type="number" name="sort_order" value="${row.sort_order ?? 0}"/>
        </div>
      </div>
      <div class="form-group"><label>Ativo</label>
        <label class="toggle">
          <input type="checkbox" name="active" value="1"${row.active !== false?' checked':''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="form-submit">
        <button type="submit">${row.id ? 'Salvar alterações' : 'Criar serviço'}</button>
      </div>
    </form>`);

  $('modal-form').onsubmit = async e => {
    e.preventDefault();
    const d = formData(e.target);
    d.active     = 'active' in d;
    d.sort_order = Number(d.sort_order);
    const res = row.id
      ? await req('PUT', `/services/${row.id}`, d)
      : await req('POST', '/services', d);
    if (res && !res.error) {
      toast(row.id ? 'Serviço atualizado!' : 'Serviço criado!');
      closeModal(); services();
    } else {
      toast('Erro ao salvar', 'error');
    }
  };
}

// ── Preços ────────────────────────────────────────────────────────────────────
async function pricing() {
  const rows = await req('GET', '/pricing');
  if (!Array.isArray(rows)) return;

  const html = rows.length
    ? `<table class="data-table">
        <thead><tr><th>Nome</th><th>Preço</th><th>Badge</th><th>Destaque</th><th>Ativo</th><th></th></tr></thead>
        <tbody>${rows.map(r => `
          <tr>
            <td class="td-name">${esc(r.name)}</td>
            <td><span class="chip">${esc(r.price)}</span></td>
            <td>${r.badge ? `<span class="chip">${esc(r.badge)}</span>` : '<span class="chip gray">—</span>'}</td>
            <td>${r.featured ? '<span class="chip green">Sim</span>' : '<span class="chip gray">Não</span>'}</td>
            <td><label class="toggle">
              <input type="checkbox" class="toggle-price" data-id="${r.id}"${r.active?' checked':''}>
              <span class="toggle-slider"></span>
            </label></td>
            <td class="td-actions">
              <button class="btn-sm btn-edit" data-id="${r.id}">Editar</button>
              <button class="btn-sm danger btn-del" data-id="${r.id}">Excluir</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<p class="no-data">Nenhum pacote cadastrado.</p>`;

  listPage('Preços', 'Pacotes de serviço exibidos no site', 'Novo Pacote', html, () => priceModal());

  $('list-area').onclick = async e => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn  = e.target.closest('.btn-del');
    if (editBtn) { const r = rows.find(x => x.id == editBtn.dataset.id); if (r) priceModal(r); }
    if (delBtn)  {
      if (!confirm('Excluir este pacote?')) return;
      const res = await req('DELETE', `/pricing/${delBtn.dataset.id}`);
      if (res?.ok !== false) { toast('Pacote excluído'); pricing(); }
    }
  };
  $('list-area').onchange = async e => {
    const cb = e.target.closest('.toggle-price');
    if (!cb) return;
    const r = rows.find(x => x.id == cb.dataset.id);
    if (r) await req('PUT', `/pricing/${r.id}`, { ...r, features: JSON.stringify(r.features || []), active: cb.checked });
  };
}

function priceModal(row = {}) {
  const feats = Array.isArray(row.features) ? row.features : [];
  let featCount = feats.length;

  openModal(row.id ? 'Editar Pacote' : 'Novo Pacote', `
    <form id="modal-form" class="admin-form">
      <div class="form-row">
        <div class="form-group"><label>Nome</label>
          <input name="name" value="${esc(row.name)}" required/>
        </div>
        <div class="form-group"><label>Preço (ex: R$ 180)</label>
          <input name="price" value="${esc(row.price)}" placeholder="R$ 180"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Ícone</label>${iconSel('icon', row.icon || 'icon-gear')}</div>
        <div class="form-group"><label>Badge (ex: Mais Completo)</label>
          <input name="badge" value="${esc(row.badge)}"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Destaque</label>
          <label class="toggle"><input type="checkbox" name="featured" value="1"${row.featured?' checked':''}><span class="toggle-slider"></span></label>
        </div>
        <div class="form-group"><label>Ativo</label>
          <label class="toggle"><input type="checkbox" name="active" value="1"${row.active !== false?' checked':''}><span class="toggle-slider"></span></label>
        </div>
      </div>
      <div class="form-group">
        <label>Itens do pacote</label>
        <div id="feats-list" class="features-list">
          ${feats.map((f, i) => `
            <div class="feature-item" data-feat-idx="${i}">
              <input name="feat[]" value="${esc(f)}" placeholder="Item do pacote"/>
              <button type="button" class="btn-del-feat">✕</button>
            </div>`).join('')}
        </div>
        <button type="button" id="add-feat-btn" class="btn-add-feat">+ Adicionar item</button>
      </div>
      <div class="form-submit">
        <button type="submit">${row.id ? 'Salvar alterações' : 'Criar pacote'}</button>
      </div>
    </form>`);

  // Delegação de eventos dentro do modal
  $('modal-body').onclick = e => {
    if (e.target.closest('#add-feat-btn')) {
      const list = $('feats-list');
      const div  = document.createElement('div');
      div.className = 'feature-item';
      div.innerHTML = `<input name="feat[]" placeholder="Item do pacote"/><button type="button" class="btn-del-feat">✕</button>`;
      list.appendChild(div);
      div.querySelector('input').focus();
      return;
    }
    if (e.target.closest('.btn-del-feat')) {
      e.target.closest('.feature-item').remove();
      return;
    }
  };

  $('modal-form').onsubmit = async e => {
    e.preventDefault();
    const fd       = new FormData(e.target);
    const features = fd.getAll('feat[]').map(f => f.trim()).filter(Boolean);
    const d = {
      name:     fd.get('name'),
      price:    fd.get('price'),
      icon:     fd.get('icon'),
      badge:    fd.get('badge') || '',
      featured: fd.has('featured'),
      active:   fd.has('active'),
      features: JSON.stringify(features),
    };
    const res = row.id
      ? await req('PUT', `/pricing/${row.id}`, d)
      : await req('POST', '/pricing', d);
    if (res && !res.error) {
      toast(row.id ? 'Pacote atualizado!' : 'Pacote criado!');
      closeModal(); pricing();
    } else {
      toast('Erro ao salvar', 'error');
    }
  };
}

// ── Depoimentos ───────────────────────────────────────────────────────────────
async function testimonials() {
  const rows = await req('GET', '/testimonials');
  if (!Array.isArray(rows)) return;

  const html = rows.length
    ? `<table class="data-table">
        <thead><tr><th>Autor</th><th>Veículo / Período</th><th>Nota</th><th>Depoimento</th><th>Ativo</th><th></th></tr></thead>
        <tbody>${rows.map(r => `
          <tr>
            <td class="td-name">${esc(r.author)}</td>
            <td>${esc(r.car)}</td>
            <td>${'★'.repeat(r.rating || 5)}</td>
            <td class="td-desc">${esc(r.text)}</td>
            <td><label class="toggle">
              <input type="checkbox" class="toggle-test" data-id="${r.id}"${r.active?' checked':''}>
              <span class="toggle-slider"></span>
            </label></td>
            <td class="td-actions">
              <button class="btn-sm btn-edit" data-id="${r.id}">Editar</button>
              <button class="btn-sm danger btn-del" data-id="${r.id}">Excluir</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<p class="no-data">Nenhum depoimento cadastrado.</p>`;

  listPage('Depoimentos', 'Avaliações de clientes exibidas no site', 'Novo Depoimento', html, () => testModal());

  $('list-area').onclick = async e => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn  = e.target.closest('.btn-del');
    if (editBtn) { const r = rows.find(x => x.id == editBtn.dataset.id); if (r) testModal(r); }
    if (delBtn)  {
      if (!confirm('Excluir este depoimento?')) return;
      const res = await req('DELETE', `/testimonials/${delBtn.dataset.id}`);
      if (res?.ok !== false) { toast('Depoimento excluído'); testimonials(); }
    }
  };
  $('list-area').onchange = async e => {
    const cb = e.target.closest('.toggle-test');
    if (!cb) return;
    const r = rows.find(x => x.id == cb.dataset.id);
    if (r) await req('PUT', `/testimonials/${r.id}`, { ...r, active: cb.checked });
  };
}

function testModal(row = {}) {
  let currentRating = row.rating ?? 5;

  openModal(row.id ? 'Editar Depoimento' : 'Novo Depoimento', `
    <form id="modal-form" class="admin-form">
      <div class="form-row">
        <div class="form-group"><label>Nome do cliente</label>
          <input name="author" value="${esc(row.author)}" required/>
        </div>
        <div class="form-group"><label>Veículo / Período</label>
          <input name="car" value="${esc(row.car)}" placeholder="HB20 / Cliente desde 2023"/>
        </div>
      </div>
      <div class="form-group">
        <label>Avaliação</label>
        <div id="stars-row" class="stars-input">
          ${[1,2,3,4,5].map(n =>
            `<button type="button" class="star-btn${n<=currentRating?' active':''}" data-star="${n}">★</button>`
          ).join('')}
        </div>
        <input type="hidden" name="rating" id="rating-val" value="${currentRating}"/>
      </div>
      <div class="form-group"><label>Depoimento</label>
        <textarea name="text" required>${esc(row.text)}</textarea>
      </div>
      <div class="form-group"><label>Ativo</label>
        <label class="toggle"><input type="checkbox" name="active" value="1"${row.active !== false?' checked':''}><span class="toggle-slider"></span></label>
      </div>
      <div class="form-submit">
        <button type="submit">${row.id ? 'Salvar alterações' : 'Criar depoimento'}</button>
      </div>
    </form>`);

  $('modal-body').onclick = e => {
    const starBtn = e.target.closest('.star-btn');
    if (!starBtn) return;
    const val = Number(starBtn.dataset.star);
    $('rating-val').value = val;
    $('modal-body').querySelectorAll('.star-btn').forEach(b =>
      b.classList.toggle('active', Number(b.dataset.star) <= val)
    );
  };

  $('modal-form').onsubmit = async e => {
    e.preventDefault();
    const d = formData(e.target);
    d.rating = Number(d.rating);
    d.active = 'active' in d;
    const res = row.id
      ? await req('PUT', `/testimonials/${row.id}`, d)
      : await req('POST', '/testimonials', d);
    if (res && !res.error) {
      toast(row.id ? 'Depoimento atualizado!' : 'Depoimento criado!');
      closeModal(); testimonials();
    } else {
      toast('Erro ao salvar', 'error');
    }
  };
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
async function faq() {
  const rows = await req('GET', '/faq');
  if (!Array.isArray(rows)) return;

  const html = rows.length
    ? `<p class="drag-hint">⠿ Arraste as linhas para reordenar</p>
       <table class="data-table">
        <thead><tr><th class="drag-handle-col">⠿</th><th>Pergunta</th><th>Ativo</th><th></th></tr></thead>
        <tbody id="faq-sortable">${rows.map(r => `
          <tr data-id="${r.id}">
            <td class="drag-handle-col"><span class="drag-handle">⠿</span></td>
            <td class="td-name">${esc(r.question)}</td>
            <td><label class="toggle">
              <input type="checkbox" class="toggle-faq" data-id="${r.id}"${r.active?' checked':''}>
              <span class="toggle-slider"></span>
            </label></td>
            <td class="td-actions">
              <button class="btn-sm btn-edit" data-id="${r.id}">Editar</button>
              <button class="btn-sm danger btn-del" data-id="${r.id}">Excluir</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<p class="no-data">Nenhuma pergunta cadastrada.</p>`;

  listPage('FAQ', 'Perguntas frequentes exibidas no site', 'Nova Pergunta', html, () => faqModal());

  if (window.Sortable && $('faq-sortable')) {
    new Sortable($('faq-sortable'), {
      handle: '.drag-handle',
      animation: 150,
      onEnd: async () => {
        const order = [...$('faq-sortable').querySelectorAll('tr')].map((tr, i) => ({ id: Number(tr.dataset.id), sort_order: i + 1 }));
        await req('PATCH', '/faq/reorder', order);
        toast('Ordem salva!');
      },
    });
  }

  $('list-area').onclick = async e => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn  = e.target.closest('.btn-del');
    if (editBtn) { const r = rows.find(x => x.id == editBtn.dataset.id); if (r) faqModal(r); }
    if (delBtn)  {
      if (!confirm('Excluir esta pergunta?')) return;
      const res = await req('DELETE', `/faq/${delBtn.dataset.id}`);
      if (res?.ok !== false) { toast('Pergunta excluída'); faq(); }
    }
  };
  $('list-area').onchange = async e => {
    const cb = e.target.closest('.toggle-faq');
    if (!cb) return;
    const r = rows.find(x => x.id == cb.dataset.id);
    if (r) await req('PUT', `/faq/${r.id}`, { ...r, active: cb.checked });
  };
}

function faqModal(row = {}) {
  openModal(row.id ? 'Editar Pergunta' : 'Nova Pergunta', `
    <form id="modal-form" class="admin-form">
      <div class="form-group"><label>Pergunta</label>
        <input name="question" value="${esc(row.question)}" required/>
      </div>
      <div class="form-group"><label>Resposta</label>
        <textarea name="answer" style="min-height:120px">${esc(row.answer)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Ordem</label>
          <input type="number" name="sort_order" value="${row.sort_order ?? 0}"/>
        </div>
        <div class="form-group"><label>Ativo</label>
          <label class="toggle"><input type="checkbox" name="active" value="1"${row.active !== false?' checked':''}><span class="toggle-slider"></span></label>
        </div>
      </div>
      <div class="form-submit">
        <button type="submit">${row.id ? 'Salvar alterações' : 'Criar pergunta'}</button>
      </div>
    </form>`);

  $('modal-form').onsubmit = async e => {
    e.preventDefault();
    const d = formData(e.target);
    d.sort_order = Number(d.sort_order);
    d.active     = 'active' in d;
    const res = row.id
      ? await req('PUT', `/faq/${row.id}`, d)
      : await req('POST', '/faq', d);
    if (res && !res.error) {
      toast(row.id ? 'FAQ atualizado!' : 'Pergunta criada!');
      closeModal(); faq();
    } else {
      toast('Erro ao salvar', 'error');
    }
  };
}

// ── Agendamentos ──────────────────────────────────────────────────────────────
async function bookings() {
  $('main-content').innerHTML = `
    <div class="page">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
        <div><h2>Agendamentos</h2><p>Solicitações recebidas pelo formulário do site</p></div>
        <div style="display:flex;gap:.5rem">
          <button id="btn-csv" class="btn-sm">⬇ CSV</button>
          <button id="btn-json-backup" class="btn-sm gold">⬇ Backup JSON</button>
        </div>
      </div>
      <div id="bookings-area">Carregando…</div>
    </div>`;
  const rows = await req('GET', '/bookings');
  if (!Array.isArray(rows)) return;
  const area = $('bookings-area');
  if (!rows.length) { area.innerHTML = `<p class="no-data">Nenhum agendamento recebido ainda.</p>`; return; }

  area.innerHTML = rows.map(r => {
    const waText = encodeURIComponent(`Olá ${r.name}! Vi seu agendamento para ${r.service || 'serviço'} na NovaCar Studio. Podemos conversar?`);
    const waPhone = (r.phone || '').replace(/\D/g, '');
    const waLink  = waPhone.length >= 10 ? `https://wa.me/55${waPhone}?text=${waText}` : '';
    return `
    <div class="booking-card${r.handled?' handled':''}" id="bc-${r.id}">
      <div class="bc-info">
        <div class="bc-name">${esc(r.name)}</div>
        <div class="bc-meta">📞 ${esc(r.phone)}</div>
        ${r.service ? `<span class="bc-service">${esc(r.service)}</span>` : ''}
        ${r.message ? `<div class="bc-msg">"${esc(r.message)}"</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
        <span class="bc-date">${new Date(r.created_at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;justify-content:flex-end">
          ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-sm wa-btn">💬 WhatsApp</a>` : ''}
          <button class="btn-sm${r.handled?'':' success'} btn-handle" data-id="${r.id}" data-handled="${r.handled}">${r.handled?'Reabrir':'✓ Atendido'}</button>
          <button class="btn-sm danger btn-del-booking" data-id="${r.id}">Excluir</button>
        </div>
      </div>
    </div>`;
  }).join('');

  area.onclick = async e => {
    const handleBtn = e.target.closest('.btn-handle');
    const delBtn    = e.target.closest('.btn-del-booking');
    if (handleBtn) {
      const handled = handleBtn.dataset.handled === 'true';
      await req('PATCH', `/bookings/${handleBtn.dataset.id}/handled`, { handled: !handled });
      bookings();
    }
    if (delBtn) {
      if (!confirm('Excluir este agendamento?')) return;
      await req('DELETE', `/bookings/${delBtn.dataset.id}`);
      bookings();
    }
  };

  $('btn-csv').onclick = () => {
    const header = 'ID,Nome,Telefone,Serviço,Mensagem,Data,Atendido';
    const lines  = rows.map(r => [
      r.id,
      `"${(r.name||'').replace(/"/g,'""')}"`,
      `"${(r.phone||'').replace(/"/g,'""')}"`,
      `"${(r.service||'').replace(/"/g,'""')}"`,
      `"${(r.message||'').replace(/"/g,'""')}"`,
      new Date(r.created_at).toLocaleString('pt-BR'),
      r.handled ? 'Sim' : 'Não',
    ].join(','));
    const blob = new Blob([header + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `agendamentos_novacar_${new Date().toISOString().split('T')[0]}.csv` });
    a.click(); URL.revokeObjectURL(url);
  };
  $('btn-json-backup').onclick = downloadBackup;
}

// ── Alterar Senha ─────────────────────────────────────────────────────────────
function changePassword() {
  $('main-content').innerHTML = `
    <div class="page">
      <div class="page-header"><h2>Alterar Senha</h2><p>Altere a senha de acesso ao painel</p></div>
      <div class="section-card" style="max-width:460px">
        <div class="section-card-body">
          <form id="pwd-form" class="admin-form">
            <div class="form-group"><label>Senha atual</label><input type="password" name="current" required/></div>
            <div class="form-group"><label>Nova senha (mín. 6 caracteres)</label><input type="password" name="next" minlength="6" required/></div>
            <div class="form-group"><label>Confirmar nova senha</label><input type="password" name="confirm" required/></div>
            <div class="form-submit"><button type="submit">Alterar Senha</button></div>
          </form>
          <p style="margin-top:.75rem;color:var(--muted);font-size:.8rem">⚠ A senha é redefinida ao reiniciar o servidor. Para torná-la permanente, edite o arquivo .env.</p>
        </div>
      </div>
    </div>`;

  $('pwd-form').onsubmit = async e => {
    e.preventDefault();
    const d = formData(e.target);
    if (d.next !== d.confirm) { toast('Senhas não coincidem', 'error'); return; }
    const r = await req('POST', '/change-password', { current: d.current, next: d.next });
    if (r?.ok) toast('Senha alterada com sucesso!');
    else toast(r?.error || 'Erro ao alterar senha', 'error');
  };
}


// ── Timer de sessão ────────────────────────────────────────────────────────────
function startSessionTimer() {
  const tokenData = state.token ? JSON.parse(atob(state.token.split('.')[1])) : null;
  if (!tokenData) return;
  const expMs = tokenData.exp * 1000;
  const warnMs = 5 * 60 * 1000; // avisar 5 min antes

  const tick = () => {
    const remaining = expMs - Date.now();
    const el = $('session-timer');
    if (!el) return;
    if (remaining <= 0) { logout(); return; }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    el.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    if (remaining <= warnMs) {
      el.style.color = '#ff6b6b';
      if (remaining <= warnMs && remaining > warnMs - 1000)
        toast('⚠ Sessão expira em 5 minutos. Faça login novamente.', 'error');
    }
  };
  tick();
  setInterval(tick, 1000);
}

// ── Backup JSON ───────────────────────────────────────────────────────────────
async function downloadBackup() {
  const r = await fetch(`${API}/backup`, { headers: { Authorization: `Bearer ${state.token}` } });
  if (!r.ok) { toast('Erro ao gerar backup', 'error'); return; }
  const blob = await r.blob();
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `novacar-backup-${new Date().toISOString().split('T')[0]}.json` });
  a.click(); URL.revokeObjectURL(url);
  toast('Backup baixado!');
}

// ── Notificação sonora de agendamento ─────────────────────────────────────────
let lastBookingCount = null;
function playNotifSound() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  } catch {}
}
async function pollBookings() {
  const s = await req('GET', '/stats');
  if (!s) return;
  if (lastBookingCount !== null && s.bookings > lastBookingCount) {
    playNotifSound();
    toast(`🔔 Novo agendamento recebido!`, 'success');
    loadBadge();
  }
  lastBookingCount = s.bookings;
}
setInterval(pollBookings, 30000);

// ── Adiciona botões de backup e preview à sidebar ─────────────────────────────
function addSidebarExtras() {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer || $('btn-backup')) return;

  const backup = document.createElement('button');
  backup.id = 'btn-backup';
  backup.className = 'btn-view-site';
  backup.style.cssText = 'background:rgba(212,160,23,0.1);border-color:rgba(212,160,23,0.3);color:var(--gold)';
  backup.textContent = '⬇ Backup JSON';
  backup.onclick = downloadBackup;
  footer.insertBefore(backup, footer.firstChild);

  const preview = document.createElement('a');
  preview.href = '/';
  preview.target = '_blank';
  preview.className = 'btn-view-site';
  preview.style.cssText = 'background:rgba(255,255,255,0.05)';
  preview.textContent = '👁 Preview site';
  footer.insertBefore(preview, footer.firstChild);
}

// ── Overview com extras ───────────────────────────────────────────────────────
const _origShowDashboard = showDashboard;

// ── Init ───────────────────────────────────────────────────────────────────────
if (state.token) showDashboard();
else showLogin();

// Adiciona extras após DOM pronto
setTimeout(addSidebarExtras, 100);
