import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { pool } from '@/lib/db';

type Cfg = Record<string, string>;
interface Svc { id: number; icon: string; name: string; description: string; }
interface Prc { id: number; name: string; icon: string; price: string; features: string | string[]; featured: boolean; badge?: string; }
interface Tst { id: number; author: string; car: string; text: string; rating: number; }
interface Faq { id: number; question: string; answer: string; }

async function getSiteData() {
  try {
    const [cfg, svc, prc, tst, faq] = await Promise.all([
      pool.query<{key:string;value:string}>("SELECT key,value FROM config"),
      pool.query<Svc>("SELECT * FROM services WHERE active=true ORDER BY sort_order,id"),
      pool.query<Prc>("SELECT * FROM pricing  WHERE active=true ORDER BY id"),
      pool.query<Tst>("SELECT * FROM testimonials WHERE active=true ORDER BY id"),
      pool.query<Faq>("SELECT * FROM faq      WHERE active=true ORDER BY sort_order,id"),
    ]);
    return {
      c: Object.fromEntries(cfg.rows.map(r => [r.key, r.value])) as Cfg,
      services: svc.rows, pricing: prc.rows, testimonials: tst.rows, faq: faq.rows,
    };
  } catch {
    return { c: {} as Cfg, services: [] as Svc[], pricing: [] as Prc[], testimonials: [] as Tst[], faq: [] as Faq[] };
  }
}

function feats(f: unknown): string[] {
  if (Array.isArray(f)) return f as string[];
  try { return JSON.parse(f as string); } catch { return []; }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0d0d',
};

export const metadata: Metadata = {
  title: 'NovaCar Studio Automotivo | Melhor Mecânica em Bauru SP ⭐⭐⭐⭐⭐',
  description: '✅ NovaCar Studio em Bauru/SP: revisão completa a partir de R$180, freios, suspensão, elétrica, motor e ar-condicionado com GARANTIA. Orçamento GRÁTIS pelo WhatsApp ☎ (14) 9 9823-1408.',
  keywords: 'mecânica automotiva Bauru, melhor oficina mecânica Bauru SP, revisão de carro Bauru preço, freios suspensão Bauru, elétrica automotiva Bauru, diagnóstico eletrônico Bauru, NovaCar Studio',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  authors: [{ name: 'NovaCar Studio Automotivo' }],
  alternates: { canonical: 'https://novacarstudio.com.br/' },
  openGraph: {
    type: 'website', locale: 'pt_BR', url: 'https://novacarstudio.com.br/',
    siteName: 'NovaCar Studio Automotivo',
    title: 'NovaCar Studio Automotivo | Mecânica em Bauru SP',
    description: 'Mecânica automotiva completa em Bauru/SP. Revisão, freios, suspensão, motor, elétrica e ar-condicionado com garantia. Agende agora pelo WhatsApp!',
    images: [{ url: 'https://novacarstudio.com.br/og-image.jpg', width: 1200, height: 630, alt: 'NovaCar Studio Automotivo – Mecânica em Bauru SP' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaCar Studio Automotivo | Mecânica em Bauru SP',
    description: 'Mecânica completa em Bauru/SP – revisão, freios, suspensão, motor, elétrica e ar-condicionado. Agende pelo WhatsApp!',
    images: ['https://novacarstudio.com.br/og-image.jpg'],
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': 'Bauru, São Paulo, Brasil',
    'geo.position': '-22.3420067;-49.1145865',
    'ICBM': '-22.3420067, -49.1145865',
  },
};

const LD_BUSINESS = {
  "@context":"https://schema.org","@type":"AutoRepair",
  "name":"NovaCar Studio Automotivo","alternateName":"NovaCar Mecânica",
  "description":"Mecânica automotiva completa em Bauru/SP.",
  "url":"https://novacarstudio.com.br","telephone":"+55-14-99823-1408",
  "priceRange":"$$","currenciesAccepted":"BRL","paymentAccepted":"Dinheiro, Cartão de Crédito, Pix",
  "image":"https://novacarstudio.com.br/og-image.jpg",
  "address":{"@type":"PostalAddress","addressLocality":"Bauru","addressRegion":"SP","addressCountry":"BR"},
  "geo":{"@type":"GeoCoordinates","latitude":-22.3420067,"longitude":-49.1145865},
  "hasMap":"https://maps.app.goo.gl/eJVX8upnK8NYXcxz5",
  "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"08:00","closes":"18:00"}],
  "aggregateRating":{"@type":"AggregateRating","ratingValue":"5","bestRating":"5","worstRating":"1","reviewCount":"50"},
  "sameAs":["https://maps.app.goo.gl/eJVX8upnK8NYXcxz5","https://www.instagram.com/novacarstudio"]
};

const LD_BREADCRUMB = {
  "@context":"https://schema.org","@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Início","item":"https://novacarstudio.com.br/"},
    {"@type":"ListItem","position":2,"name":"Serviços","item":"https://novacarstudio.com.br/#servicos"},
    {"@type":"ListItem","position":3,"name":"Preços","item":"https://novacarstudio.com.br/#precos"},
    {"@type":"ListItem","position":4,"name":"Contato","item":"https://novacarstudio.com.br/#contato"}
  ]
};

const LD_FAQ = {
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"Quanto custa uma revisão de carro em Bauru?","acceptedAnswer":{"@type":"Answer","text":"O valor varia conforme o modelo do veículo e os serviços necessários. Na NovaCar oferecemos orçamento gratuito e sem compromisso."}},
    {"@type":"Question","name":"A NovaCar Studio faz diagnóstico eletrônico?","acceptedAnswer":{"@type":"Answer","text":"Sim! Contamos com scanner automotivo de última geração para diagnóstico eletrônico completo."}},
    {"@type":"Question","name":"Quais tipos de veículos a NovaCar atende?","acceptedAnswer":{"@type":"Answer","text":"Atendemos carros de passeio, SUVs, utilitários e frotas de todas as marcas e modelos nacionais e importados."}},
    {"@type":"Question","name":"A NovaCar oferece garantia nos serviços?","acceptedAnswer":{"@type":"Answer","text":"Sim, todos os serviços possuem garantia. Trabalhamos com peças de qualidade e mão de obra especializada."}}
  ]
};

