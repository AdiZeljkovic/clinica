import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top bar — tamna zelena ── */}
      <div className="hidden md:flex items-center h-9 px-6 sm:px-10"
        style={{ background: 'linear-gradient(90deg, #0a1c0c 0%, #0d2210 100%)' }}>
        <div className="max-w-[90rem] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-5 text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            <Link to="/impressum"
              className="transition-colors duration-200 hover:text-white"
              style={{ color: 'inherit' }}>
              Impressum
            </Link>
            <span style={{ opacity: 0.2 }}>|</span>
            <Link to="/privatnost"
              className="transition-colors duration-200 hover:text-white"
              style={{ color: 'inherit' }}>
              Privatnost
            </Link>
            <span style={{ opacity: 0.2 }}>|</span>
            <Link to="/uvjeti"
              className="transition-colors duration-200 hover:text-white"
              style={{ color: 'inherit' }}>
              Uvjeti
            </Link>
          </div>
          <div className="flex items-center gap-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <a href="#" aria-label="Twitter"
              className="hover:text-white hover:scale-110 transition-all duration-200">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube"
              className="hover:text-white hover:scale-110 transition-all duration-200">
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Instagram"
              className="hover:text-white hover:scale-110 transition-all duration-200">
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Glavni nav ── */}
      <header className="bg-white px-6 sm:px-10 flex items-center"
        style={{
          height: 76,
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        }}>
        <div className="max-w-[90rem] mx-auto w-full flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <img src="/Bioclinica_Logo.png" alt="Bioclinica"
              className="w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ height: 56 }} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-[#333]">

            <Link to="/"
              className="relative py-1 transition-colors duration-200 hover:text-[#e5252a]
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
                after:bg-[#e5252a] after:origin-left after:scale-x-0
                hover:after:scale-x-100 after:transition-transform after:duration-300">
              Početna
            </Link>

            {/* Proizvodi dropdown */}
            <div className="relative group/dd py-10 -my-10">
              <div className="flex items-center gap-0.5">
                <Link to="/products"
                  className="transition-colors duration-200 hover:text-[#e5252a] relative py-1
                    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#e5252a]
                    after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                  Proizvodi
                </Link>
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/dd:rotate-180 text-current" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible
                group-hover/dd:opacity-100 group-hover/dd:visible transition-all duration-200
                translate-y-2 group-hover/dd:translate-y-0 z-50 min-w-[240px]">
                <div className="bg-white rounded-2xl overflow-hidden py-2"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Link to="/products"
                    className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700
                      hover:bg-[#e5252a] hover:text-white transition-all duration-200 group/item border-b border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e5252a] group-hover/item:bg-white transition-colors flex-shrink-0" />
                    Svi proizvodi
                  </Link>
                  {[
                    { to: '/category/zdravlje-prostate',    label: 'Zdravlje prostate' },
                    { to: '/category/kosti-zglobovi-misici', label: 'Kosti, zglobovi i mišići' },
                    { to: '/category/mrsavljenje',           label: 'Mršavljenje' },
                  ].map(cat => (
                    <Link key={cat.to} to={cat.to}
                      className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700
                        hover:bg-[#e5252a] hover:text-white transition-all duration-200 group/item">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e5252a] group-hover/item:bg-white transition-colors flex-shrink-0" />
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {[
              { to: '/news',    label: 'Novosti' },
              { to: '/about',   label: 'O nama' },
              { to: '/faq',     label: 'FAQ' },
              { to: '/contact', label: 'Kontakt' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="relative py-1 transition-colors duration-200 hover:text-[#e5252a]
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
                  after:bg-[#e5252a] after:origin-left after:scale-x-0
                  hover:after:scale-x-100 after:transition-transform after:duration-300">
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA dugme */}
          <Link to="/contact"
            className="hidden lg:inline-flex items-center gap-2 h-11 px-6 rounded-full text-white font-bold text-[13px] uppercase tracking-wide transition-all duration-200 flex-shrink-0"
            style={{ background: '#e5252a', boxShadow: '0 4px 16px rgba(229,37,42,0.30)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#c91d22'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#e5252a'; }}>
            Kontaktirajte nas
          </Link>

          {/* Mobile burger */}
          <button className="lg:hidden p-2 text-gray-700 hover:text-[#e5252a] transition-colors"
            onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-6 py-6 flex flex-col gap-4 font-semibold text-[15px]"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          {[
            { to: '/',                               label: 'Početna' },
            { to: '/category/zdravlje-prostate',     label: 'Zdravlje prostate' },
            { to: '/category/kosti-zglobovi-misici', label: 'Kosti, zglobovi i mišići' },
            { to: '/category/mrsavljenje',           label: 'Mršavljenje' },
            { to: '/news',                           label: 'Novosti' },
            { to: '/about',                          label: 'O nama' },
            { to: '/faq',                            label: 'FAQ' },
            { to: '/contact',                        label: 'Kontakt' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="text-gray-800 hover:text-[#e5252a] transition-colors py-1"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              {label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center h-11 rounded-full text-white font-bold text-[13px] uppercase tracking-wide"
            style={{ background: '#e5252a' }}>
            Kontaktirajte nas
          </Link>
        </div>
      )}

    </div>
  );
}
