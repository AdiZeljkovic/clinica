import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Image, Upload, X } from 'lucide-react';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
const FRONTEND_BASE = (import.meta as any).env?.VITE_FRONTEND_URL || 'http://localhost:3002';

// Relativne putanje (/slike/...) žive u frontend public folderu — razriješi ih za preview.
// Apsolutne (http..., uploadane slike, data:) ostaju kakve jesu.
function resolveImg(src: string): string {
  if (!src) return src;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) return FRONTEND_BASE + src;
  return src;
}

function getToken() { return localStorage.getItem('bioclinica_token'); }

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

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

interface Pictogram { src: string; label: string; }

interface Slide {
  id: number;
  tagline: string; name1: string; name2: string; name2b: string;
  sub: string; image_url: string; image_desktop: string; image_mobile: string;
  accent_color: string;
  pictograms: Pictogram[]; product_id: string;
  is_active: number; sort_order: number;
}

interface Product { id: string; name: string; packaging: string; }

const EMPTY: Omit<Slide, 'id'> = {
  tagline: '', name1: '', name2: '', name2b: '', sub: '', image_url: '', image_desktop: '', image_mobile: '',
  accent_color: '#d4600a', pictograms: [], product_id: '', is_active: 1, sort_order: 0,
};

const PRESET_COLORS = ['#d4600a', '#7c3aed', '#16a34a', '#ca8a04', '#e5252a', '#0891b2', '#db2777'];

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-[#e5252a] focus:ring-1 focus:ring-[#e5252a]/30 transition-all placeholder:text-[#555]';
const labelCls = 'block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2';

// ── Polje za sliku: upload sa računara ILI unos URL-a ──
function ImageField({ value, onChange, previewClass = 'h-32' }: {
  value: string; onChange: (url: string) => void; previewClass?: string;
}) {
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
        <div className={`mt-2 rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0f0f0f] ${previewClass} flex items-center justify-center`}>
          <img src={resolveImg(value)} alt="Preview" className="max-w-full max-h-full object-contain"
            onError={e => (e.currentTarget.style.opacity = '0.2')} />
        </div>
      )}
    </div>
  );
}

