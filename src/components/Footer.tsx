import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  const linkHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = '#fff'; },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; },
  };

  return (
    <footer style={{ background: 'linear-gradient(160deg, #0a1c0c 0%, #0d2210 60%, #081508 100%)' }}>
      <div className="max-w-[88rem] mx-auto px-5 sm:px-14 pt-10 lg:pt-16 pb-8">

        {/* ── Glavni grid — 5 kolona ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Kolona 1 — Logo + opis + social */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src="/Bioclinica_Logo.png" alt="Bioclinica SWP" className="h-12 w-auto" />
            </Link>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Prirodna podrška vašem zdravlju već više od 10 godina. Kvalitet, pouzdanost i rezultati kojima možete vjerovati.
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <Icon size={15} style={{ color: 'rgba(255,255,255,0.65)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Kolona 2 — Linkovi */}
          <div>
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
                  <Link to={to} className="text-[13px] transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.50)' }}
                    {...linkHover}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolona 3 — Informacije */}
          <div>
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
                  <a href="#" className="text-[13px] transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.50)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)'; }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolona 4 — Newsletter */}
          <div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.18em] mb-5">Newsletter</h4>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Prijavite se i budite prvi koji saznaje za akcije i nove proizvode.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Vaša email adresa"
                className="w-full px-4 py-3 rounded-xl text-[13px] text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'white',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
              />
              <button type="submit"
                className="w-full h-11 bg-[#e5252a] hover:bg-[#c91d22] text-white font-black text-[11px] uppercase tracking-[0.16em] rounded-xl transition-colors duration-200">
                Prijavite se
              </button>
            </form>
          </div>

        </div>

        {/* ── Donja traka ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">

          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
            © {new Date().getFullYear()} BioClinica SWP. Sva prava pridržana.
          </p>

          {/* Scroll na vrh */}
          <button onClick={scrollTop}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.18)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <ArrowUp size={15} style={{ color: 'rgba(255,255,255,0.60)' }} />
          </button>

        </div>

      </div>
    </footer>
  );
}
