import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import { Reveal } from '../components/motion';

const sections = [
  {
    title: 'Opće odredbe',
    content: `Ovi Uslovi korištenja regulišu upotrebu web stranice brenda Bioclinica SWP (dalje: "Stranica"), čiji je vlasnik kompanija Sun Wave Pharma (dalje: "mi"). Korištenjem ove Stranice prihvatate ove Uslove u cijelosti. Ako se ne slažete s ovim Uslovima, molimo vas da prestanete koristiti Stranicu.`,
  },
  {
    title: 'Informacije o proizvodima',
    content: `Svi Bioclinica proizvodi su dodaci ishrani i nisu lijekovi. Informacije objavljene na ovoj Stranici isključivo su informativnog karaktera i ne mogu se smatrati medicinskim savjetom. Uvijek se posavjetujte sa ljekarom ili farmaceutom prije upotrebe bilo kojeg dodatka ishrani, posebno ako uzimate lijekove ili imate zdravstvene tegobe.`,
  },
  {
    title: 'Narudžbe i kupovina',
    bullets: [
      'Bioclinica proizvodi dostupni su isključivo putem ovlaštenih online partnera i apoteka.',
      'Sun Wave Pharma ne prodaje proizvode direktno putem ove web stranice.',
      'Za narudžbe, uslove isporuke i reklamacije obratite se ovlaštenom prodajnom partneru.',
      'Cijene i dostupnost proizvoda mogu se razlikovati zavisno od prodajnog kanala.',
    ],
  },
  {
    title: 'Intelektualno vlasništvo',
    content: `Svi sadržaji na Stranici, uključujući ali ne ograničavajući se na tekst, slike, grafike, logotipe, ikone i softver, zaštićeni su autorskim pravom i vlasništvo su kompanije Sun Wave Pharma ili se koriste uz odgovarajuću licencu. Nije dozvoljeno kopiranje, reprodukovanje, distribucija ili mijenjanje sadržaja bez pisanog odobrenja.`,
  },
  {
    title: 'Ograničenje odgovornosti',
    bullets: [
      'Ne garantujemo da će Stranica biti dostupna bez prekida ili grešaka.',
      'Nismo odgovorni za eventualnu štetu nastalu korištenjem ili nemogućnošću korištenja Stranice.',
      'Linkovi na vanjske web stranice pružaju se isključivo radi informisanja; ne preuzimamo odgovornost za njihov sadržaj.',
      'Rezultati upotrebe proizvoda mogu se razlikovati od osobe do osobe.',
    ],
  },
  {
    title: 'Zabranjene radnje',
    bullets: [
      'Korištenje Stranice u nezakonite svrhe ili na način koji krši ove Uslove',
      'Pokušaj neovlaštenog pristupa sistemima ili bazama podataka',
      'Objavljivanje lažnih, obmanjujućih ili uvredljivih sadržaja',
      'Distribucija računarskih virusa ili zlonamjernog softvera',
      'Prikupljanje ličnih podataka korisnika bez njihove saglasnosti',
    ],
  },
  {
    title: 'Mjerodavno pravo i nadležnost',
    content: `Na ove Uslove primjenjuje se pravo Bosne i Hercegovine. Za sve sporove koji mogu nastati iz korištenja ove Stranice nadležan je stvarno nadležni sud u Sarajevu.`,
  },
  {
    title: 'Izmjene Uslova korištenja',
    content: `Sun Wave Pharma zadržava pravo izmjene ovih Uslova u bilo kojem trenutku. Izmijenjeni Uslovi stupaju na snagu objavom na Stranici. Nastavak korištenja Stranice nakon objave izmjena smatra se prihvatanjem novih Uslova. Datum posljednje izmjene: 1. januar 2025.`,
  },
  {
    title: 'Kontakt',
    content: `Za sva pitanja u vezi s ovim Uslovima možete nas kontaktirati putem e-maila: adriaticsm@sunwavepharma.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo fallbackTitle="Uslovi korištenja - Bioclinica" />
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
              <span className="text-white/70">Uslovi korištenja</span>
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
                Uslovi korištenja
              </h1>
              <p className="text-white/50 text-[14px] font-normal">Posljednja izmjena: 1. januar 2025.</p>
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