function SlideForm({ initial, products, onSave, onClose }: {
  initial?: Slide; products: Product[]; onSave: () => void; onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<Omit<Slide, 'id'>>(initial ? {
    tagline: initial.tagline || '', name1: initial.name1 || '', name2: initial.name2 || '',
    name2b: initial.name2b || '', sub: initial.sub || '', image_url: initial.image_url || '',
    image_desktop: initial.image_desktop || '', image_mobile: initial.image_mobile || '',
    accent_color: initial.accent_color || '#d4600a',
    pictograms: Array.isArray(initial.pictograms) ? initial.pictograms : [],
    product_id: initial.product_id || '', is_active: initial.is_active, sort_order: initial.sort_order,
  } : { ...EMPTY });
  const [loading, setLoading] = useState(false);

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })); }

  function addPic() { set('pictograms', [...form.pictograms, { src: '', label: '' }]); }
  function updatePic(i: number, key: keyof Pictogram, val: string) {
    set('pictograms', form.pictograms.map((p, idx) => idx === i ? { ...p, [key]: val } : p));
  }
  function removePic(i: number) { set('pictograms', form.pictograms.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name1) { showToast('Naziv (prvi red) je obavezan.', 'error'); return; }
    setLoading(true);
    try {
      const payload = { ...form, pictograms: form.pictograms.filter(p => p.src || p.label) };
      if (isEdit) await apiFetch(`/hero-slides/${initial!.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      else await apiFetch('/hero-slides', { method: 'POST', body: JSON.stringify(payload) });
      showToast(isEdit ? 'Slajd je ažuriran.' : 'Slajd je kreiran.');
      onSave();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Tagline */}
      <div>
        <label className={labelCls}>Tagline (mali tekst iznad naslova)</label>
        <input className={inputCls} value={form.tagline} onChange={e => set('tagline', e.target.value)}
          placeholder="npr. TOPLINA KOJA PRUŽA OLAKŠANJE" />
      </div>

      {/* Naslov — 3 dijela */}
      <div>
        <label className={labelCls}>Naslov proizvoda</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input className={inputCls} value={form.name1} onChange={e => set('name1', e.target.value)}
              placeholder="KURKUMA *" required />
            <p className="text-[10px] text-[#666] mt-1">1. red (crno)</p>
          </div>
          <div>
            <input className={inputCls} value={form.name2} onChange={e => set('name2', e.target.value)}
              placeholder="CREAM" />
            <p className="text-[10px] text-[#666] mt-1">2. red — crni dio</p>
          </div>
          <div>
            <input className={inputCls} value={form.name2b} onChange={e => set('name2b', e.target.value)}
              placeholder="HOT" />
            <p className="text-[10px] text-[#666] mt-1">2. red — u boji (accent)</p>
          </div>
        </div>
      </div>

      {/* Opis */}
      <div>
        <label className={labelCls}>Opis / podnaslov</label>
        <textarea className={inputCls} rows={2} value={form.sub} onChange={e => set('sub', e.target.value)}
          placeholder="Kratki opis ispod naslova..." />
      </div>

      {/* KV pozadinske slike */}
      <div>
        <label className={labelCls}>KV slika — desktop (full-width pozadina, 2560×1200)</label>
        <ImageField value={form.image_desktop} onChange={v => set('image_desktop', v)} previewClass="h-32" />
      </div>
      <div>
        <label className={labelCls}>KV slika — mobilna (1080×1400)</label>
        <ImageField value={form.image_mobile} onChange={v => set('image_mobile', v)} previewClass="h-32" />
      </div>

      {/* Accent boja */}
      <div>
        <label className={labelCls}>Accent boja (tagline, riječ u boji, dugme, tačkice)</label>
        <div className="flex items-center gap-3">
          <input type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)}
            className="w-11 h-11 rounded-lg bg-transparent border border-[#2a2a2a] cursor-pointer p-1" />
          <input className={inputCls + ' max-w-[140px]'} value={form.accent_color}
            onChange={e => set('accent_color', e.target.value)} placeholder="#d4600a" />
          <div className="flex items-center gap-1.5">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('accent_color', c)}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{ background: c, borderColor: form.accent_color === c ? '#fff' : 'transparent' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Piktogrami */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls + ' mb-0'}>Piktogrami (ikona + tekst)</label>
          <button type="button" onClick={addPic}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#444] text-xs font-semibold transition-colors">
            <Plus size={13} /> Dodaj piktogram
          </button>
        </div>
        {form.pictograms.length === 0 ? (
          <p className="text-[12px] text-[#555] py-3 px-4 rounded-xl border border-dashed border-[#2a2a2a]">
            Nema piktograma. Klikni "Dodaj piktogram".
          </p>
        ) : (
          <div className="space-y-3">
            {form.pictograms.map((pic, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl border border-[#2a2a2a] bg-[#141414]">
                <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
                  {pic.src
                    ? <img src={resolveImg(pic.src)} alt="" className="max-w-full max-h-full object-contain" onError={e => (e.currentTarget.style.opacity = '0.2')} />
                    : <Image size={16} className="text-[#444]" />}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <ImageField value={pic.src} onChange={v => updatePic(i, 'src', v)} previewClass="hidden" />
                  <input className={inputCls} value={pic.label} onChange={e => updatePic(i, 'label', e.target.value)}
                    placeholder="Tekst ispod ikone (npr. Dermatološki testirano)" />
                </div>
                <button type="button" onClick={() => removePic(i)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-red-400 hover:border-red-400/40 transition-colors">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proizvod + sort */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Vezani proizvod (dugme "Kupi odmah")</label>
          <select className={inputCls} value={form.product_id} onChange={e => set('product_id', e.target.value)}>
            <option value="">— bez linka —</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} {p.packaging && `(${p.packaging})`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Redoslijed (sort)</label>
          <input type="number" className={inputCls} value={form.sort_order}
            onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
      </div>

      {/* Aktivan */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div onClick={() => set('is_active', form.is_active ? 0 : 1)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form.is_active ? 'bg-[#e5252a]' : 'bg-[#333]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-[#aaa]">{form.is_active ? 'Aktivan (vidljiv na stranici)' : 'Neaktivan (skriven)'}</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2 border-t border-[#2a2a2a]">
        <button type="submit" disabled={loading}
          className="flex-1 h-10 bg-[#e5252a] hover:bg-[#c91d22] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors">
          {loading ? 'Čuvanje...' : isEdit ? 'Sačuvaj izmjene' : 'Dodaj slajd'}
        </button>
        <button type="button" onClick={onClose}
          className="px-6 h-10 border border-[#2a2a2a] text-[#aaa] hover:text-white text-sm rounded-xl transition-colors">
          Otkaži
        </button>
      </div>
    </form>
  );
}

export default function HeroSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Slide | undefined>();

  async function load() {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        apiFetch('/hero-slides/all'),
        apiFetch('/products/all'),
      ]);
      setSlides(s);
      setProducts(p);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(undefined); setModalOpen(true); }
  function openEdit(s: Slide) { setEditing(s); setModalOpen(true); }

  async function toggleActive(s: Slide) {
    try {
      await apiFetch(`/hero-slides/${s.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...s, is_active: s.is_active ? 0 : 1 }),
      });
      showToast(s.is_active ? 'Slajd je sakriven.' : 'Slajd je aktiviran.');
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  async function deleteSlide(s: Slide) {
    if (!confirm(`Obrisati slajd "${s.name1} ${s.name2b}"?`)) return;
    try {
      await apiFetch(`/hero-slides/${s.id}`, { method: 'DELETE' });
      showToast('Slajd je obrisan.');
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  return (
    <div>
      <PageHeader
        title="Hero Slajdovi"
        subtitle="Upravljajte slajdovima koji se prikazuju u hero sekciji naslovnice."
        action={<button onClick={openCreate} className="inline-flex items-center gap-2 h-9 px-4 bg-[#e5252a] hover:bg-[#c91d22] text-white font-bold text-sm rounded-xl transition-colors"><Plus size={16} /> Novi slajd</button>}
      />

      {loading ? (
        <div className="text-center py-20 text-[#666]">Učitavanje...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#2a2a2a] rounded-2xl">
          <Image size={40} className="mx-auto text-[#444] mb-4" />
          <p className="text-[#666] font-medium">Nema slajdova. Dodajte prvi.</p>
          <button onClick={openCreate} className="mt-4 inline-flex items-center gap-2 h-9 px-4 bg-[#e5252a] hover:bg-[#c91d22] text-white font-bold text-sm rounded-xl transition-colors">
            <Plus size={15} /> Dodaj slajd
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {slides.map((s, idx) => (
            <div key={s.id}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${s.is_active ? 'border-[#2a2a2a] bg-[#141414]' : 'border-[#1e1e1e] bg-[#0f0f0f] opacity-60'}`}>

              <GripVertical size={18} className="text-[#444] flex-shrink-0 cursor-grab" />

              <span className="w-6 h-6 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-[11px] font-bold text-[#555] flex-shrink-0">
                {idx + 1}
              </span>

              {/* Sličica */}
              <div className="w-20 h-12 rounded-xl overflow-hidden bg-[#1e1e1e] flex-shrink-0 border border-[#2a2a2a] flex items-center justify-center">
                {(s.image_desktop || s.image_url)
                  ? <img src={resolveImg(s.image_desktop || s.image_url)} alt={s.name1} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  : <Image size={16} className="text-[#444]" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.accent_color || '#e5252a' }}>{s.tagline}</span>
                  {!s.is_active && <span className="text-[9px] bg-[#2a2a2a] text-[#666] px-2 py-0.5 rounded-full font-bold uppercase">Skriven</span>}
                </div>
                <p className="font-black text-white text-[15px] leading-snug truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {s.name1} {s.name2} <span style={{ color: s.accent_color }}>{s.name2b}</span>
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {s.pictograms?.length > 0 && <span className="text-[11px] text-[#666]">🎯 {s.pictograms.length} piktograma</span>}
                  {s.product_id && <span className="text-[11px] text-[#555]">🔗 {s.product_id}</span>}
                </div>
              </div>

              {/* Akcije */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(s)} title={s.is_active ? 'Sakrij' : 'Aktiviraj'}
                  className="w-8 h-8 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-[#444] transition-colors">
                  {s.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(s)} title="Uredi"
                  className="w-8 h-8 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-[#e5252a] hover:border-[#e5252a]/40 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteSlide(s)} title="Obriši"
                  className="w-8 h-8 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-red-400 hover:border-red-400/40 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {slides.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[12px] text-[#666] leading-relaxed">
          <strong className="text-[#888]">Napomena:</strong> Slajdovi se prikazuju po redoslijedu (sort).
          Izmjene se odmah primjenjuju na naslovnici — osvježite stranicu da vidite promjene.
          Samo aktivni slajdovi su vidljivi posjetiteljima.
        </div>
      )}

      {modalOpen && <Modal size="lg" onClose={() => setModalOpen(false)}
        title={editing ? `Uredi slajd — ${editing.name1} ${editing.name2b}` : 'Novi hero slajd'}>
        <SlideForm
          initial={editing}
          products={products}
          onSave={() => { setModalOpen(false); load(); }}
          onClose={() => setModalOpen(false)}
        />
      </Modal>}
    </div>
  );
}
