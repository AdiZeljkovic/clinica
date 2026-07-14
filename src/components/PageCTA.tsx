import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { StaggerGroup, StaggerItem, ParallaxBg } from './motion';

interface Props {
  title: React.ReactNode;
  subtitle: string;
  buttonLabel: string;
  buttonTo: string;
}

export default function PageCTA({ title, subtitle, buttonLabel, buttonTo }: Props) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <ParallaxBg src="/slike/background-3.png" speed={0.12}>
        <div className="absolute inset-0" style={{ background: 'rgba(165, 25, 30, 0.82)' }} />
      </ParallaxBg>
      <StaggerGroup stagger={0.1} className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-14 text-center">
        <StaggerItem>
          <h2 className="font-black text-white leading-[0.95] tracking-[-0.04em] mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
            {title}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="text-white/65 text-[15px] sm:text-[16px] mb-10 max-w-md mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>
        </StaggerItem>
        <StaggerItem>
          <Link to={buttonTo}
            className="inline-flex items-center gap-3 h-[52px] px-9 bg-white text-[#e5252a] font-bold text-[13px] uppercase tracking-wide rounded-full
              hover:bg-gray-50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 group"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.20)' }}>
            {buttonLabel}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
