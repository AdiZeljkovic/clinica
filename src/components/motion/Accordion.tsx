import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from './Reveal';

export function AccordionItem({ question, children, defaultOpen = false }: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-[1.25rem] border border-gray-100 bg-white overflow-hidden hover:border-[#e5252a]/20 transition-colors duration-300"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 sm:px-7 py-5 sm:py-6 text-left font-bold text-[14px] sm:text-[15px] text-[#111] hover:text-[#e5252a] transition-colors duration-200">
        <span className="pr-4 leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors duration-300 ${
            open ? 'bg-[#e5252a]/10 border-[#e5252a]/20' : 'bg-gray-50 border-gray-100'
          }`}>
          <ChevronDown size={15} className={open ? 'text-[#e5252a]' : 'text-gray-400'} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden">
            <div className="px-6 sm:px-7 pb-6 pt-4 text-[14px] text-gray-500 leading-[1.8] border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
