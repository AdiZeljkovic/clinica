import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ParallaxBg, EASE } from './motion';

interface Crumb { label: string; to?: string; }

interface Props {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  crumbs: Crumb[];
}

export default function PageHero({ label, title, subtitle, crumbs }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: '38vh' }}>

      <ParallaxBg src="/slike/banner-hero.jpg" speed={0.15} />

      <motion.div
        className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20 py-14 lg:py-24"
        style={{ y: reduce ? 0 : contentY }}>
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-[#111]/40 uppercase tracking-widest mb-10">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight size={12} />}
              {c.to
                ? <Link to={c.to} className="hover:text-[#e5252a] transition-colors">{c.label}</Link>
                : <span className="text-[#111]/70">{c.label}</span>
              }
            </span>
          ))}
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
            className="flex items-center gap-3 mb-5">
            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } } }}
              className="block h-px w-8 bg-[#e5252a]/60 origin-left" />
            <span className="text-[#111]/50 text-[11px] font-bold uppercase tracking-[0.22em]">{label}</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              variants={{ hidden: { y: '60%', opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } } }}
              className="font-black text-[#111] tracking-[-0.04em] leading-[1.02] mb-5"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
              {title}
            </motion.h1>
          </div>

          {subtitle && (
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="text-[#111]/55 text-[15px] sm:text-[16px] leading-relaxed max-w-lg font-normal">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
