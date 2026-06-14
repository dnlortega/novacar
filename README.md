# NovaCar Studio Automotivo 🔧

Site institucional completo + painel de controle admin para a **NovaCar Studio Automotivo**, mecânica em Bauru/SP.

## Stack

| Camada | Tecnologia |
|---|---|
| Site público | HTML5 + CSS3 + JavaScript puro |
| Backend / API | Node.js + Express |
| Banco de dados | PostgreSQL (NeonDB serverless) |
| Admin panel | HTML/CSS/JS (migração Next.js + shadcn em andamento) |
| Deploy | Railway (backend) / Vercel (opcional) |

## Funcionalidades

### Site Público
- Design dark premium com tema claro/escuro (toggle)
- SEO completo: meta tags, JSON-LD, Open Graph, sitemap dinâmico, robots.txt
- PWA: manifest + service worker com cache offline
- Animações: engrenagens, carro animado, fumaça, faíscas, typewriter, cursor personalizado
- Seções: Hero, Serviços, Sobre, Preços, Depoimentos, Certificações, FAQ, Contato
- Formulário de agendamento: salva no banco + abre WhatsApp
- Rastreamento de cliques no WhatsApp
- Exit intent popup com oferta
- Scroll progress bar
- Auto-save do formulário no localStorage
- LGPD cookie bar
- Google Analytics 4
- Conteúdo dinâmico carregado do banco (fallback estático)

### API (server.js)
- JWT auth (12h) com rate limiting
- CRUD completo: serviços, preços, depoimentos, FAQ, configurações
- Agendamentos com notificações push Web Push (VAPID)
- Contador de cliques WhatsApp e envios de formulário
- Reordenação drag-and-drop (PATCH /reorder)
- Backup completo do banco em JSON
- Sitemap dinâmico `/sitemap.xml`
- Gzip compression + Helmet (headers de segurança)
- Troca de senha via painel

### Painel Admin (/admin)
- Login com JWT, timer de sessão com aviso de expiração
- Dashboard com métricas: cliques WA, formulários, agendamentos
- CRUD visual de todas as seções do site
- Drag-and-drop para reordenar serviços e FAQ (Sortable.js)
- Agendamentos: link WhatsApp para responder, marcar atendido, excluir
- Exportar agendamentos em CSV e backup geral em JSON
- Alterar senha pelo painel

## Estrutura de Arquivos

```
novacar/
├── index.html          # Site público
├── style.css           # Estilos do site
├── script.js           # JS do site (animações, formulário, tema)
├── dynamic.js          # Carregamento dinâmico do banco + registro SW
├── server.js           # API Express + NeonDB
├── sw.js               # Service Worker (cache + push notifications)
├── manifest.json       # PWA manifest
├── favicon.svg         # Ícone SVG
├── robots.txt          # Diretivas para crawlers
├── 404.html            # Página de erro personalizada
├── Procfile            # Deploy Railway/Heroku
├── railway.json        # Configuração Railway
├── package.json        # Dependências Node.js
├── .env                # Variáveis de ambiente (NÃO commitado)
├── .env.example        # Exemplo de variáveis
├── admin/
│   ├── index.html      # Painel admin
│   ├── style.css       # Estilos do admin (dark theme)
│   └── app.js          # Lógica do admin
└── admin-next/         # (em desenvolvimento) Admin em Next.js + shadcn
```

## Variáveis de Ambiente (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_PASSWORD=...
PORT=3000
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@novacarstudio.com.br
GA4_ID=G-XXXXXXXXXX
```

## Como rodar

```bash
npm install
node server.js
# Site: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## Tabelas do banco

- `config` — configurações gerais (nome, telefone, horários)
- `services` — serviços com ordem personalizável
- `pricing` — pacotes de preço com features
- `testimonials` — depoimentos de clientes
- `faq` — perguntas frequentes com ordem personalizável
- `bookings` — agendamentos recebidos pelo formulário
- `push_subscriptions` — assinaturas de notificações push
- `stats` — contadores (cliques WA, formulários enviados)

---

Desenvolvido por [Daniel Ortega](https://www.linkedin.com/in/daniel-op/) — Desenvolvedor Web & Mobile
