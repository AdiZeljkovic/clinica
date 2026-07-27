import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import PageHero from '../components/PageHero';
import { Reveal, StaggerGroup, StaggerItem } from '../components/motion';
import { api } from '../lib/api';

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
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Molimo popunite ime, prezime, email i poruku.');
      return;
    }
    setStatus('sending');
    try {
      await api.sendContact(form);
      setStatus('success');
      setForm({ first_name: '', last_name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Došlo je do greške. Pokušajte ponovo.');
    }
  }

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

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="first_name" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ime</label>
                        <input type="text" id="first_name" placeholder="Vaše ime" value={form.first_name} onChange={set('first_name')}
                          className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="last_name" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Prezime</label>
                        <input type="text" id="last_name" placeholder="Vaše prezime" value={form.last_name} onChange={set('last_name')}
                          className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email adresa</label>
                      <input type="email" id="email" placeholder="vasa.adresa@email.com" value={form.email} onChange={set('email')}
                        className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Naslov poruke</label>
                      <input type="text" id="subject" placeholder="Unesite naslov" value={form.subject} onChange={set('subject')}
                        className="h-12 px-5 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Vaša poruka</label>
                      <textarea id="message" rows={5} placeholder="Kako vam možemo pomoći?" value={form.message} onChange={set('message')}
                        className="px-5 py-4 rounded-xl bg-[#fafafa] border border-gray-200 focus:outline-none focus:border-[#e5252a] focus:ring-2 focus:ring-[#e5252a]/10 transition-all text-[14px] font-medium text-[#111] resize-none" />
                    </div>

                    {status === 'success' && (
                      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[14px] font-semibold">
                        <CheckCircle2 size={18} className="flex-shrink-0" />
                        Hvala! Vaša poruka je uspješno poslana — javit ćemo vam se uskoro.
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px] font-semibold">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <button type="submit" disabled={status === 'sending'}
                      className="h-12 mt-2 bg-[#e5252a] hover:bg-[#c91d22] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 group"
                      style={{ boxShadow: '0 8px 24px rgba(229,37,42,0.3)' }}>
                      <Send size={15} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      {status === 'sending' ? 'Šaljem...' : 'Pošalji poruku'}
                    </button>
                  </form>
                </div>
              </Reveal>

              {/* Info kartice */}
              <StaggerGroup stagger={0.06} className="lg:col-span-5 flex flex-col gap-4">
                {INFO.map(({ Icon, label, content }) => (
                  <StaggerItem key={label} y={20}>
                    <div className="group flex items-start gap-5 p-6 rounded-[1.25rem] bg-white border border-gray-100 hover:border-[#e5252a]/20 hover:shadow-[0_4px_32px_rgba(229,37,42,0.08)] transition-all duration-300">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                        bg-[#e5252a]/8 group-hover:bg-[#e5252a] transition-colors duration-300">
                        <Icon size={19} className="text-[#e5252a] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
                        <div className="text-[14px] leading-relaxed text-gray-600">{content}</div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
