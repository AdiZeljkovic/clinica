import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { categoriesApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { slugify } from '../lib/utils';

interface Category { id: string; name: string; description?: string; sort_order: number; }

function CategoryForm({ initial, categories, onSave, onClose }: {
  initial?: Category; categories: Category[]; onSave: () => void; onClose: () => void;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [id, setId] = useState(initial?.id || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [sort_order, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [loading, setLoading] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    if (!isEdit) setId(slugify(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !name) { showToast('ID i naziv su obavezni.', 'error'); return; }
    if (!isEdit && categories.some(c => c.id === id)) {
      showToast('Kategorija s tim ID-om već postoji.', 'error'); return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await categoriesApi.update(initial!.id, { name, description, sort_order });
      } else {
        await categoriesApi.create({ id, name, description, sort_order });
      }
      showToast(isEdit ? 'Kategorija je ažurirana.' : 'Kategorija je kreirana.');
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
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Naziv *</label>
        <input className="admin-input" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Zdravlje prostate" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">ID (slug) *</label>
        <input
          className="admin-input"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="zdravlje-prostate"
          disabled={isEdit}
          required
        />
        {isEdit && <p className="text-xs text-[#555] mt-1">ID se ne može mijenjati nakon kreiranja.</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Opis</label>
        <textarea
          className="admin-input"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Kratki opis kategorije..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Redoslijed sortiranja</label>
        <input className="admin-input" type="number" value={sort_order} onChange={e => setSortOrder(+e.target.value)} min={0} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? 'Čuvam...' : isEdit ? 'Spremi promjene' : 'Kreiraj kategoriju'}
        </button>
        <button type="button" onClick={onClose} className="admin-btn-secondary">Otkaži</button>
      </div>
    </form>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | Category | null>(null);

  async function load() {
    setLoading(true);
    try {
      setCategories(await categoriesApi.getAll());
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(cat: Category) {
    if (!confirm(`Obrisati kategoriju "${cat.name}"? Svi proizvodi u njoj će biti obrisani.`)) return;
    try {
      await categoriesApi.delete(cat.id);
      showToast('Kategorija je obrisana.');
      load();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Kategorije"
        subtitle={`${categories.length} kategorija`}
        action={
          <button className="admin-btn-primary" onClick={() => setModal('create')}>
            <Plus size={16} /> Nova kategorija
          </button>
        }
      />

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !categories.length ? (
          <div className="p-12 text-center">
            <Tag size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">Nema kategorija. Kreirajte prvu.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Naziv</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Opis</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Redoslijed</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-white text-sm">{cat.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-[#1e1e1e] text-[#e5252a] px-2 py-1 rounded">{cat.id}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-[#666]">{cat.sort_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setModal(cat)}
                        className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors"
                      >
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
          title={modal === 'create' ? 'Nova kategorija' : `Uredi: ${(modal as Category).name}`}
          onClose={() => setModal(null)}
        >
          <CategoryForm
            initial={modal === 'create' ? undefined : modal as Category}
            categories={categories}
            onSave={() => { setModal(null); load(); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
