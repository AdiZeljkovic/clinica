import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import { Reveal, StaggerGroup, StaggerItem, ParallaxBg, BlurImage } from '../components/motion';

const SHOPS = [
  { name: 'Sanolabor', color: '#5C2D91' },
  { name: 'lekarnar.com', color: '#009bbf' },
  { name: 'Ljekarna Ljubljana', color: '#8dc63f' },
  { name: 'MojaLjekarna', color: '#00bcd4' },
];

/* Piktogram prema sadržaju benefita — redoslijed pravila je bitan (prvo poklapanje pobjeđuje) */
const PICTOGRAM_RULES: [RegExp, string][] = [
  [/bundev/i,                    '/slike/Pictograms_Pumpkin seed.svg'],
  [/cink/i,                      '/slike/Pictograms_Zinc.png'],
  [/vitamin\s*e/i,               '/slike/Pictograms_Vitamin E .png'],
  [/mokrenj|bešik/i,             '/slike/Pictograms_Urinary function .png'],
  [/prostat/i,                   "/slike/Pictograms_Men's health .png"],
  [/kilogram/i,                  '/slike/Pictograms_Weight loss .png'],
  [/apetit/i,                    '/slike/Pictograms_Appetite control .png'],
  [/razgradnj/i,                 '/slike/Pictograms_Fat breakdown .png'],
  [/metaboliz/i,                 '/slike/Pictograms_Circulation.png'],
  [/zagrijavanj|toplin/i,        '/slike/Pictograms_Warming effect .png'],
  [/hlađenj|hladjenj/i,          '/slike/Pictograms_Cooling effect.png'],
  [/njeguje|štiti/i,             '/slike/Pictograms_ Skin care - perfusion .png'],
  [/cirkulacij|prokrvljenost/i,  '/slike/Pictograms_Circulation.png'],
  [/stopala/i,                   '/slike/Pictograms_Tired legs relief .png'],
  [/otečen|teške noge/i,         '/slike/Pictograms_Tired - heavy legs .png'],
  [/tetiv|ligament/i,            '/slike/Pictograms_Tendon _ ligament elasticity.png'],
  [/vezivn/i,                    '/slike/Pictograms_Connective tissue .png'],
  [/regeneracij/i,               '/slike/Pictograms_Muscles joints.svg'],
  [/sportsk/i,                   '/slike/Pictograms_After-sport relaxation .png'],
  [/bola? u mišić/i,             '/slike/Pictograms_Muscle relax cold.svg'],
  [/zglobova, kostiju|kostiju i mišić/i, '/slike/Pictograms_Joints_ bones _ muscles .png'],
  [/ukočenost/i,                 '/slike/Pictograms_Mobility.svg'],
  [/reumatsk|artritis/i,         '/slike/Pictograms_Joint zone (rheumatic) .png'],
  [/upal|bol/i,                  '/slike/Pictograms_Joint zone (rheumatic) .png'],
];

