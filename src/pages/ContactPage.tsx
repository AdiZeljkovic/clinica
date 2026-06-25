import { useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import PageHero from '../components/PageHero';

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

const INFO = [
  {
    Icon: MapPin,
    label: 'Sjedište',
    content: <>Bioclinica SWP d.o.o.<br />Hrasnička cesta 15<br />71000 Sarajevo, BiH</>,
  },
  {
    Icon: Phone,
    label: 'Telefon',
    content: (
      <a href="tel:+38733123456" className="block font-black text-[#111] hover:text-[#e5252a] transition-colors text-[17px]">
        +387 33 123 456
      </a>
    ),
  },
  {
    Icon: Mail,
    label: 'Email',
    content: (
      <a href="mailto:info@bioclinica.ba" className="block font-black text-[#111] hover:text-[#e5252a] transition-colors text-[17px]">
        info@bioclinica.ba
      </a>
    ),
  },
  {
    Icon: Clock,
    label: 'Radno vrijeme',
    content: (
      <div className="flex flex-col gap-1">
        {[['Pon – Pet', '08:00 – 16:00'], ['Subota', 'Zatvoreno'], ['Nedjelja', 'Zatvoreno']].map(([d, t]) => (
          <div key={d} className="flex justify-between gap-8 text-[14px]">
            <span className="text-gray-400 font-medium">{d}</span>
            <span className={`font-bold ${t === 'Zatvoreno' ? 'text-[#e5252a]' : 'text-[#111]'}`}>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo pageKey="contact" fallbackTitle="Kontakt - Bioclinica" />
      <Header />

      <main className="flex-grow">

        <PageHero
          label="Javite nam se"
          title={<>Budimo u<br /><span style={{ opacity: 0.5 }}>kontaktu.</span></>}
          subtitle="Tu smo za sva vaša pitanja, sugestije ili upite o proizvodima. Slobodno nam se obratite."
          crumbs={[
            { label: 'Početna', to: '/' },
            { label: 'Kontakt' },
          ]}
        />

        {/* ── FORMA + INFO ── */}
        <section className="py-14 sm:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">

              {/* Forma */}
              <Reveal className="lg:col-span-7">
                <div className="bg-white rounded-[1.5rem] p-6 sm:p-10 border border-gray-100"
                  style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
                  <h2 className="font-black text-[#111] mb-8 tracking-[-0.03em]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem' }}>
                    Pošaljite nam poruku
                  </h2>

                  <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[['firstName', 'Ime', 'Vaše ime'], ['lastName', 'Prezime', 'Vaše prezime']].map(([id, label, ph]) => (
                        <div key={id} className="flex flex-col gap-2">
                          <label htmlFor={id} className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                          <input type="text" id={id} placeholder={ph}
                            className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email adresa</label>
                      <input type="email" id="email" placeholder="vasa.adresa@email.com"
                        className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Naslov poruke</label>
                      <input type="text" id="subject" placeholder="Unesite naslov"
                        className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Vaša poruka</label>
                      <textarea id="message" rows={5} placeholder="Kako vam možemo pomoći?"
                        className="px-5 py-4 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111] resize-none" />
                    </div>
                    <button type="submit"
                      className="h-12 mt-2 bg-[#e5252a] hover:bg-[#c91d22] text-white font-bold rounded-xl transition-all text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 group"
                      style={{ boxShadow: '0 8px 24px rgba(229,37,42,0.3)' }}>
                      <Send size={15} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      Pošalji poruku
                    </button>
                  </form>
                </div>
              </Reveal>

              {/* Info kartice */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {INFO.map(({ Icon, label, content }, i) => (
                  <Reveal key={label} delay={i * 0.06}>
                    <div className="group flex items-start gap-5 p-6 rounded-[1.25rem] bg-white border border-gray-100 hover:border-[#e5252a]/20 hover:shadow-[0_4px_32px_rgba(229,37,42,0.08)] transition-all duration-300">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        style={{ background: 'rgba(229,37,42,0.08)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e5252a'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(229,37,42,0.08)'; }}>
                        <Icon size={19} className="text-[#e5252a]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
                        <div className="text-[14px] leading-relaxed text-gray-600">{content}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
