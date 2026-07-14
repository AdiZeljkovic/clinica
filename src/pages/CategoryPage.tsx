import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { api } from '../lib/api';
import { StaggerGroup, StaggerItem, BlurImage } from '../components/motion';

export default function CategoryPage() {
  const { id } = useParams<{ id?: string }>();
  const isAll = !id;
  const [category, setCategory] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.getProducts(isAll ? undefined : id)
      .then(data => setCategoryProducts(data.map((p: any) => ({ ...p, imageUrl: p.image_url, categoryId: p.category_id }))))
      .catch(() => {});
    if (!isAll) {
      fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api'}/categories/${id}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setCategory(data))
        .catch(() => setNotFound(true));
    }
  }, [id]);

  if (notFound) return <Navigate to="/" replace />;
  if (!isAll && !category) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main className="flex-grow">

        <PageHero
          label={isAll ? 'Naši proizvodi' : 'Kategorija'}
          title={isAll ? 'Svi proizvodi' : category.name}
          subtitle={isAll ? 'Pregledajte kompletnu Bioclinica liniju prirodnih dodataka prehrani.' : ((category as any).description || `Pregledajte sve proizvode iz kategorije ${category.name}.`)}
          crumbs={[
            { label: 'Početna', to: '/' },
            { label: isAll ? 'Svi proizvodi' : category.name },
          ]}
        />

        {/* ── PROIZVODI ── */}
        <section className="py-14 sm:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">

            {categoryProducts.length > 0 ? (
              <StaggerGroup stagger={0.07} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <StaggerItem key={product.id}>
                    <Link to={`/product/${product.id}`}
                      className="group flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-gray-100 hover:shadow-[0_8px_40px_rgba(229,37,42,0.12)] hover:-translate-y-1 transition-all duration-300 h-full">

                      <div className="relative bg-[#f8f7f5] overflow-hidden flex items-center justify-center p-6"
                        style={{ aspectRatio: '4/3' }}>
                        {product.imageUrl
                          ? <BlurImage src={product.imageUrl} alt={product.name}
                              className="max-w-full max-h-full object-contain group-hover:scale-[1.04]" />
                          : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl font-black">B</span>
                            </div>
                        }
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="font-black text-[#111] text-[15px]"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {product.name}
                        </p>
                        {product.packaging && (
                          <p className="text-[12px] text-gray-400 mt-0.5 mb-4">{product.packaging}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <span className="font-black text-[#111] text-[18px]">
                            {product.price ? `${Number(product.price).toFixed(2)} €` : ''}
                          </span>
                          <span className="inline-flex items-center gap-2 h-10 px-5 bg-[#e5252a] text-white font-bold text-[12px] uppercase tracking-wide rounded-xl group-hover:bg-[#c91d22] transition-colors duration-200 whitespace-nowrap">
                            Pogledaj <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            ) : (
              <div className="text-center py-24 rounded-[1.5rem] border border-gray-100 bg-[#fafafa]">
                <p className="text-[16px] font-bold text-gray-400">Nema proizvoda u ovoj kategoriji.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
