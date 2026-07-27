import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Reveal, StaggerGroup, StaggerItem } from './motion';

export default function Footer() {
  const [email, setEmail] = useState('');

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return (
    <footer style={{ background: 'linear-gradient(160deg, #0a1c0c 0%, #0d2210 60%, #081508 100%)' }}>
      <div className="max-w-[88rem] mx-auto px-5 sm:px-14 pt-10 lg:pt-16 pb-8">

        {/* ── Glavni grid — 4 kolone, staggered reveal ── */}
        <StaggerGroup stagger={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12"
          >
          {/* Kolona 1 — Logo + opis + social */}
          <StaggerItem y={20} className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src="/Bioclinica_Logo.png" alt="Bioclinica SWP" className="h-12 w-auto" />
            </Link>
            <p className="text-[13px] leading-relaxed text-white/50">
              Prirodna podrška vašem zdravlju već više od 20 godina. Kvalitet, pouzdanost i rezultati kojima možete vjerovati.
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-white/18
                    hover:border-white/50 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-200">
                  <Icon size={15} className="text-white/65" />
                </a>
              ))}
            </div>
          </StaggerItem>

          {/* Kolona 2 — Linkovi */}
          <StaggerItem y={20}>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.18em] mb-5">Linkovi</h4>
            <ul className="space-y-3">
              {[
                { label: 'Početna', to: '/' },
                { label: 'Proizvodi', to: '/#proizvodi' },
                { label: 'Kategorije', to: '/#kategorije' },
                { label: 'O nama', to: '/about' },
                { label: 'Savjeti & Znanje', to: '/news' },
                { label: 'Kontakt', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Kolona 3 — Informacije */}
          <StaggerItem y={20}>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.18em] mb-5">Informacije</h4>
            <ul className="space-y-3">
              {[
                'Često postavljana pitanja',
                'Uslovi kupovine',
                'Politika privatnosti',
                'Dostava i plaćanje',
                'Povrat i reklamacije',
              ].map(item => (
                <li key={item}>
                  <a href="#"
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Kolona 4 — Newsletter */}
          <StaggerItem y={20}>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.18em] mb-5">Newsletter</h4>
            <p className="text-[13px] leading-relaxed mb-4 text-white/50">
              Prijavite se i budite prvi koji saznaje za akcije i nove proizvode.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Vaša email adresa"
                className="w-full px-4 py-3 rounded-xl text-[13px] text-white bg-white/6
                  border border-white/14 focus:border-white/35 focus:outline-none transition-all"
              />
              <motion.button type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full h-11 bg-[#e5252a] hover:bg-[#c91d22] text-white font-black text-[11px] uppercase tracking-[0.16em] rounded-xl transition-colors duration-200">
                Prijavite se
              </motion.button>
            </form>
          </StaggerItem>

        </StaggerGroup>

        {/* ── Donja traka ── */}
        <Reveal delay={0.2} y={12}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>

            <p className="text-[12px] text-white/30">
              © {new Date().getFullYear()} BioClinica SWP. Sva prava pridržana.
            </p>

            {/* Scroll na vrh */}
            <motion.button onClick={scrollTop}
              aria-label="Na vrh stranice"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/18
                hover:border-white/50 hover:bg-white/8 transition-colors duration-200">
              <ArrowUp size={15} className="text-white/60" />
            </motion.button>

          </div>
        </Reveal>

      </div>
    </footer>
  );
}
