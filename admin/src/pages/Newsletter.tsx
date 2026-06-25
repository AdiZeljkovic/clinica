import { useEffect, useState } from 'react';
import { Users, Trash2, Download } from 'lucide-react';
import { newsletterApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import { formatDate } from '../lib/utils';

interface Subscriber {
  id: number; email: string; is_active: number; source: string; subscribed_at: string;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [subs, st] = await Promise.all([newsletterApi.getSubscribers(), newsletterApi.getStats()]);
      setSubscribers(subs); setStats(st);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(sub: Subscriber) {
    if (!confirm(`Obrisati pretplatnika "${sub.email}"?`)) return;
    try {
      await newsletterApi.delete(sub.id);
      showToast('Pretplatnik je obrisan.');
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  function exportCsv() {
    const active = subscribers.filter(s => s.is_active);
    const csv = ['Email,Datum pretplate,Izvor', ...active.map(s => `${s.email},${formatDate(s.subscribed_at)},${s.source}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-pretplatnici.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8">
      <PageHeader
        title="Newsletter"
        subtitle="Upravljanje pretplatnicima"
        action={
          <button className="admin-btn-secondary" onClick={exportCsv}>
            <Download size={16} /> Izvezi CSV
          </button>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Ukupno', value: stats.total, color: '#888' },
            { label: 'Aktivnih', value: stats.active, color: '#10b981' },
            { label: 'Odjavljenih', value: stats.inactive, color: '#f87171' },
          ].map(s => (
            <div key={s.label} className="admin-card p-5">
              <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {s.value ?? 0}
              </div>
              <div className="text-xs text-[#666] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <input
          className="admin-input max-w-xs"
          placeholder="Pretraži po emailu..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !filtered.length ? (
          <div className="p-12 text-center">
            <Users size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">Nema pretplatnika.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Izvor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${sub.is_active ? 'bg-green-500/15 text-green-400' : 'bg-[#2a2a2a] text-[#555]'}`}>
                      {sub.is_active ? 'Aktivan' : 'Odjavljen'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] capitalize">{sub.source}</td>
                  <td className="px-6 py-4 text-sm text-[#666]">{formatDate(sub.subscribed_at)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(sub)}
                      className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
