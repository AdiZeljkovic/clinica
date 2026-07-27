import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, X, Upload } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { slugify } from '../lib/utils';

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
const FRONTEND_BASE = (import.meta as any).env?.VITE_FRONTEND_URL || 'http://localhost:3002';

function resolveImg(src: string): string {
  if (!src) return src;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) return FRONTEND_BASE + src;
  return src;
}

function getToken() { return localStorage.getItem('bioclinica_token'); }

async function uploadFile(file: File): Promise<string> {
  const token = getToken();
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.url as string;
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-[#e5252a] focus:ring-1 focus:ring-[#e5252a]/30 transition-all placeholder:text-[#555]';

function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      showToast('Slika je uploadana.');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input className={inputCls} value={value} onChange={e => onChange(e.target.value)}
          placeholder="URL slike ili /slike/... ili uploadaj →" />
        <label className={`flex-shrink-0 inline-flex items-center gap-2 px-4 h-[42px] rounded-xl border border-[#2a2a2a] cursor-pointer text-sm font-semibold transition-colors ${uploading ? 'text-[#555] border-[#222]' : 'text-[#aaa] hover:text-white hover:border-[#444]'}`}>
          <Upload size={15} />
          {uploading ? 'Upload...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {value && (
        <div className="mt-2 rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0f0f0f] h-40 flex items-center justify-center">
          <img src={resolveImg(value)} alt="Preview" className="max-w-full max-h-full object-contain"
            onError={e => (e.currentTarget.style.opacity = '0.2')} />
        </div>
      )}
    </div>
  );
}

interface Product {
  id: string; category_id: string; name: string; tagline: string; short_description: string;
  packaging: string; price: number; image_url: string; is_active: number;
  sort_order: number; benefits: string[];
  usage_instructions: string; composition: string; warnings: string;
  storage_temp: string; country_of_origin: string;
}
interface Category { id: string; name: string; }

