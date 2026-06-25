import { useEffect, useState } from 'react';
import { Search, Save } from 'lucide-react';
import { seoApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';

interface SeoSetting {
  id: number; page_key: string; page_label: string;
  meta_title: string; meta_description: string;
  og_title: string; og_description: string; og_image: string; canonical_url: string;
}

function SeoCard({ setting, onSave }: { setting: SeoSetting; onSave: () => void }) {
  const [form, setForm] = useState({
    page_label: setting.page_label || '',
    meta_title: setting.meta_title || '',
    meta_description: setting.meta_description || '',
    og_title: setting.og_title || '',
    og_description: setting.og_description || '',
    og_image: setting.og_image || '',
    canonical_url: setting.canonical_url || '',
  });
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      await seoApi.update(setting.page_key, form);
      showToast(`SEO za "${form.page_label || setting.page_key}" je ažuriran.`);
      setDirty(false);
      onSave();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const titleLen = form.meta_title.length;
  const descLen = form.meta_description.length;

  return (
    <div className="admin-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#1e1e1e] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Search size={16} className="text-[#e5252a]" />
          <div className="text-left">
            <div className="text-sm font-semibold text-white">{form.page_label || setting.page_key}</div>
            <div className="text-xs text-[#555]">/{setting.page_key}</div>
          </div>
          {dirty && (
            <span className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full">Nespremljeno</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {expanded && dirty && (
            <button
              onClick={e => { e.stopPropagation(); handleSave(); }}
              disabled={loading}
              className="admin-btn-primary text-xs py-1.5"
            >
              <Save size={13} />
              {loading ? 'Čuvam...' : 'Spremi'}
            </button>
          )}
          <span className="text-[#444] text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-[#1e1e1e] space-y-4 pt-4">
          {/* Google Preview */}
          <div className="bg-white rounded-xl p-4">
            <div className="text-[#1a0dab] text-base font-medium leading-tight truncate">
              {form.meta_title || 'Meta title...'}
            </div>
            <div className="text-[#006621] text-xs mt-0.5">bioclinica.ba › {setting.page_key}</div>
            <div className="text-[#545454] text-xs mt-1 leading-relaxed line-clamp-2">
              {form.meta_description || 'Meta opis...'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                Meta naslov <span className={titleLen > 60 ? 'text-red-400' : 'text-[#555]'}>({titleLen}/60)</span>
              </label>
              <input className="admin-input" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="Bioclinica - ..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                Meta opis <span className={descLen > 160 ? 'text-red-400' : 'text-[#555]'}>({descLen}/160)</span>
              </label>
              <input className="admin-input" value={form.meta_description} onChange={e => set('meta_description', e.target.value)} />
            </div>
          </div>

          <div className="border-t border-[#1e1e1e] pt-4">
            <p className="text-xs text-[#555] mb-3 font-semibold uppercase tracking-wider">Open Graph (društvene mreže)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#666] mb-1.5">OG Naslov</label>
                <input className="admin-input" value={form.og_title} onChange={e => set('og_title', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1.5">OG Opis</label>
                <input className="admin-input" value={form.og_description} onChange={e => set('og_description', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1.5">OG Slika (URL)</label>
                <input className="admin-input" value={form.og_image} onChange={e => set('og_image', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1.5">Canonical URL</label>
                <input className="admin-input" value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} placeholder="https://bioclinica.ba/..." />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="admin-btn-primary">
            <Save size={15} />
            {loading ? 'Čuvam...' : 'Spremi SEO postavke'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Seo() {
  const [settings, setSettings] = useState<SeoSetting[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setSettings(await seoApi.getAll()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="SEO Postavke"
        subtitle="Upravljajte meta tagovima za svaku stranicu"
      />

      {loading ? (
        <div className="text-center text-[#555] text-sm py-12">Učitavam...</div>
      ) : (
        <div className="space-y-3">
          {settings.map(s => (
            <SeoCard key={s.page_key} setting={s} onSave={load} />
          ))}
        </div>
      )}
    </div>
  );
}
