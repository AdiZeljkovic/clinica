import { useReducedMotion } from 'motion/react';

/* Beskonačna traka — koristi .marquee-inner keyframes iz index.css.
   Sadržaj se renderuje 2× za seamless loop; reduced-motion → statična kopija. */
export default function Marquee({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={`overflow-hidden whitespace-nowrap ${className}`}>
        <div className="flex w-max items-center">{children}</div>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-inner flex w-max items-center" style={{ willChange: 'transform' }}>
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
