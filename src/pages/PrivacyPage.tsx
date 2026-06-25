import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const sections = [
  {
    title: 'Uvod i primjena',
    content: `Bioclinica SWP d.o.o. (dalje: "mi", "nas" ili "Bioclinica") posvećena je zaštiti vaše privatnosti i osobnih podataka. Ova Politika privatnosti opisuje kako prikupljamo, koristimo i štitimo vaše osobne podatke u skladu s Općom uredbom o zaštiti podataka (GDPR) i Zakonom o provedbi Opće uredbe o zaštiti podataka.`,
  },
  {
    title: 'Koje podatke prikupljamo',
    bullets: [
      'Identifikacijski podaci: ime, prezime',
      'Kontakt podaci: e-mail adresa, broj telefona',
      'Podaci o korištenju: IP adresa, vrsta preglednika, stranice koje ste posjetili',
      'Podaci o narudžbama: adresa za dostavu, povijest kupovine',
      'Podaci iz newslettera: e-mail adresa i datum prijave',
    ],
  },
  {
    title: 'Svrha i pravna osnova obrade',
    bullets: [
      'Izvršenje ugovora: obrada narudžbi i dostava proizvoda',
      'Legitimni interes: poboljšanje usluge, sigurnost web stranice',
      'Pristanak: slanje newslettera i marketinških komunikacija',
      'Pravna obveza: čuvanje financijske dokumentacije sukladno zakonskim propisima',
    ],
  },
  {
    title: 'Dijeljenje podataka s trećim stranama',
    content: `Vaše osobne podatke ne prodajemo niti iznajmljujemo trećim stranama. Podatke možemo dijeliti s:`,
    bullets: [
      'Davatelji usluga dostave (radi isporuke narudžbi)',
      'Procesorima plaćanja (radi obrade transakcija)',
      'IT partnerima (radi tehničke podrške i hosting usluga)',
      'Nadležnim tijelima (kada to zahtijeva zakon)',
    ],
  },
  {
    title: 'Vaša prava',
    bullets: [
      'Pravo pristupa: možete zatražiti uvid u podatke koje o vama čuvamo',
      'Pravo na ispravak: možete zatražiti ispravak netočnih podataka',
      'Pravo na brisanje: možete zatražiti brisanje vaših podataka ("pravo na zaborav")',
      'Pravo na prenosivost: možete zatražiti podatke u strojno čitljivom formatu',
      'Pravo na prigovor: možete se usprotiviti obradi na temelju legitimnog interesa',
      'Pravo na opoziv pristanka: u bilo kojem trenutku možete povući pristanak za newsletter',
    ],
  },
  {
    title: 'Čuvanje podataka',
    content: `Vaše osobne podatke čuvamo onoliko dugo koliko je potrebno za ispunjenje svrhe zbog koje su prikupljeni, ili onoliko koliko je propisano zakonom. Podaci vezani uz narudžbe čuvaju se 11 godina sukladno poreznim propisima. Newsletter podatke čuvamo do opoziva pristanka.`,
  },
  {
    title: 'Sigurnost podataka',
    content: `Primjenjujemo odgovarajuće tehničke i organizacijske mjere za zaštitu vaših podataka od neovlaštenog pristupa, gubitka ili uništenja. Naša web stranica koristi SSL enkripciju za siguran prijenos podataka.`,
  },
  {
    title: 'Kolačići (Cookies)',
    content: `Koristimo kolačiće za poboljšanje funkcionalnosti stranice i analizu posjećenosti. Možete upravljati postavkama kolačića u svom pregledniku. Detalji o korištenju kolačića dostupni su u našoj Politici kolačića.`,
  },
  {
    title: 'Kontakt i pritužbe',
    content: `Za sva pitanja u vezi s obradom vaših osobnih podataka možete nas kontaktirati na: info@bioclinica.swp ili pisanim putem na adresu sjedišta tvrtke. Pravo je podnijeti pritužbu Agenciji za zaštitu osobnih podataka (AZOP), Selska cesta 136, 10000 Zagreb, www.azop.hr.`,
  },
  {
    title: 'Izmjene Politike privatnosti',
    content: `Zadržavamo pravo izmjene ove Politike privatnosti. O svim značajnim izmjenama bit ćete obaviješteni putem e-pošte ili obavijesti na web stranici. Datum posljednje izmjene: 1. siječnja 2025.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ background: '#c91d22', minHeight: '36vh' }}>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 55% 50%, #e8302a 0%, #c91d22 45%, #8b1115 100%)' }} />
          <div className="pointer-events-none absolute inset-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="priv-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#priv-grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20 py-16 lg:py-24">
            <nav className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-10">
              <Link to="/" className="hover:text-white/70 transition-colors">Početna</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Privatnost</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-8 bg-white/40" />
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.22em]">Pravne informacije</span>
              </div>
              <h1 className="font-black text-white tracking-[-0.04em] leading-[1.0] mb-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}>
                Politika privatnosti
              </h1>
              <p className="text-white/50 text-[14px] font-normal">Posljednja izmjena: 1. siječnja 2025.</p>
            </motion.div>
          </div>
        </section>

        {/* ── SADRŽAJ ── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-8 sm:px-14">
            <div className="flex flex-col gap-12">
              {sections.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.04}>
                  <div className="border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                    <h2 className="font-black text-[#111] mb-5 tracking-[-0.02em]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem' }}>
                      {i + 1}. {s.title}
                    </h2>
                    {s.content && (
                      <p className="text-[15px] text-gray-500 leading-[1.75] font-normal mb-4">{s.content}</p>
                    )}
                    {s.bullets && (
                      <ul className="flex flex-col gap-2">
                        {s.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3 text-[15px] text-gray-500 leading-[1.75] font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e5252a] flex-shrink-0 mt-[0.55em]" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
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
