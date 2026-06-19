import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Página não encontrada | NovaCar Studio',
  robots: 'noindex',
};

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href="/style.css" precedence="default" />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', background: '#0A0A0A', color: '#E8E8E8' }}>
        <svg viewBox="0 0 512 512" style={{ width: 80, height: 80, fill: 'rgba(212,160,23,0.3)', marginBottom: '1.5rem' }}>
          <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
        </svg>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, color: '#D4A017', lineHeight: 1, marginBottom: '0.5rem' }}>404</h1>
        <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '2rem' }}>Página não encontrada</p>
        <Link href="/" style={{ background: '#D4A017', color: '#0A0A0A', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
          Voltar ao início
        </Link>
      </div>
    </>
  );
}
