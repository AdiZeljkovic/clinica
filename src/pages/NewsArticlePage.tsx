import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import { api, formatDate } from '../lib/api';
import { Reveal, StaggerGroup, StaggerItem, BlurImage, EASE } from '../components/motion';

const headItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getBlogPost(id)
      .then(data => {
        setPost({ ...data, imageUrl: data.image_url, date: formatDate(data.published_at) });
        api.getBlogPosts().then(all => {
          setRelated(all.filter((p: any) => p.id !== data.id).slice(0, 2).map((p: any) => ({ ...p, imageUrl: p.image_url, date: formatDate(p.published_at) })));
        });
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <Navigate to="/news" replace />;
  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo fallbackTitle={`${post.title} - Bioclinica`} fallbackDescription={post.excerpt || ''} />
      <Header />

      <main className="flex-grow">

        {/* ── HEADER ČLANKA ── */}
        <section className="pt-16 pb-10 bg-white border-b border-gray-100">
          <motion.div
            className="max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.nav variants={headItem}
              className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">
              <Link to="/" className="hover:text-[#e5252a] transition-colors">Početna</Link>
              <ChevronRight size={12} />
              <Link to="/news" className="hover:text-[#e5252a] transition-colors">Novosti</Link>
              <ChevronRight size={12} />
              <span className="text-[#111] truncate max-w-[240px]">{post.title}</span>
            </motion.nav>

            <div className="max-w-3xl">
              <motion.div variants={headItem}>
                <Link to="/news"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#e5252a] transition-colors mb-8">
                  <ArrowLeft size={14} /> Natrag na novosti
                </Link>
              </motion.div>

              <motion.div variants={headItem} className="flex items-center gap-3 mb-5">
                <span className="bg-[#e5252a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Zdravlje</span>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 uppercase tracking-widest">
                  <Calendar size={12} /> {post.date}
                </span>
              </motion.div>

              <motion.h1 variants={headItem}
                className="font-black text-[#111] tracking-[-0.04em] leading-[1.05] mb-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                {post.title}
              </motion.h1>

              <motion.p variants={headItem}
                className="text-gray-500 text-[18px] leading-[1.7] font-normal">
                {post.excerpt}
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* ── HERO SLIKA ── */}
        <div className="max-w-5xl mx-auto px-8 sm:px-14 py-10">
          <Reveal variant="scale-in">
            <div className="rounded-[1.75rem] overflow-hidden" style={{ aspectRatio: '21/9' }}>
              <BlurImage src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>

        {/* ── SADRŽAJ ── */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-8 sm:px-14">
            <Reveal y={24}>
              {post.content ? (
                post.content.split('\n\n').map((p: string, i: number) => (
                  <p key={i} className="text-[17px] text-gray-600 leading-[1.85] mb-7 font-normal">{p}</p>
                ))
              ) : (
                <p className="text-[17px] text-gray-400 leading-[1.85] italic font-normal">
                  Kompletan sadržaj za ovaj članak trenutno nije dostupan.
                </p>
              )}
            </Reveal>

            {/* Share */}
            <Reveal y={16}>
              <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#111] uppercase tracking-widest">
                  <Share2 size={15} className="text-[#e5252a]" /> Podijeli članak
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { Icon: Facebook, cls: 'hover:bg-[#1877F2] hover:border-[#1877F2]', label: 'Facebook' },
                    { Icon: Twitter, cls: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]', label: 'Twitter' },
                    { Icon: Linkedin, cls: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]', label: 'LinkedIn' },
                  ].map(({ Icon, cls, label }) => (
                    <a key={label} href="#" aria-label={`Podijeli na ${label}`}
                      className={`w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400
                        hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${cls}`}>
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SLIČNI ČLANCI ── */}
        {related.length > 0 && (
          <section className="py-20 bg-[#fafafa] border-t border-gray-100">
            <div className="max-w-[88rem] mx-auto px-8 sm:px-14 xl:px-20">
              <h3 className="font-black text-[#111] mb-10 tracking-[-0.03em]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem' }}>
                Pročitajte još
              </h3>
              <StaggerGroup stagger={0.1} className="grid md:grid-cols-2 gap-6">
                {related.map(rp => (
                  <StaggerItem key={rp.id}>
                  <Link to={`/news/${rp.id}`}
                    className="group flex rounded-[1.25rem] overflow-hidden border border-gray-100 bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-36 flex-shrink-0 overflow-hidden">
                      <img src={rp.imageUrl} alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-center p-5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#e5252a] mb-2 uppercase tracking-widest">{rp.date}</span>
                      <h4 className="text-[14px] font-black text-[#111] group-hover:text-[#e5252a] transition-colors leading-snug mb-3 line-clamp-2"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {rp.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-gray-400 group-hover:text-[#e5252a] transition-colors">
                        Čitaj <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
