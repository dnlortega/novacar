require('dotenv').config();
const express    = require('express');
const { Pool }   = require('pg');
const jwt        = require('jsonwebtoken');
const webpush    = require('web-push');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Web Push ──────────────────────────────────────────────────────────────────
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT  || 'mailto:admin@novacarstudio.com.br',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// ── Banco de dados ────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

// ── Seed inicial ──────────────────────────────────────────────────────────────
const SEED = {
  config: [
    ['business_name', 'NovaCar Studio Automotivo'],
    ['phone',         '(14) 9 9823-1408'],
    ['whatsapp',      '5514998231408'],
    ['address',       'Bauru – SP'],
    ['instagram',     'https://www.instagram.com/novacarstudio'],
    ['hours_weekdays','Seg–Sex: 8h–18h'],
    ['hours_saturday','Sábado: Fechado'],
    ['hours_sunday',  'Domingo: Fechado'],
  ],
  services: [
    { name:'Revisão Completa',    description:'Revisão preventiva com troca de óleo, filtros, velas e verificação geral do veículo.', icon:'icon-gear',   sort_order:1 },
    { name:'Freios',              description:'Substituição de pastilhas, discos, tambores e fluido de freio com segurança garantida.',  icon:'icon-brake',  sort_order:2 },
    { name:'Suspensão e Direção', description:'Amortecedores, buchas, terminais e alinhamento para conforto e estabilidade.',           icon:'icon-tune',   sort_order:3 },
    { name:'Motor e Transmissão', description:'Diagnóstico eletrônico, correção de falhas e manutenção de motor e câmbio.',             icon:'icon-engine', sort_order:4 },
    { name:'Elétrica Automotiva', description:'Instalação e reparo de sistema elétrico, bateria, alternador e scanner automotivo.',     icon:'icon-bolt',   sort_order:5 },
    { name:'Ar-Condicionado',     description:'Recarga de gás, higienização e reparo completo do sistema de ar-condicionado.',          icon:'icon-ac',     sort_order:6 },
  ],
  pricing: [
    { name:'Revisão Básica',      price:'R$ 180', icon:'icon-gear',   featured:false, badge:'',             features:['Troca de óleo e filtro','Verificação de fluidos','Inspeção visual geral','Checagem de pneus','Teste de bateria'] },
    { name:'Revisão Completa',    price:'R$ 350', icon:'icon-engine', featured:true,  badge:'Mais Completo', features:['Tudo da Revisão Básica','Troca de velas e cabos','Verificação de freios','Análise de suspensão','Diagnóstico eletrônico','Regulagem de motor'] },
    { name:'Diagnóstico Elétrico',price:'R$ 120', icon:'icon-bolt',   featured:false, badge:'',             features:['Scanner OBD-II completo','Leitura e reset de falhas','Teste de alternador','Verificação de bateria','Relatório detalhado'] },
  ],
  testimonials: [
    { author:'Carlos M.',  car:'Cliente desde 2022', rating:5, text:'Serviço excelente! Levei meu carro para revisão completa e fiquei muito satisfeito. Profissionais honestos e preço justo.' },
    { author:'Ana P.',     car:'Cliente desde 2023', rating:5, text:'Resolvi o problema de suspensão que outros mecânicos não conseguiram. Atendimento rápido, eficiente e com garantia.' },
    { author:'Roberto S.', car:'Cliente desde 2021', rating:5, text:'Melhor oficina de Bauru! Consertaram minha elétrica e o carro ficou perfeito. Atendimento de primeira. Super recomendo!' },
  ],
  faq: [
    { question:'Quanto custa uma revisão de carro em Bauru?',    answer:'O valor varia conforme o modelo do veículo e os serviços necessários. Oferecemos orçamento gratuito e sem compromisso. Entre em contato pelo WhatsApp.',  sort_order:1 },
    { question:'A NovaCar Studio faz diagnóstico eletrônico?',   answer:'Sim! Contamos com scanner automotivo de última geração para diagnóstico completo: motor, câmbio, ABS, airbag e demais sistemas.', sort_order:2 },
    { question:'Quais tipos de veículos a NovaCar atende?',      answer:'Atendemos carros de passeio, SUVs, utilitários e frotas de todas as marcas e modelos nacionais e importados.', sort_order:3 },
    { question:'Como agendar um serviço na NovaCar Studio?',     answer:'Você pode agendar diretamente pelo WhatsApp, ligar para o nosso número ou nos visitar na oficina em Bauru/SP. Seg–Sex das 8h às 18h.', sort_order:4 },
    { question:'A NovaCar oferece garantia nos serviços?',       answer:'Sim, todos os serviços possuem garantia. Trabalhamos com peças de qualidade e mão de obra especializada.', sort_order:5 },
  ],
};

