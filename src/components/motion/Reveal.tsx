import { motion, type Variants } from 'motion/react';

export const EASE = [0.16, 1, 0.3, 1] as const;

const variantFactories: Record<string, (y: number) => Variants> = {
  'fade-up': (y) => ({
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0 },
  }),
  'blur-in': () => ({
    hidden: { opacity: 0, filter: 'blur(10px)' },
    show: { opacity: 1, filter: 'blur(0px)' },
  }),
  'scale-in': () => ({
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1 },
  }),
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  variant?: 'fade-up' | 'blur-in' | 'scale-in';
  className?: string;
}

export default function Reveal({ children, delay = 0, y = 32, variant = 'fade-up', className = '' }: RevealProps) {
  const v = variantFactories[variant](y);
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={v}
      transition={{ duration: 0.75, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/* Stagger container — djeca se otkrivaju kaskadno bez ručnog delay-a */
export function StaggerGroup({ children, className = '', stagger = 0.08 }: {
  children: React.ReactNode; className?: string; stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', y = 24 }: {
  children: React.ReactNode; className?: string; y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}>
      {children}
    </motion.div>
  );
}
