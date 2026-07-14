import { ShieldCheck, Leaf, FlaskConical, Award, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import PageHero from '../components/PageHero';
import PageCTA from '../components/PageCTA';
import { Reveal, StaggerGroup, StaggerItem, Parallax, AnimatedCounter, BlurImage } from '../components/motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo pageKey="about" fallbackTitle="O nama - Bioclinica" />
      <Header />

      <main className="flex-grow">

        <PageHero
          label="Upoznajte Bioclinicu"
          title={<>Priroda kao izvor<br /><span style={{ opacity: 0.5 }}>vašeg zdravlja.</span></>}
          subtitle="Bioclinica SWP posvećena je vašem zdravlju kroz pažljivo odabrane, prirodne dodatke prehrani."
          crumbs={[
            { label: 'Početna', to: '/' },
            { label: 'O nama' },
          ]}
        />

        {/* ── PRIČA ── */}
        <section className="py-14 sm:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

              <Reveal className="order-2 lg:order-1">
                <div className="relative rounded-[2rem] overflow-hidden" style={{ aspectRatio: '4/5' }}>
                  <Parallax speed={24} className="absolute inset-[-24px]">
                    <BlurImage
                      src="/slike/background-2.png"
                      alt="Prirodni sastojci"
                      className="w-full h-full object-cover object-left"
                    />
                  </Parallax>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)' }} />
                  <div className="float absolute bottom-8 right-8 bg-white rounded-2xl px-6 py-4 flex items-center gap-4"
                    style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
                    <div className="w-12 h-12 bg-[#e5252a] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#111] text-[1.75rem] leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <AnimatedCounter to={15} suffix="+" />
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Godina iskustva</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="order-1 lg:order-2 flex flex-col gap-8">
                <Reveal>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="block h-px w-8 bg-[#e5252a]/50" />
                    <span className="text-[#e5252a] text-[11px] font-bold uppercase tracking-[0.22em]">Naša priča</span>
                  </div>
                  <h2 className="font-black text-[#111] tracking-[-0.04em] leading-[0.95] mb-6"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                    Vizija i misija<br /><em className="not-italic text-[#e5252a]">Bioclinice.</em>
                  </h2>
                  <p className="text-gray-500 text-[15px] sm:text-[16px] leading-[1.8] mb-4 font-normal">
                    Vjerujemo da priroda nudi najbolja rješenja za očuvanje zdravlja i vitalnosti. Naša misija je ta dragocjena rješenja učiniti dostupnima svima, kroz proizvode koji zadovoljavaju najviše farmaceutske standarde.
                  </p>
                  <p className="text-gray-500 text-[15px] sm:text-[16px] leading-[1.8] font-normal">
                    Svaki Bioclinica proizvod rezultat je dugotrajnog istraživanja, pažljivog odabira sirovina i naprednih tehnoloških procesa koji osiguravaju maksimalnu učinkovitost.
                  </p>
                </Reveal>

                <StaggerGroup stagger={0.08} className="flex flex-col gap-3 pt-4">
                  {[
                    'Samo provjereni i prirodni sastojci.',
                    'Proizvodnja pod strogim smjernicama kvalitete.',
                    'Dizajnirano za maksimalnu apsorpciju.',
                    'Inovacije temeljene na znanstvenim istraživanjima.',
                  ].map((item, i) => (
                    <StaggerItem key={i} y={12}>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={17} className="text-[#e5252a] flex-shrink-0" />
                        <p className="text-[14px] sm:text-[15px] font-semibold text-[#111]">{item}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </div>
          </div>
        </section>

        {/* ── VRIJEDNOSTI ── */}
        <section className="py-14 sm:py-20 border-y border-gray-100" style={{ background: '#fafafa' }}>
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">
            <Reveal className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="block h-px w-8 bg-[#e5252a]/50" />
                <span className="text-[#e5252a] text-[11px] font-bold uppercase tracking-[0.22em]">Temeljne vrijednosti</span>
                <span className="block h-px w-8 bg-[#e5252a]/50" />
              </div>
              <h2 className="font-black text-[#111] tracking-[-0.04em] leading-[0.95]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                Standardi od kojih<br /><em className="not-italic text-[#e5252a]">ne odstupamo.</em>
              </h2>
            </Reveal>

            <StaggerGroup stagger={0.08} className="grid sm:grid-cols-3 gap-5">
              {[
                { Icon: Leaf, title: 'Prirodno porijeklo', desc: 'Koristimo samo najkvalitetnije biljne ekstrakte čija je učinkovitost potvrđena tradicijom i znanošću.' },
                { Icon: ShieldCheck, title: 'Kontrola kvalitete', desc: 'Svi naši proizvodi prolaze stroge analize i kontrole kako bismo osigurali sigurnost i čistoću.' },
                { Icon: FlaskConical, title: 'Inovativne formule', desc: 'Spajamo tradicionalno znanje s modernom farmaceutskom tehnologijom za najbolje rezultate.' },
              ].map(({ Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <div className="group flex flex-col p-7 sm:p-8 rounded-[1.5rem] bg-white border border-gray-100 hover:shadow-[0_8px_40px_rgba(229,37,42,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-default h-full">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[#e5252a]"
                      style={{ background: 'rgba(229,37,42,0.08)' }}>
                      <Icon size={22} className="text-[#e5252a] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-black text-[#111] text-[16px] sm:text-[17px] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
                    <p className="text-gray-400 text-[13px] sm:text-[14px] leading-relaxed font-normal">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        <PageCTA
          title={<>Istražite naše<br />proizvode.</>}
          subtitle="Pronađite savršeni Bioclinica proizvod i osjetite razliku prirodnih sastojaka."
          buttonLabel="Pregledaj proizvode"
          buttonTo="/#proizvodi"
        />

      </main>

      <Footer />
    </div>
  );
}