function pictogramFor(benefit: string): string {
  for (const [re, src] of PICTOGRAM_RULES) {
    if (re.test(benefit)) return src;
  }
  return '/slike/Pictograms_Joints_ bones _ muscles .png';
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [showShops, setShowShops] = useState(true);
  const [openDetail, setOpenDetail] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getProduct(id).then(data => {
      const p = {
        ...data,
        imageUrl: data.image_url,
        categoryId: data.category_id,
        shortDescription: data.short_description,
      };
      setProduct(p);
      api.getProducts().then(all => {
        const others = all.filter((r: any) => r.id !== data.id);
        for (let i = others.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [others[i], others[j]] = [others[j], others[i]];
        }
        setRelated(others.slice(0, 3).map((r: any) => ({
          ...r, imageUrl: r.image_url, categoryId: r.category_id,
        })));
      });
    }).catch(() => {});
  }, [id]);

  if (!product) return null;

  const details = [
    { title: 'Upute za uporabu',        content: product.usage_instructions },
    { title: 'Sastav',                   content: product.composition },
    { title: 'Upozorenja i napomene',    content: product.warnings },
    { title: 'Temperatura čuvanja',      content: product.storage_temp },
    { title: 'Zemlja porijekla',         content: product.country_of_origin },
  ].filter(d => d.content && d.content.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main className="flex-grow">

        {/* ── BREADCRUMB ── */}
        <div className="max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20 pt-8 pb-4">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-[#e5252a] transition-colors">Početna</Link>
            <ChevronRight size={12} />
            <Link to="/#proizvodi" className="hover:text-[#e5252a] transition-colors">Proizvodi</Link>
            <ChevronRight size={12} />
            <span className="text-[#111]">{product.name}</span>
          </nav>
        </div>

        {/* ── PRODUCT DETAIL ── */}
        <section className="py-12 bg-white">
          <div className="max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20">

            <Link to="/#proizvodi"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#e5252a] transition-colors mb-10">
              <ArrowLeft size={14} /> Natrag na proizvode
            </Link>

            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Lijevo — slike */}
              <div className="flex flex-col gap-5">
                <Reveal variant="scale-in">
                  <div className="rounded-[1.75rem] overflow-hidden bg-[#f5f5f5] flex items-center justify-center p-12"
                    style={{ aspectRatio: '1/1' }}>
                    <BlurImage src={product.imageUrl} alt={product.name}
                      className="w-full h-full object-contain hover:scale-[1.04]" />
                  </div>
                </Reveal>
                <div className="flex gap-3">
                  <button className="w-20 h-20 rounded-2xl bg-[#f5f5f5] p-3 flex items-center justify-center border-2 border-[#e5252a]">
                    <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                </div>
              </div>

              {/* Desno — info */}
              <div className="flex flex-col pt-2">
                <span className="text-[11px] font-bold text-[#e5252a] uppercase tracking-widest mb-3">
                  {product.packaging || 'Bioclinica'}
                </span>

                <h1 className="font-black text-[#111] tracking-[-0.04em] leading-[1.05] mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  {product.name}
                </h1>

                {product.tagline && (
                  <p className="text-[17px] font-bold text-[#e5252a] leading-snug mb-4">
                    {product.tagline}
                  </p>
                )}

                <p className="text-gray-500 text-[16px] leading-[1.75] mb-6 font-normal">
                  {product.shortDescription}
                </p>


                {/* Benefiti */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-col gap-3 mb-10">
                    {product.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={pictogramFor(b)}
                            alt=""
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <span className="text-[14px] font-semibold text-[#111]">{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowShops(v => !v)}
                  className="inline-flex items-center gap-3 h-[54px] px-8 bg-[#e5252a] text-white font-bold text-[14px] uppercase tracking-wide rounded-full hover:bg-[#c91d22] transition-all duration-200 mb-4 w-fit"
                  style={{ boxShadow: '0 8px 28px rgba(229,37,42,0.35)' }}>
                  Kupi odmah
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showShops ? 'rotate-180' : ''}`} />
                </button>

                {showShops && (
                  <div className="mb-6">
                    <StaggerGroup stagger={0.06} className="grid grid-cols-2 gap-3 pt-2">
                      {SHOPS.map(({ name, color }) => (
                        <StaggerItem key={name} y={16}>
                          <div
                            className="flex flex-col items-center justify-between p-5 rounded-2xl bg-[#fafafa] border border-gray-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-200 h-full">
                            <span className="text-[16px] font-black text-center leading-snug py-2" style={{ color }}>{name}</span>
                            <a href="#"
                              className="w-full h-10 bg-[#e5252a] hover:bg-[#c91d22] active:scale-[0.97] text-white font-bold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center transition-all duration-200 mt-3">
                              Kupi odmah
                            </a>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerGroup>
                  </div>
                )}

              </div>
            </div>
          </div>

        </section>

        {/* ── DETALJNE INFORMACIJE — tamno zelena kao kategorije ── */}
        {details.length > 0 && (
          <section className="relative py-24 overflow-hidden">
            <ParallaxBg src="/slike/background.png" speed={0.1}>
              <div className="absolute inset-0" style={{ background: 'rgba(5,22,8,0.45)' }} />
            </ParallaxBg>
            <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20">
              <div className="flex items-center gap-3 mb-8">
                <span className="block h-px w-8 bg-white/30" />
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.22em]">Detaljne informacije</span>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${details.length}, 1fr)` }}>
                {details.map((d, i) => (
                  <button key={i}
                    onClick={() => setOpenDetail(openDetail === i ? null : i)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wide transition-all duration-200 ${
                      openDetail === i
                        ? 'bg-white text-[#111]'
                        : 'text-white/80 hover:text-white'
                    }`}
                    style={openDetail !== i ? {
                      background: 'rgba(10,35,14,0.55)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                    } : {}}>
                    {d.title}
                    <ChevronDown size={11} className={`flex-shrink-0 transition-transform duration-200 ${openDetail === i ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {openDetail !== null && (
                  <motion.div
                    key={openDetail}
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 rounded-2xl px-8 py-6 text-[14px] leading-[1.85] font-normal whitespace-pre-line"
                    style={{
                      background: 'rgba(10,35,14,0.55)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      color: 'rgba(255,255,255,0.80)',
                    }}>
                    {details[openDetail].content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* ── BADŽEVI — krem kao trust sekcija ── */}
        <section className="relative overflow-hidden py-20">
          <ParallaxBg src="/slike/background-2.png" speed={0.08}>
            <div className="absolute inset-0" style={{ background: 'rgba(255,252,245,0.30)' }} />
          </ParallaxBg>
          <div className="relative z-10 max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="block h-px w-8 bg-[#e5252a]/50" />
                <span className="text-[#e5252a] text-[11px] font-bold uppercase tracking-[0.22em]">Naša garancija</span>
                <span className="block h-px w-8 bg-[#e5252a]/50" />
              </div>
              <h2 className="font-black text-[#111] tracking-[-0.04em] leading-[1] mb-14"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Čisto iz prirode,<br /><em className="not-italic text-[#e5252a]">provjereno za vas.</em>
              </h2>
            </Reveal>
            <StaggerGroup stagger={0.1} className="flex items-center justify-center gap-20 sm:gap-32 flex-wrap">
              {[
                '/badges/bez-konzervansa.svg',
                '/badges/bez-titan-dioksida.svg',
                '/badges/bez-gmo.svg',
              ].map((src) => (
                <StaggerItem key={src}>
                  <img src={src} alt="" className="w-36 h-36 object-contain" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ── SLIČNI PROIZVODI ── */}
        {related.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20">
              <Reveal className="mb-10">
                <h3 className="font-black text-[#111] tracking-[-0.03em]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem' }}>
                  Možda vas zanima i
                </h3>
              </Reveal>
              <StaggerGroup stagger={0.07} className="grid sm:grid-cols-3 gap-5">
                {related.map((p) => (
                  <StaggerItem key={p.id}>
                    <Link to={`/product/${p.id}`}
                      className="group flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-gray-100 hover:shadow-[0_8px_40px_rgba(229,37,42,0.10)] hover:-translate-y-1 transition-all duration-300">
                      <div className="bg-[#f5f5f5] overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <BlurImage src={p.imageUrl} alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-[1.04]" />
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-[#111] text-[14px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{p.name}</p>
                          {p.packaging && <p className="text-[11px] text-gray-400 mt-0.5">{p.packaging}</p>}
                        </div>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#e5252a] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
