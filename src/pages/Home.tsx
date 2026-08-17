import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft,
  Activity, TrendingDown, ShieldPlus,
  Leaf, FlaskConical, ShieldCheck, Heart,
  Award,
} from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
          strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
import { api, formatDate, API_BASE } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, type PanInfo } from 'motion/react';
import { Reveal, StaggerGroup, StaggerItem, ParallaxBg, BlurImage, EASE } from '../components/motion';

const HERO_KV_SLIDES = [
  {
    id: 1, product_id: 'citrax-forte-30',
    desktop: '/slike/hero/hero-desktop-citrax-forte.png', mobile: '/slike/hero/hero-mobile-citrax-forte.png',
    tagline: 'PRIRODAN PUT DO VITKE LINIJE',
    name1: 'CITRAX', name2: '', name2b: 'FORTE',
    sub: 'Snagom gorke narandže pomaže u gubitku kilograma i kontroli apetita.',
    accentColor: '#e5252a', glow: 'rgba(229,37,42,0.35)',
    pictograms: [
      { src: '/slike/Pictograms_Weight loss .png', label: 'Gubitak kilograma' },
      { src: '/slike/Pictograms_Appetite control .png', label: 'Kontrola apetita' },
      { src: '/slike/Pictograms_Fat breakdown .png', label: 'Razgradnja masti' },
    ],
  },
  {
    id: 2, product_id: 'kurkuma-cream-cold-225',
    desktop: '/slike/hero/hero-desktop-kurkuma-cream-cold.png', mobile: '/slike/hero/hero-mobile-kurkuma-cream-cold.png',
    tagline: 'HLADNA NJEGA ZA UMORENE MIŠIĆE',
    name1: 'KURKUMA', name2: 'CREAM', name2b: 'COLD',
    sub: 'Uz efekat hlađenja i 15 biljnih ekstrakata, osvježava i opušta umorne mišiće.',
    accentColor: '#0ea5e9', glow: 'rgba(14,165,233,0.35)',
    pictograms: [
      { src: '/slike/Pictograms_Cooling effect.png', label: 'Efekat hlađenja' },
      { src: '/slike/Pictograms_Muscle relax cold.svg', label: 'Opuštanje mišića' },
      { src: '/slike/Pictograms_After-sport relaxation .png', label: 'Sportski oporavak' },
    ],
  },
  {
    id: 3, product_id: 'kurkuma-cream-hot-225',
    desktop: '/slike/hero/hero-desktop-kurkuma-cream-hot.png', mobile: '/slike/hero/hero-mobile-kurkuma-cream-hot.png',
    tagline: 'TOPLINA KOJA PRUŽA OLAKŠANJE',
    name1: 'KURKUMA', name2: 'CREAM', name2b: 'HOT',
    sub: 'Uz efekat topline i 11 biljnih ekstrakata, opušta napete mišiće i ukočene zglobove.',
    accentColor: '#e5252a', glow: 'rgba(229,37,42,0.35)',
    pictograms: [
      { src: '/slike/Pictograms_Warming effect .png', label: 'Efekt topline' },
      { src: '/slike/Pictograms_Circulation.png', label: 'Bolja prokrvljenost' },
      { src: '/slike/Pictograms_Muscles joints.svg', label: 'Mišići i zglobovi' },
    ],
  },
  {
    id: 4, product_id: 'kurkuma-forte-30',
    desktop: '/slike/hero/hero-desktop-kurkuma-forte.png', mobile: '/slike/hero/hero-mobile-kurkuma-forte.png',
    tagline: 'SLOBODA POKRETA',
    name1: 'KURKUMA', name2: '', name2b: 'FORTE',
    sub: 'Kurkumin i prirodni antioksidansi za zdrave zglobove, smanjenje upala i slobodu pokreta.',
    accentColor: '#e5252a', glow: 'rgba(229,37,42,0.35)',
    pictograms: [
      { src: '/slike/Pictograms_Joints_ bones _ muscles .png', label: 'Zglobovi, kosti i mišići' },
      { src: '/slike/Pictograms_Mobility.svg', label: 'Pokretljivost' },
      { src: '/slike/Pictograms_Connective tissue .png', label: 'Vezivno tkivo' },
    ],
  },
  {
    id: 5, product_id: 'urasan-forte-30',
    desktop: '/slike/hero/hero-desktop-urasan-forte.png', mobile: '/slike/hero/hero-mobile-urasan-forte.png',
    tagline: 'PODRŠKA ZDRAVLJU PROSTATE',
    name1: 'URASAN', name2: '', name2b: 'FORTE',
    sub: 'Ekstrakt sjemena bundeve i cink podržavaju urinarni komfor i mušku vitalnost.',
    accentColor: '#e5252a', glow: 'rgba(229,37,42,0.35)',
    pictograms: [
      { src: '/slike/Pictograms_Pumpkin seed.svg', label: 'Sjeme bundeve' },
      { src: "/slike/Pictograms_Men's health .png", label: 'Muško zdravlje' },
      { src: '/slike/Pictograms_Urinary function .png', label: 'Urinarni sistem' },
      { src: '/slike/Pictograms_Zinc.png', label: 'Cink' },
    ],
  },
];

