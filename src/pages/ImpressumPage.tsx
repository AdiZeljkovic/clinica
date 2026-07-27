import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import { Reveal } from '../components/motion';

const sections = [
  {
    title: 'Podaci o tvrtki',
    content: [
      'Naziv tvrtke: Bioclinica SWP d.o.o.',
      'Sjedište: Radnička cesta 80, 10000 Zagreb, Hrvatska',
      'OIB: 12345678901',
      'MBS: 080123456',
      'Temeljni kapital: 20.000,00 EUR (uplaćen u cijelosti)',
      'Tvrtka je upisana u sudski registar Trgovačkog suda u Zagrebu.',
    ],
  },
  {
    title: 'Kontakt podaci',
    content: [
      'E-mail: info@bioclinica.swp',
      'Telefon: 0800 123 456 (besplatni poziv)',
      'Telefon: +385 1 4800 801',
      'Radno vrijeme: Ponedjeljak – Petak, 08:00 – 16:00 h',
    ],
  },
  {
    title: 'Zakonski zastupnici',
    content: [
      'Direktor: Ivan Horvat, OIB: 98765432109',
    ],
  },
  {
    title: 'Nadležno tijelo',
    content: [
      'Nadležno tijelo za nadzor nad poslovanjem društva je Ministarstvo zdravlja Republike Hrvatske i Hrvatska agencija za lijekove i medicinske proizvode (HALMED).',
      'Adresa: Ksaverska cesta 4, 10000 Zagreb',
      'Web: www.halmed.hr',
    ],
  },
  {
    title: 'Autorska prava',
    content: [
      'Svi sadržaji na ovoj web stranici, uključujući tekst, slike, grafike, logotipe i druge materijale, vlasništvo su tvrtke Bioclinica SWP d.o.o. ili su korišteni uz odobrenje nositelja prava.',
      'Svako neovlašteno kopiranje, reproduciranje ili distribucija sadržaja strogo je zabranjeno bez pisanog odobrenja vlasnika.',
    ],
  },
  {
    title: 'Odricanje od odgovornosti',
    content: [
      'Informacije objavljene na ovoj web stranici namijenjene su isključivo u informativne svrhe i ne mogu zamijeniti stručni medicinski savjet, dijagnozu ili liječenje.',
      'Bioclinica SWP d.o.o. ne snosi odgovornost za eventualne pogreške ili propuste u sadržaju, niti za štetu koja može nastati korištenjem ovih informacija.',
    ],
  },
];

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo fallbackTitle="Impressum - Bioclinica" />
      <Header />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ background: '#c91d22', minHeight: '36vh' }}>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 55% 50%, #e8302a 0%, #c91d22 45%, #8b1115 100%)' }} />
          <div className="pointer-events-none absolute inset-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="imp-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#imp-grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20 py-16 lg:py-24">
            <nav className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-10">
              <Link to="/" className="hover:text-white/70 transition-colors">Početna</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Impressum</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-8 bg-white/40" />
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.22em]">Pravne informacije</span>
              </div>
              <h1 className="font-black text-white tracking-[-0.04em] leading-[1.0]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}>
                Impressum
              </h1>
            </motion.div>
          </div>
        </section>

        {/* ── SADRŽAJ ── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-8 sm:px-14">
            <div className="flex flex-col gap-12">
              {sections.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.05}>
                  <div className="border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                    <h2 className="font-black text-[#111] mb-5 tracking-[-0.02em]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem' }}>
                      {s.title}
                    </h2>
                    <div className="flex flex-col gap-2.5">
                      {s.content.map((line, j) => (
                        <p key={j} className="text-[15px] text-gray-500 leading-[1.75] font-normal">{line}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
