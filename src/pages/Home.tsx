import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft,
  Activity, TrendingDown, ShieldPlus,
  Leaf, FlaskConical, ShieldCheck, Heart,
  Truck, Award,
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
import { api } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';

/* ─── Scroll reveal ─── */
function Reveal({ children, delay = 0, y = 40, className = '' }:
  { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const FALLBACK_SLIDES = [
  {
    id: 1,
    product_id: 'kurkuma-hot-cream-225',
    tagline: 'TOPLINA KOJA PRUŽA OLAKŠANJE',
    name1: 'KURKUMA',
    name2: 'CREAM',
    name2b: 'HOT',
    sub: 'Pruža osjećaj ugodnosti i prijatne topline uz 11 pažljivo odabranih biljnih ekstrakata.',
    img: '/slike/Kurkuma hot cream.png',
    bg: 'linear-gradient(130deg, #fdf8f2 0%, #fef4e4 55%, #fde8c4 100%)',
    bgColor: '#fdf8f2',
    accentColor: '#d4600a',
    glow: 'rgba(220, 100, 0, 0.14)',
    pictograms: [
      { src: '/slike/Pictograms_Warming effect .png', label: '11 pažljivo odabranih biljnih ekstrakata' },
      { src: '/slike/Pictograms_Application zone .png', label: 'Dermatološki testirano' },
      { src: '/slike/Pictograms_Joint zone (rheumatic) .png', label: 'Quality guarantee' },
    ],
  },
  {
    id: 2,
    product_id: 'urasan-forte-30',
    tagline: 'PODRŠKA ZDRAVLJU PROSTATE',
    name1: 'URASAN',
    name2: '',
    name2b: 'FORTE',
    sub: 'Prirodni ekstrakti koji podržavaju zdravlje urološkog sustava i kvalitetu svakodnevnog života.',
    img: '/slike/Urasan Forte.png',
    bg: 'linear-gradient(130deg, #f8f0ff 0%, #f2eaff 55%, #e8d8ff 100%)',
    bgColor: '#f8f0ff',
    accentColor: '#7c3aed',
    glow: 'rgba(124, 58, 237, 0.12)',
    pictograms: [
      { src: "/slike/Pictograms_Men's health .png", label: 'Muško zdravlje' },
      { src: '/slike/Pictograms_Urinary function .png', label: 'Urinarni sustav' },
      { src: '/slike/Pictograms_Zinc.png', label: 'Cink' },
    ],
  },
  {
    id: 3,
    product_id: 'citrax-forte-30',
    tagline: 'PRIRODAN PUT DO VITKE LINIJE',
    name1: 'CITRAX',
    name2: '',
    name2b: 'FORTE',
    sub: 'Podržava metabolizam i kontrolu tjelesne težine uz prirodne, klinički provjerene sastojke.',
    img: '/slike/Citrax Forte.png',
    bg: 'linear-gradient(130deg, #f0faf4 0%, #e6f7ec 55%, #d0edda 100%)',
    bgColor: '#f0faf4',
    accentColor: '#16a34a',
    glow: 'rgba(22, 163, 74, 0.12)',
    pictograms: [
      { src: '/slike/Pictograms_Weight loss .png', label: 'Gubitak težine' },
      { src: '/slike/Pictograms_Appetite control .png', label: 'Kontrola apetita' },
      { src: '/slike/Pictograms_Fat breakdown .png', label: 'Razgradnja masti' },
    ],
  },
  {
    id: 4,
    product_id: 'kurkuma-forte-30',
    tagline: 'SNAGA PRIRODE ZA VAŠE ZGLOBOVE',
    name1: 'KURKUMA',
    name2: '',
    name2b: 'FORTE',
    sub: 'Kurkumin i prirodni antioksidansi za zdrave zglobove, smanjenje upala i slobodu pokreta.',
    img: '/slike/Kurkuma Forte.png',
    bg: 'linear-gradient(130deg, #fffbf0 0%, #fef9e0 55%, #fdf0b8 100%)',
    bgColor: '#fffbf0',
    accentColor: '#ca8a04',
    glow: 'rgba(202, 138, 4, 0.14)',
    pictograms: [
      { src: '/slike/Pictograms_Joints_ bones _ muscles .png', label: 'Zglobovi, kosti i mišići' },
      { src: '/slike/Pictograms_Connective tissue .png', label: 'Vezivno tkivo' },
      { src: '/slike/Pictograms_After-sport relaxation .png', label: 'Oporavak nakon sporta' },
    ],
  },
];

/* stagger variant factory */
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } },
});

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hero slajdovi iz admina (ako ih ima); inače FALLBACK_SLIDES
    const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
    fetch(`${base}/hero-slides`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((p: any) => {
          let pics = p.pictograms;
          if (typeof pics === 'string') { try { pics = JSON.parse(pics); } catch { pics = []; } }
          const accent = p.accent_color || '#d4600a';
          return {
            ...p,
            img: p.image_url,
            accentColor: accent,
            glow: accent + '40',
            pictograms: Array.isArray(pics) ? pics : [],
          };
        });
        setSlides(mapped);
        setSlide(0);
      })
      .catch(() => {});
    api.getProducts().then(data => setProducts(data.map((p: any) => ({
      ...p, imageUrl: p.image_url, categoryId: p.category_id, shortDescription: p.short_description,
    })))).catch(() => {});
    api.getBlogPosts().then(data => setBlogPosts(data.map((p: any) => ({
      ...p, imageUrl: p.image_url,
    })))).catch(() => {});
  }, []);

  const cur = slides[slide] || slides[0];

  /* auto-advance */
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setSlide(p => (p + 1) % slides.length);
      setImgLoaded(false);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  /* parallax on hero image */
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 60]);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @media (max-width: 767px) {
          #kategorije { background-position: 80% center !important; }
          .trust-bg   { background-position: 18% center !important; }
        }
      `}</style>
      <PageSeo pageKey="home" fallbackTitle="Bioclinica - Prirodni dodaci prehrani" fallbackDescription="Otkrijte Bioclinica liniju prirodnih dodataka prehrani za zdravlje zglobova, prostate i mršavljenje." />
      <Header />
      <main className="flex-grow">

        {/* ═══════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="bg-white pt-4 pb-0 px-4 sm:px-6">
          <div className="max-w-[92rem] mx-auto">

            {/* Hero — seamless banner: slika desno (puna), tekst lijevo */}
            <div className="relative overflow-hidden rounded-[1.5rem]"
              style={{
                minHeight: 'clamp(560px, 76vh, 820px)',
                background: 'linear-gradient(180deg, #f0f3f2 0%, #f5f7f6 55%, #f8faf9 100%)',
              }}>

              {/* Sve u jednom AnimatePresence — slika i tekst sinhronizirani */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  className="relative lg:absolute lg:inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}>

                  {/* SLIKA desktop — desno, puna visina, lijeva ivica feathered */}
                  <img
                    src={cur.img || cur.image_url}
                    alt={cur.name1}
                    onLoad={() => setImgLoaded(true)}
                    className="hidden lg:block absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 20%)',
                      maskImage: 'linear-gradient(to right, transparent 0%, #000 20%)',
                    }}
                  />

                  {/* TEKST — lijevo (desktop), centrirano (mobilno) */}
                  <div className="relative z-10 flex flex-col justify-center lg:h-full
                    items-center text-center lg:items-start lg:text-left
                    px-7 sm:px-12 lg:px-16 xl:px-24 pt-12 pb-8 lg:py-12 max-w-[560px] mx-auto lg:mx-0">

                    <span className="text-[11px] font-black uppercase tracking-[0.22em] mb-4 lg:mb-5 block"
                      style={{ color: cur.accentColor || '#d4600a' }}>
                      {cur.tagline}
                    </span>

                    <div className="mb-5 lg:mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.4rem, 9vw, 4.8rem)' }}>
                      <div className="font-black text-[#111] tracking-[-0.03em] leading-[0.9]">{cur.name1}</div>
                      <div className="font-black tracking-[-0.03em] leading-[0.9]">
                        {cur.name2 && <span className="text-[#111]">{cur.name2} </span>}
                        <span style={{ color: cur.accentColor || '#d4600a' }}>{cur.name2b}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-[1.7] mb-7 lg:mb-8 font-normal max-w-[340px]"
                      style={{ fontSize: '1rem' }}>
                      {cur.sub}
                    </p>

                    <div className="flex items-start justify-center lg:justify-start gap-5 sm:gap-6 mb-8 lg:mb-9">
                      {(cur.pictograms || []).map((pic: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-2 text-center" style={{ maxWidth: 84 }}>
                          <img src={pic.src} alt={pic.label} className="w-12 h-12 object-contain" />
                          <span className="text-[10px] text-gray-500 font-semibold leading-tight">{pic.label}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={`/product/${cur.product_id}`}
                      className="inline-flex items-center gap-3 h-[52px] px-8 text-white font-bold text-[13px] uppercase tracking-[0.08em] rounded-full hover:opacity-90 transition-opacity"
                      style={{ background: cur.accentColor || '#d4600a', boxShadow: `0 8px 28px ${cur.glow || 'rgba(220,100,0,0.35)'}` }}>
                      Kupi odmah <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* SLIKA mobilno — ispod teksta, gornja ivica feathered */}
                  <div className="lg:hidden">
                    <img src={cur.img || cur.image_url} alt={cur.name1}
                      className="w-full h-auto object-contain"
                      style={{
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 16%)',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, #000 16%)',
                      }} />
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Dots + strelice */}
              <div className="absolute bottom-8 left-10 sm:left-16 xl:left-24 z-20 hidden lg:flex items-center gap-5">
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => { setSlide(i); setImgLoaded(false); }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === slide ? 22 : 8,
                        height: 8,
                        background: i === slide ? (cur.accentColor || '#d4600a') : 'rgba(0,0,0,0.22)',
                      }} />
                  ))}
                </div>
                {/* Strelice */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSlide(p => (p - 1 + slides.length) % slides.length); setImgLoaded(false); }}
                    aria-label="Prethodni"
                    className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-200"
                    style={{ ['--hover-bg' as any]: cur.accentColor }}
                    onMouseEnter={e => { e.currentTarget.style.background = cur.accentColor; e.currentTarget.style.borderColor = cur.accentColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}>
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    onClick={() => { setSlide(p => (p + 1) % slides.length); setImgLoaded(false); }}
                    aria-label="Sljedeći"
                    className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-200"
                    onMouseEnter={e => { e.currentTarget.style.background = cur.accentColor; e.currentTarget.style.borderColor = cur.accentColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PROIZVODI — "Izbor naših kupaca"
        ═══════════════════════════════════════════════════════ */}
        <section id="proizvodi" className="py-12 lg:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14">

            {/* Header — naslov lijevo, link desno */}
            <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
              <Reveal>
                <p className="section-label mb-3">Najprodavaniji proizvodi</p>
                <h2 className="font-black text-[#111] leading-[0.92] tracking-[-0.04em]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  Izbor naših kupaca.
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="hidden sm:block flex-shrink-0 pb-1">
                <Link to="/#proizvodi"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111] hover:text-[#e5252a] transition-colors duration-200 group">
                  Pogledaj sve proizvode
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Reveal>
            </div>

            {/* Grid — 4 kartice */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 4).map((p, idx) => {
                const ratings = [4.5, 4.3, 4.8, 4.1];
                const counts = [92, 74, 68, 81];
                const rating = ratings[idx] ?? 4.4;
                const count = counts[idx] ?? 56;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                    <Link to={`/product/${p.id}`}
                      className="group relative flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-gray-100 hover:shadow-[0_8px_40px_rgba(229,37,42,0.10)] hover:-translate-y-1 transition-all duration-300 h-full">

                      {/* Badge */}
                      {idx === 0 && (
                        <span className="absolute top-4 left-4 z-10 bg-[#f59e0b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          Najprodavaniji
                        </span>
                      )}

                      {/* Slika */}
                      <div className="bg-[#f8f8f8] overflow-hidden aspect-[4/3] sm:aspect-square">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div>
                          <p className="font-black text-[#111] text-[15px] leading-snug"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {p.name}
                          </p>
                          {p.packaging && (
                            <p className="text-[12px] text-gray-400 mt-0.5">{p.packaging}</p>
                          )}
                        </div>

                        {/* Zvjezdice */}
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating} />
                          <span className="text-[12px] text-gray-400">({count})</span>
                        </div>

                        {/* Cijena */}
                        <p className="font-black text-[#111] text-[1.25rem] tracking-[-0.02em]"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {Number(p.price).toFixed(2)} €
                        </p>

                        {/* Dugme */}
                        <div className="mt-auto flex items-center justify-center gap-2 h-11 rounded-xl bg-[#e5252a] text-white font-bold text-[12px] uppercase tracking-wide hover:bg-[#c91d22] transition-colors duration-200 cursor-pointer">
                          Detaljnije
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CATEGORIES — "Priroda kao izvor vašeg zdravlja"
        ═══════════════════════════════════════════════════════ */}
        <section id="kategorije" className="relative py-14 sm:py-24 overflow-hidden"
          style={{
            backgroundImage: 'url(/slike/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>

          {/* Tamni overlay za čitljivost */}
          <div className="absolute inset-0" style={{ background: 'rgba(5, 22, 8, 0.42)' }} />

          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14">

            <Reveal className="text-center mb-8 sm:mb-14">
              <p className="section-label label-white justify-center mb-4">Kategorije</p>
              <h2 className="font-black text-white leading-[0.95] tracking-[-0.03em]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}>
                Priroda kao izvor vašeg zdravlja
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-4">
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
                  desc: 'Podrška metabolizmu i kontroli tjelesne težine – prirodno i učinkovito.',
                },
              ].map((cat, i) => (
                <Reveal key={cat.id} delay={i * 0.08}>
                  <Link to={`/category/${cat.id}`}
                    className="group flex flex-row items-start gap-5 p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300"
                    style={{
                      background: 'rgba(10, 35, 14, 0.55)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(10,45,16,0.65)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(10,35,14,0.55)';
                    }}>

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
                </Reveal>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TRUST STRIP — "Samo ono što vam je potrebno"
        ═══════════════════════════════════════════════════════ */}
        <section className="trust-bg relative overflow-hidden"
          style={{
            backgroundImage: 'url(/slike/background-2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 220,
          }}>

          {/* Lagani overlay da tekst bude čitljiv na krem pozadini */}
          <div className="absolute inset-0" style={{ background: 'rgba(255,252,245,0.30)' }} />

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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl">
                {[
                  {
                    Icon: Leaf,
                    title: 'Prirodni sastojci',
                    desc: 'Koristimo pažljivo odabrane biljne ekstrakte.',
                  },
                  {
                    Icon: FlaskConical,
                    title: 'Znanstveno potkrijepljeno',
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
                  <Reveal key={i} delay={i * 0.08}>
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
                  </Reveal>
                ))}
              </div>

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
                const tags = ['Zdravlje', 'Prehrana', 'Imunitet'];
                const tag = post.category || tags[i % tags.length];
                return (
                  <Reveal key={post.id} delay={i * 0.08}>
                    <Link to={`/news/${post.id}`}
                      className="group flex flex-col h-full rounded-[1.25rem] overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

                      {/* Slika — čista, bez overlay-a */}
                      <div className="relative overflow-hidden rounded-[1.25rem]" style={{ aspectRatio: '16/9' }}>
                        <img src={post.imageUrl} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-600" />
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
        <section className="relative overflow-hidden"
          style={{
            backgroundImage: 'url(/slike/background-3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 220,
          }}>

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
                    className="inline-flex items-center h-12 px-7 text-white font-bold text-[13px] uppercase tracking-wide rounded-full transition-all duration-200"
                    style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    Saznajte više
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-5 flex-wrap">
                  {[
                    { Icon: ShieldCheck, text: 'Sigurna kupovina' },
                    { Icon: Truck,       text: 'Brza dostava' },
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
