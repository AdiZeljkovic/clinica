import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import PageHero from '../components/PageHero';
import { api } from '../lib/api';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function NewsListPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  useEffect(() => {
    api.getBlogPosts().then(data => setBlogPosts(data.map((p: any) => ({ ...p, imageUrl: p.image_url })))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo pageKey="news" fallbackTitle="Novosti - Bioclinica" />
      <Header />

      <main className="flex-grow">

        <PageHero
          label="Aktualno iz Bioclinice"
          title={<>Savjeti &amp;<br /><span style={{ opacity: 0.5 }}>Novosti.</span></>}
          subtitle="Otkrijte najnovije članke o zdravlju, prehrani i inovativnim rješenjima iz prirode."
          crumbs={[
            { label: 'Početna', to: '/' },
            { label: 'Novosti' },
          ]}
        />

        {/* ── LISTA ČLANAKA ── */}
        <section className="py-14 sm:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">
            {blogPosts.length === 0 ? (
              <div className="text-center py-24 text-gray-400 text-[15px] font-semibold">Nema objavljenih članaka.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {blogPosts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 0.06}>
                    <Link to={`/news/${post.id}`}
                      className="group flex flex-col h-full rounded-[1.5rem] overflow-hidden border border-gray-100 bg-white hover:shadow-[0_16px_56px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400">

                      <div className="relative overflow-hidden bg-[#f5f5f5]" style={{ aspectRatio: '16/9' }}>
                        {post.imageUrl
                          ? <img src={post.imageUrl} alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" />
                          : <div className="w-full h-full bg-[#e8edec]" />
                        }
                        <span className="absolute top-4 left-4 bg-[#e5252a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Zdravlje
                        </span>
                      </div>

                      <div className="flex flex-col flex-1 p-6">
                        <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-3">
                          {post.date}
                        </span>
                        <h3 className="font-black text-[#111] text-[17px] leading-snug mb-3 group-hover:text-[#e5252a] transition-colors duration-200 line-clamp-2"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-[13px] leading-relaxed flex-1 mb-5 line-clamp-3 font-normal">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="inline-flex items-center gap-1.5 text-[#e5252a] text-[12px] font-bold group-hover:gap-3 transition-all duration-200">
                            Pročitaj više <ArrowRight size={12} />
                          </span>
                          <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#e5252a]/40 transition-colors">
                            <ArrowRight size={11} className="text-gray-300 group-hover:text-[#e5252a] transition-colors -rotate-45" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
