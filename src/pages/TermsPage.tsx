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
    title: 'Opće odredbe',
    content: `Ovi Uvjeti korištenja reguliraju upotrebu web stranice Bioclinica SWP d.o.o. (dalje: "Stranica") i sve usluge koje pruža Bioclinica SWP d.o.o. (dalje: "mi" ili "Bioclinica"). Korištenjem ove Stranice prihvaćate ove Uvjete u cijelosti. Ako se ne slažete s ovim Uvjetima, molimo vas da prestanete koristiti Stranicu.`,
  },
  {
    title: 'Informacije o proizvodima',
    content: `Svi Bioclinica proizvodi su dodaci prehrani i nisu lijekovi. Informacije objavljene na ovoj Stranici su isključivo informativnog karaktera i ne mogu se smatrati medicinskim savjetom. Uvijek se posavjetujte s liječnikom ili ljekarnarom prije upotrebe bilo kojeg dodatka prehrani, posebno ako uzimate lijekove ili imate zdravstvene tegobe.`,
  },
  {
    title: 'Narudžbe i kupovina',
    bullets: [
      'Proizvodi Bioclinica dostupni su isključivo putem ovlaštenih online partnera i ljekarni.',
      'Bioclinica SWP d.o.o. ne prodaje proizvode izravno putem ove web stranice.',
      'Za narudžbe, uvjete isporuke i reklamacije obratite se ovlaštenom prodajnom partneru.',
      'Cijene i dostupnost proizvoda mogu se razlikovati ovisno o prodajnom kanalu.',
    ],
  },
  {
    title: 'Intelektualno vlasništvo',
    content: `Svi sadržaji na Stranici, uključujući ali ne ograničavajući se na tekst, slike, grafike, logotipove, ikone i softver, zaštićeni su autorskim pravom i vlasništvo su Bioclinica SWP d.o.o. ili su korišteni uz odgovarajuću licencu. Nije dopušteno kopiranje, reproduciranje, distribucija ili mijenjanje sadržaja bez pisanog odobrenja.`,
  },
  {
    title: 'Ograničenje odgovornosti',
    bullets: [
      'Bioclinica ne jamči da će Stranica biti dostupna bez prekida ili pogrešaka.',
      'Nismo odgovorni za eventualnu štetu nastalu korištenjem ili nemogućnošću korištenja Stranice.',
      'Veze na vanjske web stranice pružaju se isključivo radi informiranja; ne preuzimamo odgovornost za njihov sadržaj.',
      'Rezultati upotrebe proizvoda mogu se razlikovati od osobe do osobe.',
    ],
  },
  {
    title: 'Zabranjene radnje',
    bullets: [
      'Korištenje Stranice u nezakonite svrhe ili na način koji krši ove Uvjete',
      'Pokušaj neovlaštenog pristupa sustavima ili bazama podataka',
      'Objavljivanje lažnih, obmanjujućih ili uvredljivih sadržaja',
      'Distribucija računalnih virusa ili zlonamjernog softvera',
      'Prikupljanje osobnih podataka korisnika bez njihovog pristanka',
    ],
  },
  {
    title: 'Mjerodavno pravo i nadležnost',
    content: `Na ove Uvjete primjenjuje se pravo Republike Hrvatske. Za sve sporove koji mogu nastati iz korištenja ove Stranice, nadležan je stvarno nadležni sud u Zagrebu. Ako ste potrošač s prebivalištem u drugoj državi EU, možete imati pravo koristiti platformu za online rješavanje sporova (ORS platforma Europske komisije).`,
  },
  {
    title: 'Izmjene Uvjeta korištenja',
    content: `Bioclinica SWP d.o.o. zadržava pravo izmjene ovih Uvjeta u bilo kojem trenutku. Izmijenjeni Uvjeti stupaju na snagu objavom na Stranici. Nastavak korištenja Stranice nakon objave izmjena smatra se prihvaćanjem novih Uvjeta. Datum posljednje izmjene: 1. siječnja 2025.`,
  },
  {
    title: 'Kontakt',
    content: `Za sva pitanja u vezi s ovim Uvjetima možete nas kontaktirati: e-mail: info@bioclinica.swp, telefon: 0800 123 456, adresa: Radnička cesta 80, 10000 Zagreb, Hrvatska.`,
  },
];

export default function TermsPage() {
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
                <pattern id="terms-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#terms-grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20 py-16 lg:py-24">
            <nav className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-10">
              <Link to="/" className="hover:text-white/70 transition-colors">Početna</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Uvjeti korištenja</span>
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
                Uvjeti korištenja
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
