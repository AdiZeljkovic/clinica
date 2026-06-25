import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff } from 'lucide-react';
import { blogApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { formatDate, slugify } from '../lib/utils';

interface BlogPost {
  id: string; title: string; excerpt: string; content: string;
  image_url: string; slug: string; is_published: number; published_at: string; created_at: string;
}

function BlogForm({ initial, onSave, onClose }: {
  initial?: BlogPost; onSave: () => void; onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    id: initial?.id || '',
    title: initial?.title || '',
    excerpt: initial?.excerpt || '',
    content: initial?.content || '',
    image_url: initial?.image_url || '',
    is_published: initial?.is_published ?? 0,
  });
  const [loading, setLoading] = useState(false);

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })); }

  function handleTitleChange(v: string) {
    set('title', v);
    if (!isEdit) set('id', `post-${slugify(v)}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.title) { showToast('ID i naslov su obavezni.', 'error'); return; }
    setLoading(true);
    try {
      if (isEdit) await blogApi.update(initial!.id, form);
      else await blogApi.create(form);
      showToast(isEdit ? 'Članak je ažuriran.' : 'Članak je kreiran.');
      onSave();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Naslov *</label>
        <input className="admin-input" value={form.title} onChange={e => handleTitleChange(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">ID *</label>
        <input className="admin-input" value={form.id} onChange={e => set('id', e.target.value)} disabled={isEdit} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Excerpt (kratki opis)</label>
        <textarea className="admin-input" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Sadržaj</label>
        <textarea
          className="admin-input font-mono text-xs"
          rows={10}
          value={form.content}
          onChange={e => set('content', e.target.value)}
          placeholder="Puni tekst članka. Odvojite paragrafe s pranim redom."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">URL slike</label>
        <input className="admin-input" type="url" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.is_published}
          onChange={e => set('is_published', e.target.checked ? 1 : 0)}
          className="w-4 h-4 accent-[#e5252a]"
        />
        <span className="text-sm text-[#aaa]">Objavljen (vidljiv na sajtu)</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? 'Čuvam...' : isEdit ? 'Spremi promjene' : 'Kreiraj članak'}
        </button>
        <button type="button" onClick={onClose} className="admin-btn-secondary">Otkaži</button>
      </div>
    </form>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | BlogPost | null>(null);

  async function load() {
    setLoading(true);
    try { setPosts(await blogApi.getAll()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(post: BlogPost) {
    if (!confirm(`Obrisati članak "${post.title}"?`)) return;
    try {
      await blogApi.delete(post.id);
      showToast('Članak je obrisan.');
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Blog članci"
        subtitle={`${posts.length} članaka ukupno`}
        action={
          <button className="admin-btn-primary" onClick={() => setModal('create')}>
            <Plus size={16} /> Novi članak
          </button>
        }
      />

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !posts.length ? (
          <div className="p-12 text-center">
            <FileText size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">Nema blog članaka.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Naslov</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Objavljeno</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Kreirano</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image_url ? (
                        <img src={post.image_url} alt={post.title} className="w-12 h-8 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-8 rounded bg-[#2a2a2a] flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{post.title}</div>
                        <div className="text-xs text-[#555]">/{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${post.is_published ? 'bg-green-500/15 text-green-400' : 'bg-[#2a2a2a] text-[#555]'}`}>
                      {post.is_published ? <><Eye size={11} className="mr-1" />Objavljeno</> : <><EyeOff size={11} className="mr-1" />Draft</>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666]">{post.published_at ? formatDate(post.published_at) : '-'}</td>
                  <td className="px-6 py-4 text-sm text-[#666]">{formatDate(post.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal(post)} className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(post)} className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors">
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
          title={modal === 'create' ? 'Novi članak' : `Uredi: ${(modal as BlogPost).title}`}
          onClose={() => setModal(null)}
          size="lg"
        >
          <BlogForm
            initial={modal === 'create' ? undefined : modal as BlogPost}
            onSave={() => { setModal(null); load(); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
