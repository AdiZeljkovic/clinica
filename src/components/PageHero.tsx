import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Crumb { label: string; to?: string; }

interface Props {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  crumbs: Crumb[];
}

export default function PageHero({ label, title, subtitle, crumbs }: Props) {
  return (
    <section className="relative overflow-hidden"
      style={{
        backgroundImage: 'url(/slike/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '38vh',
      }}>
      <div className="absolute inset-0" style={{ background: 'rgba(5, 22, 8, 0.70)' }} />

      <div className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20 py-14 lg:py-24">
        <nav className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-white/40 uppercase tracking-widest mb-10">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight size={12} />}
              {c.to
                ? <Link to={c.to} className="hover:text-white/70 transition-colors">{c.label}</Link>
                : <span className="text-white/70">{c.label}</span>
              }
            </span>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="block h-px w-8 bg-white/40" />
            <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.22em]">{label}</span>
          </div>
          <h1 className="font-black text-white tracking-[-0.04em] leading-[1.02] mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/60 text-[15px] sm:text-[16px] leading-relaxed max-w-lg font-normal">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