/* Hero text stagger varijante */
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' as const } },
};
const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const heroLine = {
  hidden: { y: '105%' },
  show: { y: 0, transition: { duration: 0.7, ease: EASE } },
};

const AUTOPLAY_MS = 6000;

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slides, setSlides] = useState(HERO_KV_SLIDES);
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    /* Hero slajdovi iz admina; hardkodirani KV set je fallback */
    fetch(`${API_BASE}/hero-slides`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any[] | null) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data
          .filter((s: any) => s.image_desktop || s.image_url)
          .map((s: any) => ({
            id: s.id,
            product_id: s.product_id || '',
            desktop: s.image_desktop || s.image_url,
            mobile: s.image_mobile || s.image_desktop || s.image_url,
            tagline: s.tagline || '',
            name1: s.name1, name2: s.name2 || '', name2b: s.name2b || '',
            sub: s.sub || '',
            accentColor: s.accent_color || '#e5252a',
            glow: (s.accent_color || '#e5252a') + '59',
            pictograms: Array.isArray(s.pictograms) ? s.pictograms : [],
          }));
        if (mapped.length) { setSlides(mapped); setSlide(0); }
      })
      .catch(() => {});
    api.getProducts().then(data => setProducts(data.map((p: any) => ({
      ...p, imageUrl: p.image_url, categoryId: p.category_id, shortDescription: p.short_description,
    })))).catch(() => {});
    api.getBlogPosts().then(data => setBlogPosts(data.map((p: any) => ({
      ...p, imageUrl: p.image_url, date: formatDate(p.published_at),
    })))).catch(() => {});
  }, []);

  /* auto-advance — `slide` u deps: ručna navigacija resetuje 6s prozor */
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slide, paused, slides.length]);

  /* hero scroll parallax — slika sporije klizi, tekst fade-out */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], ['0%', '12%']);
  const heroTextY = useTransform(heroProgress, [0, 0.7], [0, -40]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  /* swipe na mobile */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) {
      setSlide(p => (p + 1) % slides.length);
    } else if (info.offset.x > 60 || info.velocity.x > 400) {
      setSlide(p => (p - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @media (max-width: 767px) {
          .bg-kategorije { background-position: 80% center !important; }
          .bg-trust      { background-position: 18% center !important; }
        }
      `}</style>
      <PageSeo pageKey="home" fallbackTitle="Bioclinica - Prirodni dodaci ishrani" fallbackDescription="Otkrijte Bioclinica liniju prirodnih dodataka ishrani za zdravlje zglobova, prostate i mršavljenje." />
      <Header />
      <main className="flex-grow">

        {/* ═══════════════════════════════════════════════════════
            HERO — full bleed KV background + tekst overlay
        ═══════════════════════════════════════════════════════ */}
        <section ref={heroRef}
          className="relative overflow-hidden w-full min-h-[500px] h-[calc(100vh-76px)] md:h-[calc(100vh-112px)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>

          {/* KV slika — fullscreen background + Ken Burns + scroll parallax.
              Crossfade (bez mode="wait"): nova slika se pretapa preko stare — nema bljeska */}
          <motion.div className="absolute inset-0" style={{ y: reduceMotion ? 0 : heroImgY, willChange: 'transform' }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={slide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-0">
                <picture>
                  <source media="(max-width: 767px)" srcSet={slides[slide].mobile} />
                  <motion.img
                    src={slides[slide].desktop}
                    alt=""
                    initial={{ scale: reduceMotion ? 1 : 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 7, ease: 'linear' }}
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Swipe overlay — samo touch/mobile, ispod teksta i kontrola */}
          <motion.div
            className="absolute inset-0 z-[5] lg:hidden"
            style={{ touchAction: 'pan-y' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setPaused(true)}
            onDragEnd={(e, info) => { handleDragEnd(e, info); setPaused(false); }}
          />

          {/* Tekst overlay — per-element stagger; mobile: centriran u gornjoj polovini (proizvod je na KV slici dole) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[45%] lg:h-full z-10 flex items-center pointer-events-none"
            style={{ y: reduceMotion ? 0 : heroTextY, opacity: reduceMotion ? 1 : heroTextOpacity }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${slide}`}
                variants={heroContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-full px-6 sm:px-10">
                <div className="max-w-[90rem] mx-auto">
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-[600px] mx-auto lg:mx-0 pointer-events-auto">

                    <motion.span variants={heroItem}
                      className="text-[11px] font-black uppercase tracking-[0.22em] mb-4 lg:mb-5 block"
                      style={{ color: slides[slide].accentColor }}>
                      {slides[slide].tagline}
                    </motion.span>

                    <div className="mb-5 lg:mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.4rem, 9vw, 4.8rem)' }}>
                      <div className="overflow-hidden">
                        <motion.div variants={heroLine} className="font-black text-[#111] tracking-[-0.03em] leading-[0.95]">
                          {slides[slide].name1}
                        </motion.div>
                      </div>
                      <div className="overflow-hidden">
                        <motion.div variants={heroLine} className="font-black tracking-[-0.03em] leading-[0.95]">
                          {slides[slide].name2 && <span className="text-[#111]">{slides[slide].name2} </span>}
                          <span style={{ color: slides[slide].accentColor }}>{slides[slide].name2b}</span>
                        </motion.div>
                      </div>
                    </div>

                    <motion.p variants={heroItem}
                      className="hidden lg:block text-gray-700 leading-[1.7] mb-7 lg:mb-8 font-normal max-w-[340px]"
                      style={{ fontSize: '1rem' }}>
                      {slides[slide].sub}
                    </motion.p>

                    <motion.div variants={heroItem}
                      className="hidden lg:flex items-start justify-center lg:justify-start gap-5 sm:gap-6 mb-8 lg:mb-9">
                      {slides[slide].pictograms.map((pic, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 text-center" style={{ maxWidth: 84 }}>
                          <img src={pic.src} alt={pic.label} className="w-12 h-12 object-contain" />
                          <span className="text-[10px] text-gray-600 font-semibold leading-tight">{pic.label}</span>
                        </div>
                      ))}
                    </motion.div>

                    <motion.div variants={heroItem}>
                      <Link to={`/product/${slides[slide].product_id}`}
                        className="inline-flex items-center gap-3 h-[52px] px-8 text-white font-bold text-[13px] uppercase tracking-[0.08em] rounded-full hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
                        style={{ background: slides[slide].accentColor, boxShadow: `0 8px 28px ${slides[slide].glow}` }}>
                        Kupi odmah <ArrowRight size={14} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dots (autoplay progress) + strelice */}
          <div className="absolute bottom-8 left-0 right-0 z-20 px-6 sm:px-10">
            <div className="max-w-[90rem] mx-auto flex items-center gap-5">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    aria-label={`Slajd ${i + 1}`}
                    className="relative rounded-full transition-all duration-300 overflow-hidden"
                    style={{
                      width: i === slide ? 26 : 8, height: 8,
                      background: i === slide ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.22)',
                    }}>
                    {i === slide && !reduceMotion && !paused && (
                      <motion.span
                        key={`progress-${slide}`}
                        className="absolute inset-0 rounded-full"
                        style={{ background: slides[slide].accentColor, originX: 0 }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                      />
                    )}
                    {i === slide && (reduceMotion || paused) && (
                      <span className="absolute inset-0 rounded-full" style={{ background: slides[slide].accentColor }} />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setSlide(p => (p - 1 + slides.length) % slides.length)}
                  aria-label="Prethodni"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-gray-500 bg-white/40 backdrop-blur-sm hover:text-[#111] hover:border-black/30 transition-colors duration-200">
                  <ArrowLeft size={15} />
                </motion.button>
                <motion.button
                  onClick={() => setSlide(p => (p + 1) % slides.length)}
                  aria-label="Sljedeći"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-gray-500 bg-white/40 backdrop-blur-sm hover:text-[#111] hover:border-black/30 transition-colors duration-200">
                  <ArrowRight size={15} />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PROIZVODI — "Izbor naših kupaca"
        ═══════════════════════════════════════════════════════ */}
        <section id="proizvodi" className="py-12 lg:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14">

            {/* Header */}
            <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
              <Reveal>
                <p className="section-label mb-3">Najprodavaniji proizvodi</p>
                <h2 className="font-black text-[#111] leading-[0.92] tracking-[-0.04em]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  Izbor naših kupaca.
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="hidden sm:block flex-shrink-0 pb-1">
                <Link to="/products"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111] hover:text-[#e5252a] transition-colors duration-200 group">
                  Pogledaj sve proizvode
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Reveal>
            </div>

            {(() => {
              const PRIORITY = ['urasan-forte-30', 'kurkuma-forte-30', 'kurkuma-cream-cold-225', 'kurkuma-cream-hot-225', 'citrax-forte-30'];
              const sorted = [...products].sort((a, b) => {
                const ai = PRIORITY.indexOf(a.id); const bi = PRIORITY.indexOf(b.id);
                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
              });
              const main = sorted.slice(0, 4);
              const rest = sorted.slice(4);
              const ratings = [4.8, 4.6, 4.5, 4.3, 4.7, 4.2, 4.4, 4.1];
              const counts  = [112, 94, 78, 65, 88, 51, 73, 42];
              return (
                <>
                  {/* Glavna 4 kartice */}
                  <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.07}>
                    {main.map((p, idx) => (
                      <StaggerItem key={p.id}>
                        <Link to={`/product/${p.id}`}
                          className="group relative flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-gray-100 hover:shadow-[0_8px_40px_rgba(229,37,42,0.10)] hover:-translate-y-1 transition-all duration-300 h-full">
                          {idx === 0 && (
                            <span className="absolute top-4 left-4 z-10 bg-[#f59e0b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              Najprodavaniji
                            </span>
                          )}
                          <div className="bg-[#f8f8f8] overflow-hidden aspect-[4/3] sm:aspect-square">
                            <img src={p.imageUrl} alt={p.name}
                              className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-[1.04] transition-transform duration-500" />
                          </div>
                          <div className="p-5 flex flex-col gap-3 flex-1">
                            <div>
                              <p className="font-black text-[#111] text-[15px] leading-snug"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{p.name}</p>
                              {p.packaging && <p className="text-[12px] text-gray-400 mt-0.5">{p.packaging}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <StarRating rating={ratings[idx] ?? 4.4} />
                              <span className="text-[12px] text-gray-400">({counts[idx] ?? 56})</span>
                            </div>
                            {Number(p.price) > 0 && (
                              <p className="font-black text-[#111] text-[1.25rem] tracking-[-0.02em]"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {Number(p.price).toFixed(2)} €
                              </p>
                            )}
                            <div className="mt-auto flex items-center justify-center h-11 rounded-xl bg-[#e5252a] text-white font-bold text-[12px] uppercase tracking-wide hover:bg-[#c91d22] transition-colors duration-200 cursor-pointer">
                              Detaljnije
                            </div>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>

                  {/* Ostali proizvodi — kompaktne kartice */}
                  {rest.length > 0 && (
                    <StaggerGroup className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" stagger={0.06}>
                      {rest.map((p) => (
                        <StaggerItem key={p.id} y={16}>
                          <Link to={`/product/${p.id}`}
                            className="group flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex-shrink-0 w-14 h-14 bg-[#f8f8f8] rounded-xl overflow-hidden">
                              <img src={p.imageUrl} alt={p.name}
                                className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#111] text-[13px] leading-snug truncate"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{p.name}</p>
                              <p className="text-[12px] text-gray-400 mt-0.5">
                                {Number(p.price) > 0 ? `${Number(p.price).toFixed(2)} €` : p.packaging}
                              </p>
                            </div>
                          </Link>
                        </StaggerItem>
                      ))}
                    </StaggerGroup>
                  )}
                </>
              );
            })()}

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CATEGORIES — "Priroda kao izvor vašeg zdravlja"
        ═══════════════════════════════════════════════════════ */}
        <section id="kategorije" className="relative py-14 sm:py-24 overflow-hidden">

          <ParallaxBg src="/slike/background.png" speed={0.1} className="bg-kategorije">
            {/* Tamni overlay za čitljivost */}
            <div className="absolute inset-0" style={{ background: 'rgba(5, 22, 8, 0.42)' }} />
          </ParallaxBg>

          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14">

            <Reveal className="text-center mb-8 sm:mb-14">
              <p className="section-label label-white justify-center mb-4">Kategorije</p>
              <h2 className="font-black text-white leading-[0.95] tracking-[-0.03em]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}>
                Priroda kao izvor vašeg zdravlja
              </h2>
            </Reveal>

            <StaggerGroup className="grid md:grid-cols-3 gap-4" stagger={0.08}>
              {[
                {
                  id: 'zdravlje-prostate',
                  Icon: ShieldPlus,
                  label: 'Zdravlje prostate',
                  desc: 'Proizvodi formulirani za podršku zdravlju prostate i urinarnih funkcija.',
                },
                {
                  id: 'kosti-zglobovi-misici',
                  Icon: Activity,
                  label: 'Kosti i zglobovi',
                  desc: 'Prirodna podrška za fleksibilnost zglobova, hrskavicu i kosti.',
                },
                {
                  id: 'mrsavljenje',
                  Icon: TrendingDown,
                  label: 'Mršavljenje',
                  desc: 'Podrška metabolizmu i kontroli tjelesne težine – prirodno i efikasno.',
                },
              ].map((cat) => (
                <StaggerItem key={cat.id}>
                  <Link to={`/category/${cat.id}`}
                    className="group flex flex-row items-start gap-5 p-6 rounded-2xl hover:-translate-y-1
                      bg-[rgba(10,35,14,0.55)] hover:bg-[rgba(10,45,16,0.65)]
                      border border-white/12 hover:border-white/22
                      backdrop-blur-[8px] transition-all duration-300">

                    {/* Ikona — krug */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <cat.Icon size={24} className="text-white" strokeWidth={1.5} />
                    </div>

                    {/* Tekst */}
                    <div className="flex flex-col gap-2 min-w-0">
                      <h3 className="font-bold text-white text-[1.05rem] leading-snug"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {cat.label}
                      </h3>
                      <p className="text-white/55 text-[13px] leading-relaxed">
                        {cat.desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-white/70 text-[13px] font-semibold mt-1 group-hover:text-white group-hover:gap-2.5 transition-all duration-200">
                        Pogledaj proizvode <ArrowRight size={13} />
                      </span>
                    </div>

                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TRUST STRIP — "Samo ono što vam je potrebno"
        ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 220 }}>

          <ParallaxBg src="/slike/background-2.png" speed={0.08} className="bg-trust">
            {/* Lagani overlay da tekst bude čitljiv na krem pozadini */}
            <div className="absolute inset-0" style={{ background: 'rgba(255,252,245,0.30)' }} />
          </ParallaxBg>

          <div className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-14 py-10 sm:py-14">
            {/* Centar — label + naslov + 4 feature */}
            <div className="flex flex-col items-center text-center">

              <Reveal>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e5252a] mb-3">
                  Čisto iz prirode, provjereno za vas
                </p>
                <h2 className="font-black text-[#111] tracking-[-0.03em] leading-tight mb-7 sm:mb-10"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
                  Samo ono što vam je potrebno
                </h2>
              </Reveal>

              <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl" stagger={0.08}>
                {[
                  {
                    Icon: Leaf,
                    title: 'Prirodni sastojci',
                    desc: 'Koristimo pažljivo odabrane biljne ekstrakte.',
                  },
                  {
                    Icon: FlaskConical,
                    title: 'Naučno potkrijepljeno',
                    desc: 'Recepture razvijene u saradnji sa stručnjacima.',
                  },
                  {
                    Icon: ShieldCheck,
                    title: 'Kvalitet bez kompromisa',
                    desc: 'Proizvedeno po najvišim GMP standardima.',
                  },
                  {
                    Icon: Heart,
                    title: 'Brinemo o vama',
                    desc: 'Vaše zdravlje nam je na prvom mjestu.',
                  },
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.10)' }}>
                        <item.Icon size={20} className="text-[#333]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-bold text-[#111] text-[14px] leading-snug mb-1"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {item.title}
                        </p>
                        <p className="text-[#555] text-[12px] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOG — "Naučite više, živite bolje"
        ═══════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14">

            {/* Header — naslov lijevo, link desno */}
            <div className="flex items-end justify-between gap-6 mb-7 sm:mb-10">
              <Reveal>
                <p className="section-label mb-3">Savjeti &amp; znanje</p>
                <h2 className="font-black text-[#111] leading-[0.95] tracking-[-0.04em]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  Naučite više, živite bolje
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="hidden sm:block flex-shrink-0 pb-1">
                <Link to="/news"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111] hover:text-[#e5252a] transition-colors duration-200 group">
                  Pogledaj sve članke
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Reveal>
            </div>

            {/* 3 kartice */}
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post, i) => {
                const tags = ['Zdravlje', 'Ishrana', 'Imunitet'];
                const tag = post.category || tags[i % tags.length];
                return (
                  <Reveal key={post.id} delay={i * 0.08}>
                    <Link to={`/news/${post.id}`}
                      className="group flex flex-col h-full rounded-[1.25rem] overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

                      {/* Slika — čista, bez overlay-a */}
                      <div className="relative overflow-hidden rounded-[1.25rem]" style={{ aspectRatio: '16/9' }}>
                        <BlurImage src={post.imageUrl} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04]" />
                        {/* Kategorija tag — top left */}
                        <span className="absolute top-4 left-4 bg-[#e5252a] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          {tag}
                        </span>
                      </div>

                      {/* Sadržaj — ispod slike */}
                      <div className="flex flex-col flex-1 pt-5 pb-1">
                        <h3 className="font-black text-[#111] text-[17px] leading-snug mb-2 line-clamp-2 group-hover:text-[#e5252a] transition-colors duration-200"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-[13px] leading-relaxed flex-1 mb-5 line-clamp-3 font-normal">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[#e5252a] text-[13px] font-bold group-hover:gap-2.5 transition-all duration-200">
                            Pročitaj više <ArrowRight size={13} />
                          </span>
                          {post.date && (
                            <span className="text-gray-400 text-[12px]">{post.date}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CTA — "Ojačajte svoje zdravlje, prirodnim putem."
        ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 220 }}>

          <ParallaxBg src="/slike/background-3.png" speed={0.08} />

          <div className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-14 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 lg:max-w-[68%]">

              {/* Lijevo — label + naslov + opis */}
              <Reveal className="flex-1 min-w-0">
                <p className="text-white/65 text-[11px] font-black uppercase tracking-[0.20em] mb-4">
                  Vaše zdravlje je najbolja investicija
                </p>
                <h2 className="font-black text-white leading-[1.05] tracking-[-0.03em] mb-4"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
                  Ojačajte svoje zdravlje,<br />prirodnim putem.
                </h2>
                <p className="text-white/60 text-[14px] leading-relaxed max-w-[340px]">
                  Odaberite provjerene proizvode napravljene od prirodnih sastojaka koji vašem tijelu daju ono što mu je zaista potrebno.
                </p>
              </Reveal>

              {/* Desno — dugmad + trust badges */}
              <Reveal delay={0.12} className="flex flex-col gap-5 flex-shrink-0">
                {/* Dugmad */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link to="/contact"
                    className="inline-flex items-center gap-2.5 h-12 px-7 bg-white text-[#c91d22] font-bold text-[13px] uppercase tracking-wide rounded-full hover:bg-gray-50 transition-colors duration-200 group"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}>
                    Započnite danas
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link to="/about"
                    className="inline-flex items-center h-12 px-7 text-white font-bold text-[13px] uppercase tracking-wide rounded-full
                      border-[1.5px] border-white/35 hover:border-white/70 hover:bg-white/8
                      active:scale-[0.97] transition-all duration-200">
                    Saznajte više
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-5 flex-wrap">
                  {[
                    { Icon: ShieldCheck, text: 'Sigurna kupovina' },
                    { Icon: Award,       text: '100% garancija kvaliteta' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5">
                      <Icon size={14} className="text-white/55" strokeWidth={1.8} />
                      <span className="text-white/55 text-[12px] font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
