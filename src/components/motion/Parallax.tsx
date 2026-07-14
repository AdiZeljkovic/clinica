import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/* Pozadinski parallax sloj — parent sekcija mora biti `relative overflow-hidden`.
   Sloj je oversized za speed*100% da ivice nikad ne budu vidljive. */
export function ParallaxBg({ src, speed = 0.12, position = 'center', className = '', children }: {
  src: string;
  speed?: number;
  position?: string;
  className?: string;
  children?: React.ReactNode; // overlay divovi
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  const pad = speed * 100;
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className={`absolute left-0 right-0 parallax-bg-layer ${className}`}
        style={{
          top: `${-pad}%`,
          bottom: `${-pad}%`,
          y: reduce ? 0 : y,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: position,
          willChange: 'transform',
        }} />
      {children}
    </div>
  );
}

/* Suptilni scroll drift za foreground elemente */
export function Parallax({ children, speed = 40, className = '' }: {
  children: React.ReactNode; speed?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}
