import { useEffect, useState } from 'react';
import { Mail, Trash2, ChevronDown } from 'lucide-react';
import { contactApi } from '../lib/api';
import { showToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { formatDate } from '../lib/utils';

interface Message {
  id: number; first_name: string; last_name: string; email: string;
  subject: string; message: string; status: string; created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nova', color: 'bg-blue-500/15 text-blue-400' },
  { value: 'read', label: 'Pročitano', color: 'bg-[#2a2a2a] text-[#888]' },
  { value: 'replied', label: 'Odgovoreno', color: 'bg-green-500/15 text-green-400' },
  { value: 'archived', label: 'Arhivirano', color: 'bg-[#1a1a1a] text-[#555]' },
];

function statusInfo(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
}

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);

  async function load() {
    setLoading(true);
    try { setMessages(await contactApi.getAll(filterStatus || undefined)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterStatus]);

  async function handleStatus(msg: Message, status: string) {
    try {
      await contactApi.setStatus(msg.id, status);
      showToast('Status je ažuriran.');
      load();
      if (selected?.id === msg.id) setSelected({ ...selected, status });
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  async function handleDelete(msg: Message) {
    if (!confirm('Obrisati ovu poruku?')) return;
    try {
      await contactApi.delete(msg.id);
      showToast('Poruka je obrisana.');
      setSelected(null);
      load();
    } catch (err: any) { showToast(err.message, 'error'); }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Kontakt poruke"
        subtitle={`${messages.length} poruka`}
      />

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[{ value: '', label: 'Sve' }, ...STATUS_OPTIONS].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterStatus === opt.value
                ? 'bg-[#e5252a] text-white'
                : 'bg-[#1e1e1e] text-[#888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !messages.length ? (
          <div className="p-12 text-center">
            <Mail size={32} className="text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">Nema poruka.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Pošiljatelj</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Naslov</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#666] uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {messages.map(msg => {
                const si = statusInfo(msg.status);
                return (
                  <tr
                    key={msg.id}
                    className="hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => setSelected(msg)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{msg.first_name} {msg.last_name}</div>
                      <div className="text-xs text-[#666]">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#888] max-w-xs truncate">{msg.subject || '(bez naslova)'}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${si.color}`}>{si.label}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#666]">{formatDate(msg.created_at)}</td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(msg)}
                        className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <Modal title={selected.subject || 'Poruka'} onClose={() => setSelected(null)} size="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{selected.first_name} {selected.last_name}</div>
                <div className="text-sm text-[#666]">{selected.email}</div>
              </div>
              <div className="text-sm text-[#555]">{formatDate(selected.created_at)}</div>
            </div>

            <div className="bg-[#111] rounded-xl p-4 text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap border border-[#222]">
              {selected.message}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Promijeni status</label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatus(selected, opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selected.status === opt.value
                        ? 'bg-[#e5252a] text-white border-[#e5252a]'
                        : 'border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#222]">
              <button onClick={() => handleDelete(selected)} className="admin-btn-danger">
                <Trash2 size={14} /> Obriši poruku
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Vaša poruka'}`}
                className="admin-btn-primary"
              >
                <Mail size={14} /> Odgovori e-mailom
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