// ── Inicializa banco ──────────────────────────────────────────────────────────
async function initDB() {
  const c = await pool.connect();
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS config (
        key   VARCHAR(100) PRIMARY KEY,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY, name VARCHAR(200), description TEXT,
        icon VARCHAR(50) DEFAULT 'icon-wrench', active BOOLEAN DEFAULT true, sort_order INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY, name VARCHAR(100), price VARCHAR(50),
        icon VARCHAR(50) DEFAULT 'icon-gear', badge VARCHAR(80) DEFAULT '',
        featured BOOLEAN DEFAULT false, features JSONB DEFAULT '[]', active BOOLEAN DEFAULT true
      );
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY, author VARCHAR(100), car VARCHAR(100),
        rating INTEGER DEFAULT 5, text TEXT, active BOOLEAN DEFAULT true
      );
      CREATE TABLE IF NOT EXISTS faq (
        id SERIAL PRIMARY KEY, question TEXT, answer TEXT,
        sort_order INTEGER DEFAULT 0, active BOOLEAN DEFAULT true
      );
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY, name VARCHAR(100), phone VARCHAR(30),
        service VARCHAR(100), message TEXT, handled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY, endpoint TEXT UNIQUE,
        p256dh TEXT, auth TEXT, created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS stats (
        key VARCHAR(100) PRIMARY KEY, value BIGINT DEFAULT 0
      );
    `);

    for (const [k, v] of SEED.config)
      await c.query('INSERT INTO config(key,value) VALUES($1,$2) ON CONFLICT(key) DO NOTHING', [k, v]);

    const { rowCount: sc } = await c.query('SELECT 1 FROM services LIMIT 1');
    if (!sc) for (const s of SEED.services)
      await c.query('INSERT INTO services(name,description,icon,sort_order) VALUES($1,$2,$3,$4)', [s.name,s.description,s.icon,s.sort_order]);

    const { rowCount: pc } = await c.query('SELECT 1 FROM pricing LIMIT 1');
    if (!pc) for (const p of SEED.pricing)
      await c.query('INSERT INTO pricing(name,price,icon,badge,featured,features) VALUES($1,$2,$3,$4,$5,$6)', [p.name,p.price,p.icon,p.badge,p.featured,JSON.stringify(p.features)]);

    const { rowCount: tc } = await c.query('SELECT 1 FROM testimonials LIMIT 1');
    if (!tc) for (const t of SEED.testimonials)
      await c.query('INSERT INTO testimonials(author,car,rating,text) VALUES($1,$2,$3,$4)', [t.author,t.car,t.rating,t.text]);

    const { rowCount: fc } = await c.query('SELECT 1 FROM faq LIMIT 1');
    if (!fc) for (const f of SEED.faq)
      await c.query('INSERT INTO faq(question,answer,sort_order) VALUES($1,$2,$3)', [f.question,f.answer,f.sort_order]);

    // Stats iniciais
    await c.query("INSERT INTO stats(key,value) VALUES('wa_clicks',0),('form_submissions',0) ON CONFLICT(key) DO NOTHING");
    console.log('✅ Banco inicializado');
  } finally { c.release(); }
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const loginLimit = rateLimit({ windowMs: 15*60*1000, max: 10, message: { error: 'Muitas tentativas. Aguarde 15 minutos.' } });
const apiLimit   = rateLimit({ windowMs:    60*1000, max: 60 });

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use('/api/', apiLimit);
app.use(express.static(path.join(__dirname, '.')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token necessário' });
  try { jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token inválido ou expirado' }); }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post('/api/login', loginLimit, (req, res) => {
  if (req.body.password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Senha incorreta' });
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, vapidPublicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post('/api/change-password', auth, (req, res) => {
  const { current, next: newPwd } = req.body;
  if (current !== process.env.ADMIN_PASSWORD) return res.status(400).json({ error: 'Senha atual incorreta' });
  if (!newPwd || newPwd.length < 6) return res.status(400).json({ error: 'Nova senha deve ter mínimo 6 caracteres' });
  process.env.ADMIN_PASSWORD = newPwd;
  res.json({ ok: true, message: 'Senha alterada. Nota: reiniciar o servidor restaura a senha do .env' });
});

// ── Público (sem auth) ────────────────────────────────────────────────────────
app.get('/api/public', async (req, res) => {
  try {
    const [cfg, svc, prc, tst, faq] = await Promise.all([
      pool.query('SELECT key,value FROM config'),
      pool.query('SELECT * FROM services WHERE active=true ORDER BY sort_order,id'),
      pool.query('SELECT * FROM pricing  WHERE active=true ORDER BY id'),
      pool.query('SELECT * FROM testimonials WHERE active=true ORDER BY id'),
      pool.query('SELECT * FROM faq      WHERE active=true ORDER BY sort_order,id'),
    ]);
    res.json({
      config:       Object.fromEntries(cfg.rows.map(r => [r.key, r.value])),
      services:     svc.rows,
      pricing:      prc.rows,
      testimonials: tst.rows,
      faq:          faq.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Rastreamento (público) ────────────────────────────────────────────────────
app.post('/api/track', async (req, res) => {
  const { event } = req.body;
  if (!['wa_clicks','form_submissions'].includes(event)) return res.json({ ok: false });
  await pool.query('INSERT INTO stats(key,value) VALUES($1,1) ON CONFLICT(key) DO UPDATE SET value=stats.value+1', [event]);
  res.json({ ok: true });
});

// ── Stats (admin) ─────────────────────────────────────────────────────────────
app.get('/api/stats', auth, async (req, res) => {
  const [s, p, t, f, b, bn, st] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM services WHERE active=true'),
    pool.query('SELECT COUNT(*) FROM pricing  WHERE active=true'),
    pool.query('SELECT COUNT(*) FROM testimonials WHERE active=true'),
    pool.query('SELECT COUNT(*) FROM faq WHERE active=true'),
    pool.query('SELECT COUNT(*) FROM bookings'),
    pool.query("SELECT COUNT(*) FROM bookings WHERE handled=false AND created_at > NOW()-INTERVAL '7 days'"),
    pool.query('SELECT key,value FROM stats'),
  ]);
  const statsMap = Object.fromEntries(st.rows.map(r => [r.key, Number(r.value)]));
  res.json({
    services: Number(s.rows[0].count), pricing: Number(p.rows[0].count),
    testimonials: Number(t.rows[0].count), faq: Number(f.rows[0].count),
    bookings: Number(b.rows[0].count), new_bookings: Number(bn.rows[0].count),
    wa_clicks: statsMap.wa_clicks || 0, form_submissions: statsMap.form_submissions || 0,
  });
});

// ── Config ────────────────────────────────────────────────────────────────────
app.get('/api/config', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT key,value FROM config');
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});
app.put('/api/config', auth, async (req, res) => {
  for (const [k, v] of Object.entries(req.body))
    await pool.query('INSERT INTO config(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2', [k, String(v)]);
  res.json({ ok: true });
});

// ── CRUD helper ───────────────────────────────────────────────────────────────
function crud(table, fields, orderBy='id') {
  app.get(`/api/${table}`, auth, async (req, res) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.post(`/api/${table}`, auth, async (req, res) => {
    try {
      const vals = fields.map(f => req.body[f] ?? null);
      const { rows } = await pool.query(
        `INSERT INTO ${table}(${fields.join(',')}) VALUES(${fields.map((_,i)=>`$${i+1}`).join(',')}) RETURNING *`, vals);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put(`/api/${table}/:id`, auth, async (req, res) => {
    try {
      const sets = fields.map((f,i) => `${f}=$${i+1}`).join(',');
      const vals = [...fields.map(f => req.body[f] ?? null), req.params.id];
      const { rows } = await pool.query(`UPDATE ${table} SET ${sets} WHERE id=$${fields.length+1} RETURNING *`, vals);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete(`/api/${table}/:id`, auth, async (req, res) => {
    try {
      await pool.query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

crud('services',     ['name','description','icon','active','sort_order'], 'sort_order,id');
crud('pricing',      ['name','price','icon','badge','featured','features','active'], 'id');
crud('testimonials', ['author','car','rating','text','active'], 'id');
crud('faq',          ['question','answer','sort_order','active'], 'sort_order,id');

// ── Reordenar (drag-drop) ─────────────────────────────────────────────────────
app.patch('/api/services/reorder', auth, async (req, res) => {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    for (const { id, sort_order } of req.body)
      await c.query('UPDATE services SET sort_order=$1 WHERE id=$2', [sort_order, id]);
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (e) { await c.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { c.release(); }
});
app.patch('/api/faq/reorder', auth, async (req, res) => {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    for (const { id, sort_order } of req.body)
      await c.query('UPDATE faq SET sort_order=$1 WHERE id=$2', [sort_order, id]);
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (e) { await c.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { c.release(); }
});

// ── Agendamentos ──────────────────────────────────────────────────────────────
app.get('/api/bookings', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(rows);
});
app.post('/api/bookings', async (req, res) => {
  const { name, phone, service, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Nome e telefone obrigatórios' });
  await pool.query('INSERT INTO bookings(name,phone,service,message) VALUES($1,$2,$3,$4)', [name, phone, service, message]);
  await pool.query('INSERT INTO stats(key,value) VALUES($1,1) ON CONFLICT(key) DO UPDATE SET value=stats.value+1', ['form_submissions']);
  // Notificação push para o admin
  const { rows: subs } = await pool.query('SELECT * FROM push_subscriptions');
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: '📅 Novo Agendamento — NovaCar', body: `${name} quer agendar: ${service || 'não especificado'}`, url: '/admin' })
      );
    } catch (e) {
      if (e.statusCode === 410) await pool.query('DELETE FROM push_subscriptions WHERE endpoint=$1', [sub.endpoint]);
    }
  }
  res.json({ ok: true });
});
app.patch('/api/bookings/:id/handled', auth, async (req, res) => {
  const { rows } = await pool.query('UPDATE bookings SET handled=$1 WHERE id=$2 RETURNING *', [req.body.handled, req.params.id]);
  res.json(rows[0]);
});
app.delete('/api/bookings/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM bookings WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── Push subscriptions ────────────────────────────────────────────────────────
app.post('/api/push/subscribe', auth, async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys) return res.status(400).json({ error: 'Subscription inválida' });
  await pool.query(
    'INSERT INTO push_subscriptions(endpoint,p256dh,auth) VALUES($1,$2,$3) ON CONFLICT(endpoint) DO UPDATE SET p256dh=$2,auth=$3',
    [endpoint, keys.p256dh, keys.auth]
  );
  res.json({ ok: true });
});
app.delete('/api/push/subscribe', auth, async (req, res) => {
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint=$1', [req.body.endpoint]);
  res.json({ ok: true });
});

// ── Sitemap dinâmico ──────────────────────────────────────────────────────────
app.get('/sitemap.xml', async (req, res) => {
  const base = 'https://novacarstudio.com.br';
  const today = new Date().toISOString().split('T')[0];
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${base}/#servicos</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${base}/#precos</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${base}/#depoimentos</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${base}/#faq</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${base}/#contato</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
</urlset>`);
});

// ── Start ─────────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n⚙  NovaCar rodando em http://localhost:${PORT}`);
    console.log(`🔧  Painel admin: http://localhost:${PORT}/admin\n`);
  });
}).catch(err => { console.error('Erro ao conectar:', err.message); process.exit(1); });
