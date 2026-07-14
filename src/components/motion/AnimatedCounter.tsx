import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion, animate } from 'motion/react';
import { EASE } from './Reveal';

interface Props {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({ to, suffix = '', prefix = '', decimals = 0, duration = 1.6, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    const fmt = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;
    if (reduce) {
      ref.current.textContent = fmt(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: v => { if (ref.current) ref.current.textContent = fmt(v); },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, decimals, duration, reduce]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