function ProductForm({ initial, categories, onSave, onClose }: {
  initial?: Product; categories: Category[]; onSave: () => void; onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    id: initial?.id || '',
    category_id: initial?.category_id || (categories[0]?.id || ''),
    name: initial?.name || '',
    tagline: initial?.tagline || '',
    short_description: initial?.short_description || '',
    packaging: initial?.packaging || '',
    price: initial?.price ?? '',
    image_url: initial?.image_url || '',
    is_active: initial?.is_active ?? 1,
    sort_order: initial?.sort_order ?? 0,
    usage_instructions: initial?.usage_instructions || '',
    composition: initial?.composition || '',
    warnings: initial?.warnings || '',
    storage_temp: initial?.storage_temp || '',
    country_of_origin: initial?.country_of_origin || '',
  });
  const [benefits, setBenefits] = useState<string[]>(initial?.benefits || ['']);
  const [loading, setLoading] = useState(false);

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })); }

  function handleNameChange(v: string) {
    set('name', v);
    if (!isEdit && form.packaging) set('id', slugify(`${v}-${form.packaging}`));
    else if (!isEdit) set('id', slugify(v));
  }

  function handlePackagingChange(v: string) {
    set('packaging', v);
    if (!isEdit) set('id', slugify(`${form.name}-${v}`));
  }

  function addBenefit() { setBenefits(b => [...b, '']); }
  function removeBenefit(i: number) { setBenefits(b => b.filter((_, idx) => idx !== i)); }
  function updateBenefit(i: number, v: string) { setBenefits(b => b.map((x, idx) => idx === i ? v : x)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.name || !form.category_id) {
      showToast('ID, naziv i kategorija su obavezni.', 'error'); return;
    }
    const filteredBenefits = benefits.filter(b => b.trim());
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(String(form.price)), benefits: filteredBenefits };
      if (isEdit) await productsApi.update(initial!.id, payload);
      else await productsApi.create(payload);
      showToast(isEdit ? 'Proizvod je ažuriran.' : 'Proizvod je kreiran.');
      onSave();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Naziv *</label>
          <input className="admin-input" value={form.name} onChange={e => handleNameChange(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Pakovanje</label>
          <input className="admin-input" value={form.packaging} onChange={e => handlePackagingChange(e.target.value)} placeholder="30 kapsula" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">ID (slug) *</label>
        <input className="admin-input" value={form.id} onChange={e => set('id', e.target.value)} disabled={isEdit} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Kategorija *</label>
          <select className="admin-input" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Cijena (€) *</label>
          <input className="admin-input" type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Tagline (podnaslov)</label>
        <input className="admin-input" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="npr. Za zdravlje prostate kod odraslih muškaraca" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Kratki opis</label>
        <textarea className="admin-input" rows={2} value={form.short_description} onChange={e => set('short_description', e.target.value)} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Upute za uporabu</label>
        <textarea className="admin-input" rows={2} value={form.usage_instructions} onChange={e => set('usage_instructions', e.target.value)} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Sastav</label>
        <textarea className="admin-input" rows={4} value={form.composition} onChange={e => set('composition', e.target.value)} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Upozorenja i napomene</label>
        <textarea className="admin-input" rows={4} value={form.warnings} onChange={e => set('warnings', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Temperatura čuvanja</label>
          <input className="admin-input" value={form.storage_temp} onChange={e => set('storage_temp', e.target.value)} placeholder="Na sobnoj temperaturi..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Zemlja porijekla</label>
          <input className="admin-input" value={form.country_of_origin} onChange={e => set('country_of_origin', e.target.value)} placeholder="Republika Srbija" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Slika proizvoda</label>
        <ImageField value={form.image_url} onChange={v => set('image_url', v)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Benefiti</label>
          <button type="button" onClick={addBenefit} className="text-xs text-[#e5252a] hover:text-[#c91d22] font-semibold">+ Dodaj</button>
        </div>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input className="admin-input" value={b} onChange={e => updateBenefit(i, e.target.value)} placeholder={`Benefit ${i + 1}`} />
              <button type="button" onClick={() => removeBenefit(i)} className="p-2 text-[#666] hover:text-red-400 flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Redoslijed</label>
          <input className="admin-input" type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} min={0} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_active}
              onChange={e => set('is_active', e.target.checked ? 1 : 0)}
              className="w-4 h-4 accent-[#e5252a]"
            />
            <span className="text-sm text-[#aaa]">Aktivan (vidljiv na sajtu)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? 'Čuvam...' : isEdit ? 'Spremi promjene' : 'Kreiraj proizvod'}
        </button>
        <button type="button" onClick={onClose} className="admin-btn-secondary">Otkaži</button>
      </div>
    </form>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | Product | null>(null);
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([productsApi.getAll(), categoriesApi.getAll()]);
      setProducts(p); setCategories(c);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(p: Product) {
    if (!confirm(`Obrisati proizvod "${p.name} ${p.packaging}"?`)) return;
    try {
      await productsApi.delete(p.id);
      showToast('Proizvod je obrisan.');
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  const filtered = products.filter(p =>
    `${p.name} ${p.packaging} ${p.id}`.toLowerCase().includes(filter.toLowerCase())
  );

  const catName = (id: string) => categories.find(c => c.id === id)?.name || id;

  return (
    <div className="p-8">
      <PageHeader
        title="Proizvodi"
        subtitle={`${products.length} proizvoda ukupno`}
        action={
          <button className="admin-btn-primary" onClick={() => setModal('create')}>
            <Plus size={16} /> Novi proizvod
          </button>
        }
      />

      <div className="mb-4">
        <input
          className="admin-input max-w-xs"
          placeholder="Pretraži proizvode..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !filtered.length ? (
          <div className="p-12 text-center">
            <Package size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">{filter ? 'Nema rezultata.' : 'Nema proizvoda.'}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Proizvod</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Kategorija</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Cijena</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={resolveImg(p.image_url)} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-[#555]" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{p.name}</div>
                        <div className="text-xs text-[#666]">{p.packaging}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#888]">{catName(p.category_id)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{Number(p.price).toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${p.is_active ? 'bg-green-500/15 text-green-400' : 'bg-[#2a2a2a] text-[#555]'}`}>
                      {p.is_active ? 'Aktivan' : 'Neaktivan'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal(p)} className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Novi proizvod' : `Uredi: ${(modal as Product).name}`}
          onClose={() => setModal(null)}
          size="lg"
        >
          <ProductForm
            initial={modal === 'create' ? undefined : modal as Product}
            categories={categories}
            onSave={() => { setModal(null); load(); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