type S = CSSProperties;

const BRANDS = [
  { name: 'Volkswagen', svg: <><circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" strokeWidth="1.2"/><text x="30" y="37" textAnchor="middle" fontSize="17" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif">VW</text></> },
  { name: 'Fiat', svg: <><rect x="5" y="15" width="50" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="36" textAnchor="middle" fontSize="15" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif" letterSpacing="3">FIAT</text></> },
  { name: 'Chevrolet', svg: <><rect x="3" y="22" width="23" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="30" y="22" width="27" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5"/></> },
  { name: 'Ford', svg: <><ellipse cx="30" cy="30" rx="27" ry="19" fill="none" stroke="currentColor" strokeWidth="2.5"/><text x="30" y="35" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor" fontFamily="Georgia,serif" fontStyle="italic">Ford</text></> },
  { name: 'Toyota', svg: <><ellipse cx="30" cy="30" rx="26" ry="20" fill="none" stroke="currentColor" strokeWidth="2"/><ellipse cx="21" cy="30" rx="11" ry="17" fill="none" stroke="currentColor" strokeWidth="2"/><ellipse cx="39" cy="30" rx="11" ry="17" fill="none" stroke="currentColor" strokeWidth="2"/></> },
  { name: 'Honda', svg: <><path d="M14 10 L14 50 M46 10 L46 50 M14 30 L46 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/></> },
  { name: 'Hyundai', svg: <><ellipse cx="30" cy="30" rx="26" ry="19" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="38" textAnchor="middle" fontSize="24" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif" fontStyle="italic">H</text></> },
  { name: 'Renault', svg: <><polygon points="30,3 54,30 30,57 6,30" fill="none" stroke="currentColor" strokeWidth="2.5"/><polygon points="30,15 46,30 30,45 14,30" fill="none" stroke="currentColor" strokeWidth="2"/></> },
  { name: 'Peugeot', svg: <><path d="M30 4 L50 13 L50 42 L30 56 L10 42 L10 13 Z" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="40" textAnchor="middle" fontSize="24" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif">P</text></> },
  { name: 'Nissan', svg: <><ellipse cx="30" cy="30" rx="26" ry="19" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="30" x2="56" y2="30" stroke="currentColor" strokeWidth="1.5"/><text x="30" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" fontFamily="Arial,sans-serif" letterSpacing={0.5}>NISSAN</text></> },
  { name: 'Kia', svg: <><ellipse cx="30" cy="30" rx="26" ry="19" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="37" textAnchor="middle" fontSize="19" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif" fontStyle="italic" letterSpacing={1}>KIA</text></> },
  { name: 'Jeep', svg: <><rect x="5" y="16" width="50" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="36" textAnchor="middle" fontSize="13" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif" letterSpacing="4">JEEP</text></> },
  { name: 'Mitsubishi', svg: <><polygon points="30,8 38,22 30,36 22,22" fill="currentColor"/><polygon points="16,34 24,20 32,34 24,48" fill="currentColor"/><polygon points="44,20 52,34 44,48 36,34" fill="currentColor"/></> },
  { name: 'Citroën', svg: <><path d="M8 22 L30 9 L52 22" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/><path d="M8 37 L30 24 L52 37" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/></> },
  { name: 'Mercedes', svg: <><circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="5" x2="30" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="30" y1="30" x2="52" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="30" y1="30" x2="8" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
  { name: 'Dodge', svg: <><polygon points="30,4 52,16 52,44 30,56 8,44 8,16" fill="none" stroke="currentColor" strokeWidth="2"/><text x="30" y="38" textAnchor="middle" fontSize="22" fontWeight="900" fill="currentColor" fontFamily="Arial,sans-serif">D</text></> },
];

const DEFAULT_SVC: Svc[] = [
  {id:1,icon:'icon-gear',   name:'Revisão Completa',    description:'Revisão preventiva com troca de óleo, filtros, velas e verificação geral do veículo.'},
  {id:2,icon:'icon-brake',  name:'Freios',              description:'Substituição de pastilhas, discos, tambores e fluido de freio com segurança garantida.'},
  {id:3,icon:'icon-tune',   name:'Suspensão e Direção', description:'Amortecedores, buchas, terminais e alinhamento para conforto e estabilidade.'},
  {id:4,icon:'icon-engine', name:'Motor e Transmissão', description:'Diagnóstico eletrônico, correção de falhas e manutenção de motor e câmbio.'},
  {id:5,icon:'icon-bolt',   name:'Elétrica Automotiva', description:'Instalação e reparo de sistema elétrico, bateria, alternador e scanner automotivo.'},
  {id:6,icon:'icon-ac',     name:'Ar-Condicionado',     description:'Recarga de gás, higienização e reparo completo do sistema de ar-condicionado.'},
];
const DEFAULT_PRC: Prc[] = [
  {id:1,name:'Revisão Básica',     icon:'icon-gear',   price:'R$ 180',featured:false,features:['Troca de óleo e filtro','Verificação de fluidos','Inspeção visual geral','Checagem de pneus','Teste de bateria']},
  {id:2,name:'Revisão Completa',   icon:'icon-engine', price:'R$ 350',featured:true, badge:'Mais Completo',features:['Tudo da Revisão Básica','Troca de velas e cabos','Verificação de freios','Análise de suspensão','Diagnóstico eletrônico','Regulagem de motor']},
  {id:3,name:'Diagnóstico Elétrico',icon:'icon-bolt',  price:'R$ 120',featured:false,features:['Scanner OBD-II completo','Leitura e reset de falhas','Teste de alternador','Verificação de bateria','Relatório detalhado']},
];
const DEFAULT_TST: Tst[] = [
  {id:1,author:'Carlos M.',  car:'Cliente desde 2022',text:'Serviço excelente! Levei meu carro para revisão completa e fiquei muito satisfeito. Profissionais honestos e preço justo.',rating:5},
  {id:2,author:'Ana P.',     car:'Cliente desde 2023',text:'Resolvi o problema de suspensão que outros mecânicos não conseguiram. Atendimento rápido, eficiente e com garantia.',rating:5},
  {id:3,author:'Roberto S.', car:'Cliente desde 2021',text:'Melhor oficina de Bauru! Consertaram minha elétrica e o carro ficou perfeito. Atendimento de primeira. Super recomendo!',rating:5},
];
const DEFAULT_FAQ: Faq[] = [
  {id:1,question:'Quanto custa uma revisão de carro em Bauru?',    answer:'O valor varia conforme o modelo do veículo e os serviços necessários. Na NovaCar oferecemos <strong>orçamento gratuito e sem compromisso</strong>.'},
  {id:2,question:'A NovaCar Studio faz diagnóstico eletrônico?',   answer:'Sim! Contamos com <strong>scanner automotivo de última geração</strong> para diagnóstico eletrônico completo.'},
  {id:3,question:'Quais tipos de veículos a NovaCar atende?',      answer:'Atendemos <strong>carros de passeio, SUVs, utilitários e frotas</strong> de todas as marcas e modelos nacionais e importados.'},
  {id:4,question:'Como agendar um serviço na NovaCar Studio?',     answer:'Você pode agendar diretamente pelo <strong>WhatsApp</strong>, ligar para o nosso número ou nos visitar na oficina em Bauru/SP.'},
  {id:5,question:'A NovaCar oferece garantia nos serviços?',       answer:'Sim, <strong>todos os serviços possuem garantia</strong>. Trabalhamos com peças de qualidade e mão de obra especializada.'},
];

export default async function HomePage() {
  const { c, services: svcRaw, pricing: prcRaw, testimonials: tstRaw, faq: faqRaw } = await getSiteData();

  const services     = svcRaw.length  > 0 ? svcRaw  : DEFAULT_SVC;
  const pricing      = prcRaw.length  > 0 ? prcRaw  : DEFAULT_PRC;
  const testimonials = tstRaw.length  > 0 ? tstRaw  : DEFAULT_TST;
  const faqItems     = faqRaw.length  > 0 ? faqRaw  : DEFAULT_FAQ;

  const wa         = c.whatsapp  || '5514998231408';
  const phone      = c.phone     || '(14) 9 9823-1408';
  const instagram  = c.instagram || '@novacarstudio';
  const igHandle   = instagram.replace('@','');
  const mapsUrl    = c.maps_url  || 'https://maps.app.goo.gl/eJVX8upnK8NYXcxz5';
  const mapsEmbed  = c.maps_embed|| 'https://www.google.com/maps?q=-22.3420067,-49.1145865&z=16&output=embed';

  const heroBadge  = c.hero_badge            || 'Mecânica Automotiva em Bauru/SP';
  const heroBefore = c.hero_title_before      || 'Seu carro merece a';
  const heroHL     = c.hero_title_highlight   || 'melhor mecânica';
  const heroSub    = c.hero_subtitle          || 'Manutenção preventiva e corretiva, revisão completa e diagnóstico com qualidade profissional. Venha conhecer o NovaCar Studio.';
  const heroCta    = c.hero_cta_text          || 'Agendar Agora';
  const statCars   = c.stat_cars              || '500';
  const statCarsLb = c.stat_cars_label        || 'Carros atendidos';
  const statYears  = c.stat_years             || '5';
  const statYrsLb  = c.stat_years_label       || 'De experiência';
  const aboutTitle = c.about_title            || 'Paixão por carros, compromisso com qualidade';
  const aboutTx1   = c.about_text1            || 'O NovaCar Studio Automotivo nasceu da paixão por automóveis e do desejo de oferecer mecânica com padrão profissional. Atendemos em Bauru e região com equipamentos modernos e profissionais experientes.';
  const aboutTx2   = c.about_text2            || 'Cada veículo recebe diagnóstico criterioso e atenção individual, garantindo segurança e satisfação total. Nossa oficina está equipada para atender carros de passeio, SUVs, utilitários e frotas.';
  const ctaTitle   = c.cta_title              || 'Pronto para cuidar do seu carro?';
  const ctaSub     = c.cta_subtitle           || 'Agende uma avaliação gratuita e receba um orçamento sem compromisso.';
  const ctaBtn     = c.cta_btn_text           || 'Falar no WhatsApp';

  const DAYS_PT: [string,string][] = [['seg','Seg'],['ter','Ter'],['qua','Qua'],['qui','Qui'],['sex','Sex'],['sab','Sáb'],['dom','Dom']];
  const hoursText = DAYS_PT
    .filter(([k]) => c[`hours_${k}_enabled`] === '1')
    .map(([k,lb]) => `${lb}: ${c[`hours_${k}_open`]||'08:00'}–${c[`hours_${k}_close`]||'18:00'}`)
    .join(' | ') || 'Seg–Sex: 8h–18h';

  return (
    <>
      {/* Site CSS — separado do dashboard */}
      <link rel="stylesheet" href="/style.css" precedence="default" />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BUSINESS) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_FAQ) }} />

      {/* ── SVG SYMBOLS ── */}
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <defs>
          <symbol id="bg-gear" viewBox="0 0 512 512">
            <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
          </symbol>
          <symbol id="icon-gear" viewBox="0 0 24 24">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </symbol>
          <symbol id="icon-brake" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            <circle cx="12" cy="4.5" r="1"/><circle cx="17.8" cy="7.7" r="1"/>
            <circle cx="17.8" cy="16.3" r="1"/><circle cx="12" cy="19.5" r="1"/>
            <circle cx="6.2" cy="16.3" r="1"/><circle cx="6.2" cy="7.7" r="1"/>
          </symbol>
          <symbol id="icon-tune" viewBox="0 0 24 24">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </symbol>
          <symbol id="icon-engine" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </symbol>
          <symbol id="icon-bolt" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </symbol>
          <symbol id="icon-ac" viewBox="0 0 24 24">
            <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z"/>
          </symbol>
          <symbol id="icon-wrench" viewBox="0 0 24 24">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </symbol>
          <symbol id="icon-piston" viewBox="0 0 24 24">
            <rect x="8" y="2" width="8" height="5" rx="1"/>
            <rect x="10" y="7" width="4" height="3"/>
            <rect x="6" y="10" width="12" height="7" rx="2"/>
            <rect x="10" y="17" width="4" height="5"/>
          </symbol>
          <symbol id="icon-oil" viewBox="0 0 24 24">
            <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/>
          </symbol>
          <symbol id="icon-gauge" viewBox="0 0 100 60">
            <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            <line id="gauge-needle" x1="50" y1="50" x2="50" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="4" fill="currentColor"/>
          </symbol>
          <symbol id="icon-star" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </symbol>
          <symbol id="icon-quote" viewBox="0 0 24 24">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </symbol>
        </defs>
      </svg>

      {/* ── PRELOADER ── */}
      <div id="preloader" className="preloader" role="status" aria-label="Carregando NovaCar">
        <div className="pl-content">
          <svg className="pl-gear" viewBox="0 0 512 512" aria-hidden="true"><use href="#bg-gear"/></svg>
          <div className="pl-logo">Nova<span>Car</span></div>
          <div className="pl-bar-wrap"><div className="pl-bar"></div></div>
          <p className="pl-text">Preparando...</p>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <header className="navbar" id="navbar">
        <div className="container nav-inner">
          <a href="#home" className="logo">Nova<span>Car</span></a>
          <nav className="nav-links" id="navLinks" aria-label="Menu principal">
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="#precos">Preços</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#faq">FAQ</a>
            <a href="#contato">Contato</a>
          </nav>
          <a href="https://wa.me/5514998231408" target="_blank" rel="noopener noreferrer" className="btn btn-primary nav-cta">Agendar via WhatsApp</a>
          <button id="theme-toggle" className="theme-btn" aria-label="Alternar tema claro/escuro" title="Alternar tema">
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
              <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <button className="hamburger" id="hamburger" aria-label="Abrir menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero" id="home" aria-label="Início">
        <div className="hero-overlay"></div>
        <div className="hero-gears" aria-hidden="true">
          <svg className="gear gear-1" viewBox="0 0 512 512"><use href="#bg-gear"/></svg>
          <svg className="gear gear-2" viewBox="0 0 512 512"><use href="#bg-gear"/></svg>
          <svg className="gear gear-3" viewBox="0 0 512 512"><use href="#bg-gear"/></svg>
        </div>
        <div className="hero-tools" aria-hidden="true">
          <svg className="float-tool tool-a" viewBox="0 0 24 24"><use href="#icon-wrench"/></svg>
          <svg className="float-tool tool-b" viewBox="0 0 24 24"><use href="#icon-bolt"/></svg>
          <svg className="float-tool tool-c" viewBox="0 0 24 24"><use href="#icon-gear"/></svg>
          <svg className="float-tool tool-d" viewBox="0 0 24 24"><use href="#icon-tune"/></svg>
        </div>
        <svg className="gear-chain" viewBox="0 0 520 420" aria-hidden="true" preserveAspectRatio="none">
          <ellipse cx="320" cy="270" rx="155" ry="105" fill="none" className="chain-outer" strokeDasharray="14 7"/>
          <ellipse cx="320" cy="270" rx="155" ry="105" fill="none" className="chain-inner" strokeDasharray="7 14" strokeDashoffset="7"/>
        </svg>
        <div className="smoke-wrap" aria-hidden="true">
          <span className="smoke" style={{'--sx':'66%','--delay':'0s','--dur':'4.5s'} as S}></span>
          <span className="smoke" style={{'--sx':'68%','--delay':'1.1s','--dur':'3.8s'} as S}></span>
          <span className="smoke" style={{'--sx':'64%','--delay':'2.3s','--dur':'5s'} as S}></span>
          <span className="smoke" style={{'--sx':'70%','--delay':'0.6s','--dur':'4.2s'} as S}></span>
          <span className="smoke" style={{'--sx':'62%','--delay':'1.9s','--dur':'4.8s'} as S}></span>
          <span className="smoke" style={{'--sx':'67%','--delay':'3.1s','--dur':'3.6s'} as S}></span>
        </div>
        <div className="plug-flashes" aria-hidden="true">
          <span className="plug-flash" style={{'--pf-delay':'0s',left:'18%',top:'38%'} as S}></span>
          <span className="plug-flash" style={{'--pf-delay':'1.8s',left:'30%',top:'28%'} as S}></span>
          <span className="plug-flash" style={{'--pf-delay':'3.6s',left:'8%',top:'55%'} as S}></span>
          <span className="plug-flash" style={{'--pf-delay':'5.4s',left:'24%',top:'48%'} as S}></span>
        </div>
        <div className="sparks" aria-hidden="true">
          <span className="spark" style={{'--tx':'40px','--ty':'-60px','--delay':'0s','--dur':'1.4s',left:'62%',top:'55%'} as S}></span>
          <span className="spark" style={{'--tx':'-30px','--ty':'-80px','--delay':'.3s','--dur':'1.1s',left:'65%',top:'58%'} as S}></span>
          <span className="spark" style={{'--tx':'60px','--ty':'-40px','--delay':'.6s','--dur':'1.6s',left:'60%',top:'60%'} as S}></span>
          <span className="spark" style={{'--tx':'-50px','--ty':'-55px','--delay':'.9s','--dur':'1.2s',left:'63%',top:'57%'} as S}></span>
          <span className="spark" style={{'--tx':'25px','--ty':'-70px','--delay':'1.2s','--dur':'1.5s',left:'61%',top:'59%'} as S}></span>
          <span className="spark" style={{'--tx':'-45px','--ty':'-35px','--delay':'1.5s','--dur':'1.3s',left:'64%',top:'56%'} as S}></span>
          <span className="spark" style={{'--tx':'55px','--ty':'-65px','--delay':'1.8s','--dur':'1.7s',left:'62%',top:'61%'} as S}></span>
          <span className="spark" style={{'--tx':'-20px','--ty':'-90px','--delay':'2.1s','--dur':'1.1s',left:'66%',top:'54%'} as S}></span>
        </div>
        <div className="container hero-content">
          <span id="hero-badge" className="badge">{heroBadge}</span>
          <h1 id="hero-title">{heroBefore} <span className="highlight">{heroHL}</span></h1>
          <p id="hero-subtitle">{heroSub}</p>
          <div className="hero-actions">
            <a id="hero-cta-btn" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{heroCta}</a>
            <a href="#servicos" className="btn btn-outline">Ver Serviços</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong><span id="stat-cars" className="counter" data-target={statCars}>0</span>+</strong>
              <span id="stat-cars-label">{statCarsLb}</span>
            </div>
            <div className="stat stat-gauge" aria-hidden="true">
              <div className="gauge-wrap">
                <svg className="gauge-svg" viewBox="0 0 100 60">
                  <path className="gauge-track" d="M10 50 A40 40 0 0 1 90 50" fill="none" strokeWidth="8" strokeLinecap="round"/>
                  <path className="gauge-fill" d="M10 50 A40 40 0 0 1 90 50" fill="none" strokeWidth="8" strokeLinecap="round"/>
                  <line className="gauge-needle" x1="50" y1="50" x2="50" y2="14"/>
                  <circle cx="50" cy="50" r="5"/>
                </svg>
              </div>
              <strong>5★</strong>
              <span>Avaliação no Google</span>
            </div>
            <div className="stat">
              <strong>+<span id="stat-years" className="counter" data-target={statYears}>0</span> anos</strong>
              <span id="stat-years-label">{statYrsLb}</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">▼</div>
      </section>

      {/* ── MARCAS ATENDIDAS ── */}
      <div className="brands-strip" aria-label="Marcas de veículos atendidas">
        <p className="brands-label">Atendemos todas as marcas</p>
        <div className="brands-track-wrap">
          <div className="brands-track" aria-hidden="true">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <figure key={i} className="brand-item">
                <svg className="brand-svg" viewBox="0 0 60 60">{b.svg}</svg>
                <figcaption>{b.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVIÇOS ── */}
      <section className="section services" id="servicos" aria-label="Nossos serviços">
        <div className="container">
          <div className="section-header">
            <span className="label">O que fazemos</span>
            <h2>Nossos Serviços</h2>
            <p>Soluções completas para manter seu veículo seguro e funcionando</p>
          </div>
          <div className="cards" id="services-grid">
            {services.map((s, i) => (
              <article key={s.id} className="card" data-delay={i * 100}>
                <div className={`card-icon${s.icon === 'icon-bolt' ? ' card-icon-electric' : ''}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><use href={`#${s.icon}`}/></svg>
                  {s.icon === 'icon-bolt' && <span className="electric-arc" aria-hidden="true"></span>}
                </div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="section about" id="sobre" aria-label="Sobre a NovaCar">
        <div className="container about-inner">
          <div className="about-visual">
            <div className="about-img-wrap">
              <div className="about-img-placeholder">
                <svg className="about-gear-spin" viewBox="0 0 512 512" aria-hidden="true"><use href="#bg-gear"/></svg>
                <svg className="about-wrench" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-wrench"/></svg>
                <div className="pistons" aria-hidden="true">
                  <svg className="piston piston-a" viewBox="0 0 24 24"><use href="#icon-piston"/></svg>
                  <svg className="piston piston-b" viewBox="0 0 24 24"><use href="#icon-piston"/></svg>
                  <svg className="piston piston-c" viewBox="0 0 24 24"><use href="#icon-piston"/></svg>
                </div>
                <div className="oil-drops" aria-hidden="true">
                  <svg className="oil-drop drop-a" viewBox="0 0 24 24"><use href="#icon-oil"/></svg>
                  <svg className="oil-drop drop-b" viewBox="0 0 24 24"><use href="#icon-oil"/></svg>
                  <svg className="oil-drop drop-c" viewBox="0 0 24 24"><use href="#icon-oil"/></svg>
                </div>
                <div className="diag-hud" aria-hidden="true">
                  <div className="hud-header">◈ DIAGNÓSTICO OBD-II</div>
                  <div className="hud-row hud-r1"><span>MOTOR</span><span className="hud-ok">✔ OK</span></div>
                  <div className="hud-row hud-r2"><span>PRESSÃO ÓLEO</span><span className="hud-val">2.4 BAR</span></div>
                  <div className="hud-row hud-r3"><span>TEMP. MOTOR</span><span className="hud-val">90°C</span></div>
                  <div className="hud-row hud-r4"><span>FREIOS</span><span className="hud-ok">✔ OK</span></div>
                  <div className="hud-row hud-r5"><span>BATERIA</span><span className="hud-val">12.8V</span></div>
                  <div className="hud-cursor">█</div>
                </div>
              </div>
              <div className="about-badge-float">
                <strong>+500</strong>
                <span>clientes satisfeitos</span>
              </div>
            </div>
          </div>
          <div className="about-text">
            <span className="label">Quem somos</span>
            <h2 id="about-title" dangerouslySetInnerHTML={{ __html: aboutTitle }} />
            <p id="about-text-1">{aboutTx1}</p>
            <p id="about-text-2">{aboutTx2}</p>
            <div className="skill-bars">
              <div className="skill">
                <div className="skill-label"><span>Mecânica Geral</span><span className="skill-pct">97%</span></div>
                <div className="skill-track"><div className="skill-fill" data-pct="97"></div></div>
              </div>
              <div className="skill">
                <div className="skill-label"><span>Elétrica</span><span className="skill-pct">93%</span></div>
                <div className="skill-track"><div className="skill-fill" data-pct="93"></div></div>
              </div>
              <div className="skill">
                <div className="skill-label"><span>Suspensão &amp; Freios</span><span className="skill-pct">95%</span></div>
                <div className="skill-track"><div className="skill-fill" data-pct="95"></div></div>
              </div>
              <div className="skill">
                <div className="skill-label"><span>Diagnóstico Eletrônico</span><span className="skill-pct">90%</span></div>
                <div className="skill-track"><div className="skill-fill" data-pct="90"></div></div>
              </div>
            </div>
            <ul className="check-list">
              <li>Profissionais certificados e especializados</li>
              <li>Equipamentos modernos de diagnóstico</li>
              <li>Atendimento personalizado</li>
              <li>Garantia nos serviços</li>
            </ul>
            <a href="#contato" className="btn btn-primary">Fale Conosco</a>
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section className="section pricing" id="precos" aria-label="Pacotes de serviço">
        <div className="container">
          <div className="section-header">
            <span className="label">Transparência</span>
            <h2>Pacotes de Serviço</h2>
            <p>Valores de referência. Orçamento sempre gratuito e sem compromisso.</p>
          </div>
          <div className="pricing-grid" id="pricing-grid">
            {pricing.map((p, i) => (
              <div key={p.id} className={`price-card${p.featured ? ' price-featured' : ''}`} data-delay={i * 150}>
                {p.badge && <div className="price-badge-top">{p.badge}</div>}
                <div className="price-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><use href={`#${p.icon}`}/></svg></div>
                <h3>{p.name}</h3>
                <ul className="price-list">{feats(p.features).map((f,j) => <li key={j}>{f}</li>)}</ul>
                <div className="price-footer">
                  <div className="price-value"><span>a partir de</span><strong>{p.price}</strong></div>
                  <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Olá! Quero saber mais sobre ${p.name}.`)}`} target="_blank" rel="noopener noreferrer" className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-full`}>Solicitar Orçamento</a>
                </div>
              </div>
            ))}
          </div>
          <p className="pricing-note">* Valores de referência. O preço final varia conforme o modelo do veículo e as peças necessárias.</p>
        </div>
      </section>

      {/* ── CARRO ANIMADO ── */}
      <div className="car-strip" aria-hidden="true">
        <div className="road"><div className="road-dashes"></div></div>
        <svg className="car-svg" viewBox="0 0 220 80">
          <defs>
            <radialGradient id="hlight" cx="100%" cy="50%" r="100%">
              <stop offset="0%" stopColor="rgba(255,255,180,0.45)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E3540"/>
              <stop offset="100%" stopColor="#1C2028"/>
            </linearGradient>
            <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A4250"/>
              <stop offset="100%" stopColor="#2E3540"/>
            </linearGradient>
          </defs>
          <path d="M198 32 L248 16 L248 52 L198 44 Z" fill="url(#hlight)" opacity="0.7"/>
          <path d="M22 50 L188 50 L186 52 L24 52 Z" fill="rgba(0,0,0,0.4)"/>
          <path d="M18 50 L18 36 Q18 32 22 30 L52 20 Q60 14 76 13 L144 13 Q158 14 166 20 L186 30 Q190 32 192 36 L192 50 Z" fill="url(#bodyGrad)" stroke="rgba(212,160,23,0.95)" strokeWidth="1.5"/>
          <path d="M57 28 L80 14 L140 14 L162 28 Z" fill="url(#roofGrad)" stroke="rgba(212,160,23,0.3)" strokeWidth="0.8"/>
          <path d="M61 27 L80 16 L140 16 L158 27 Z" fill="rgba(100,180,240,0.30)" stroke="rgba(150,210,255,0.4)" strokeWidth="0.8"/>
          <line x1="107" y1="16" x2="107" y2="27" stroke="rgba(212,160,23,0.4)" strokeWidth="1"/>
          <path d="M85 15 L100 13.5 L115 13.5 L130 15 L115 15.5 L100 15.5 Z" fill="rgba(255,255,255,0.08)"/>
          <circle cx="54" cy="53" r="13" fill="#111" stroke="rgba(212,160,23,0.9)" strokeWidth="2"/>
          <g className="wheel-rear">
            <circle cx="54" cy="53" r="8" fill="#1e1e1e" stroke="rgba(212,160,23,0.35)" strokeWidth="1.5"/>
            <line x1="54" y1="45" x2="54" y2="61" stroke="rgba(212,160,23,0.5)" strokeWidth="1"/>
            <line x1="46" y1="53" x2="62" y2="53" stroke="rgba(212,160,23,0.5)" strokeWidth="1"/>
            <line x1="48.3" y1="47.3" x2="59.7" y2="58.7" stroke="rgba(212,160,23,0.35)" strokeWidth="0.8"/>
            <line x1="59.7" y1="47.3" x2="48.3" y2="58.7" stroke="rgba(212,160,23,0.35)" strokeWidth="0.8"/>
            <circle cx="54" cy="53" r="2.5" fill="rgba(212,160,23,0.8)"/>
          </g>
          <circle cx="158" cy="53" r="13" fill="#111" stroke="rgba(212,160,23,0.9)" strokeWidth="2"/>
          <g className="wheel-front">
            <circle cx="158" cy="53" r="8" fill="#1e1e1e" stroke="rgba(212,160,23,0.35)" strokeWidth="1.5"/>
            <line x1="158" y1="45" x2="158" y2="61" stroke="rgba(212,160,23,0.5)" strokeWidth="1"/>
            <line x1="150" y1="53" x2="166" y2="53" stroke="rgba(212,160,23,0.5)" strokeWidth="1"/>
            <line x1="152.3" y1="47.3" x2="163.7" y2="58.7" stroke="rgba(212,160,23,0.35)" strokeWidth="0.8"/>
            <line x1="163.7" y1="47.3" x2="152.3" y2="58.7" stroke="rgba(212,160,23,0.35)" strokeWidth="0.8"/>
            <circle cx="158" cy="53" r="2.5" fill="rgba(212,160,23,0.8)"/>
          </g>
          <ellipse cx="190" cy="33" rx="5" ry="3.5" fill="rgba(255,255,200,0.95)"/>
          <ellipse cx="190" cy="41" rx="4" ry="2.5" fill="rgba(255,200,80,0.9)"/>
          <ellipse cx="190" cy="33" rx="7" ry="5" fill="none" stroke="rgba(255,255,180,0.25)" strokeWidth="1"/>
          <rect x="17" y="33" width="4" height="5" rx="1.5" fill="rgba(255,30,30,0.9)"/>
          <rect x="17" y="39" width="4" height="3" rx="1" fill="rgba(255,100,20,0.7)"/>
          <line x1="18" y1="47" x2="4" y2="47" stroke="rgba(212,160,23,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="22" y="49" width="170" height="2.5" rx="1" fill="rgba(212,160,23,0.35)"/>
          <text x="107" y="41" textAnchor="middle" fontSize="5.5" fill="rgba(212,160,23,0.65)" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.05em">NOVACAR</text>
        </svg>
      </div>

      {/* ── RASTRO DE PNEU ── */}
      <div className="tire-strip" aria-hidden="true">
        <div className="tire-track-inner"></div>
      </div>

      {/* ── DEPOIMENTOS ── */}
      <section className="section testimonials" id="depoimentos" aria-label="Depoimentos de clientes">
        <div className="container">
          <div className="section-header">
            <span className="label">O que dizem os clientes</span>
            <h2>Depoimentos</h2>
            <p>A satisfação de quem confia no nosso serviço é nossa maior conquista</p>
          </div>
          <div className="testimonials-grid" id="testimonials-grid">
            {testimonials.map((t, i) => (
              <article key={t.id} className="testimonial-card" data-delay={i * 150}>
                <div className="t-quote" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#icon-quote"/></svg></div>
                <p className="t-text">&ldquo;{t.text}&rdquo;</p>
                <div className="t-footer">
                  <div className="t-stars" aria-label={`${t.rating} estrelas`}>
                    {Array.from({length: t.rating}).map((_,j) => <svg key={j} viewBox="0 0 24 24" className="star" aria-hidden="true"><use href="#icon-star"/></svg>)}
                  </div>
                  <div className="t-author"><strong>{t.author}</strong><span>{t.car}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" aria-label="Chamada para ação">
        <div className="cta-gears" aria-hidden="true">
          <svg className="cta-gear cta-gear-a" viewBox="0 0 512 512"><use href="#bg-gear"/></svg>
          <svg className="cta-gear cta-gear-b" viewBox="0 0 512 512"><use href="#bg-gear"/></svg>
        </div>
        <div className="container cta-inner">
          <div>
            <h2 id="cta-title">{ctaTitle}</h2>
            <p id="cta-subtitle">{ctaSub}</p>
          </div>
          <a id="cta-btn" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">{ctaBtn}</a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section" id="faq" aria-label="Perguntas frequentes">
        <div className="container">
          <div className="section-header">
            <span className="label">Dúvidas comuns</span>
            <h2>Perguntas Frequentes</h2>
            <p>Respondemos as principais dúvidas sobre nossos serviços</p>
          </div>
          <div className="faq-list" id="faq-list">
            {faqItems.map(f => (
              <div key={f.id} className="faq-item">
                <button className="faq-question" aria-expanded="false">
                  {f.question}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-answer"><p dangerouslySetInnerHTML={{ __html: f.answer }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section className="section contact" id="contato" aria-label="Contato e localização">
        <div className="container contact-inner">
          <div className="contact-info">
            <span className="label">Entre em contato</span>
            <h2>Agende seu serviço</h2>
            <p>Estamos prontos para atender você. Envie uma mensagem ou venha nos visitar.</p>
            <div className="info-items" itemScope itemType="https://schema.org/AutoRepair">
              <meta itemProp="name" content="NovaCar Studio Automotivo" />
              <div className="info-item">
                <div className="info-icon" aria-hidden="true">📍</div>
                <div><strong>Endereço</strong><span itemProp="address" itemScope itemType="https://schema.org/PostalAddress"><span itemProp="addressLocality">Bauru</span> – <span itemProp="addressRegion">SP</span></span></div>
              </div>
              <div className="info-item">
                <div className="info-icon" aria-hidden="true">📞</div>
                <div><strong>Telefone / WhatsApp</strong><span><a href={`https://wa.me/${wa}`} itemProp="telephone">{phone}</a></span></div>
              </div>
              <div className="info-item">
                <div className="info-icon" aria-hidden="true">🕐</div>
                <div><strong>Horário de Atendimento</strong><span itemProp="openingHours">{hoursText}</span></div>
              </div>
              <div className="info-item">
                <div className="info-icon" aria-hidden="true">📸</div>
                <div><strong>Instagram</strong><span><a href={`https://www.instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer">{instagram.startsWith('@') ? instagram : `@${instagram}`}</a></span></div>
              </div>
            </div>
            <div className="contact-actions">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Ver no Google Maps</a>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-google-review">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F4B400"/>
                </svg>
                Avaliar no Google
              </a>
            </div>
          </div>
          <div className="contact-right">
            <form id="agendamento-form" className="agendamento-form" noValidate aria-label="Formulário de agendamento">
              <h3>Agende pelo Formulário</h3>
              <div className="form-group">
                <label htmlFor="f-nome">Nome <span aria-hidden="true">*</span></label>
                <input type="text" id="f-nome" name="nome" placeholder="Seu nome completo" required autoComplete="name"/>
              </div>
              <div className="form-group">
                <label htmlFor="f-tel">Telefone / WhatsApp <span aria-hidden="true">*</span></label>
                <input type="tel" id="f-tel" name="tel" placeholder="(14) 9 xxxx-xxxx" required autoComplete="tel"/>
              </div>
              <div className="form-group">
                <label htmlFor="f-servico">Serviço desejado</label>
                <select id="f-servico" name="servico">
                  <option>Revisão Completa</option><option>Troca de Óleo</option><option>Freios</option>
                  <option>Suspensão / Direção</option><option>Motor e Transmissão</option>
                  <option>Elétrica Automotiva</option><option>Ar-Condicionado</option>
                  <option>Diagnóstico Eletrônico</option><option>Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-msg">Mensagem (opcional)</label>
                <textarea id="f-msg" name="msg" rows={3} placeholder="Descreva o problema ou dúvida..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pelo WhatsApp
              </button>
              <p className="form-note">Você será redirecionado ao WhatsApp com os dados preenchidos.</p>
            </form>
            <div className="map-wrap">
              <iframe
                title="NovaCar Studio Automotivo no Google Maps"
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <a href="#home" className="logo">Nova<span>Car</span></a>
          <p>© <span id="footer-year">2026</span> NovaCar Studio Automotivo. Todos os direitos reservados.</p>
          <div className="footer-links">
            <a href="#servicos">Serviços</a><a href="#sobre">Sobre</a>
            <a href="#precos">Preços</a><a href="#depoimentos">Depoimentos</a>
            <a href="#faq">FAQ</a><a href="#contato">Contato</a>
          </div>
        </div>
        <div className="dev-credit">
          <p className="dev-credit-label">Desenvolvido com <span>♥</span> por</p>
          <a href="https://www.linkedin.com/in/daniel-op/" target="_blank" rel="noopener noreferrer" className="dev-card" aria-label="Ver perfil de Daniel Ortega no LinkedIn">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://ui-avatars.com/api/?name=Daniel+Ortega&background=D4A017&color=0A0A0A&size=128&bold=true&rounded=true" alt="Daniel Ortega" className="dev-avatar" width={52} height={52} loading="lazy"/>
            <div className="dev-info">
              <strong>Daniel Ortega</strong>
              <span className="dev-role">Desenvolvedor Web &amp; Mobile</span>
              <div className="dev-stack">
                <span className="dev-badge">Next.js</span><span className="dev-badge">TypeScript</span>
                <span className="dev-badge">Node.js</span><span className="dev-badge">PostgreSQL</span>
              </div>
            </div>
            <svg className="dev-linkedin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </footer>

      {/* ── CERTIFICAÇÕES ── */}
      <section className="section certifications" id="certificacoes" aria-label="Certificações e parceiros">
        <div className="container">
          <div className="section-header">
            <span className="label">Qualidade garantida</span>
            <h2>Certificações &amp; Parceiros</h2>
            <p>Trabalhamos com as melhores marcas para garantir qualidade e durabilidade</p>
          </div>
          <div className="cert-grid">
            {[
              { icon: '🔧', name: 'Bosch',   desc: 'Peças e ferramentas certificadas', delay: 0 },
              { icon: '🛢️', name: 'Castrol', desc: 'Óleos e lubrificantes premium', delay: 100 },
              { icon: '⚡', name: 'NGK',     desc: 'Velas de ignição originais', delay: 200 },
              { icon: '🏁', name: 'Texaco',  desc: 'Fluidos e graxas de alta performance', delay: 300 },
              { icon: '🔍', name: 'OBD-II',  desc: 'Diagnóstico eletrônico homologado', delay: 400 },
              { icon: '✅', name: 'Garantia',desc: 'Todos os serviços com garantia', delay: 500 },
            ].map(c => (
              <div key={c.name} className="cert-card" data-delay={c.delay}>
                <div className="cert-icon">{c.icon}</div>
                <strong className="cert-name">{c.name}</strong>
                <span className="cert-desc">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP FLOAT ── */}
      <a href="https://wa.me/5514998231408" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Falar no WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ── LGPD ── */}
      <div id="lgpd-bar" className="lgpd-bar" role="alert" aria-live="polite" hidden>
        <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade.</p>
        <div className="lgpd-btns">
          <button id="lgpd-accept" className="btn btn-primary lgpd-btn">Aceitar</button>
          <button id="lgpd-decline" className="lgpd-skip">Recusar</button>
        </div>
      </div>

      {/* ── VOLTAR AO TOPO ── */}
      <button id="back-to-top" className="back-to-top" aria-label="Voltar ao topo" hidden>↑</button>

      {/* ── SCRIPTS ── */}
      <Script src="/script.js" strategy="afterInteractive" />
      <Script src="/dynamic.js" strategy="afterInteractive" />
      <Script id="wa-track" strategy="afterInteractive">{`
        function trackWA(){fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'wa_clicks'})}).catch(()=>{});}
        document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{if(!a.getAttribute('onclick'))a.addEventListener('click',trackWA);});
      `}</Script>
    </>
  );
}
