import { motion } from 'motion/react';
import { EASE } from './Reveal';

interface Props {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
}

/* Masked word-reveal — svaka riječ klizi iz overflow-hidden maske */
export default function TextReveal({ text, as: Tag = 'span', className = '', delay = 0, stagger = 0.045, style }: Props) {
  return (
    <Tag className={className} style={style} aria-label={text}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        aria-hidden
        className="inline">
        {text.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.7, ease: EASE } },
              }}>
              {word}{' '}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
