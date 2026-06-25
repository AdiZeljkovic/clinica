import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, FileText, Mail, Users, ArrowRight, Clock } from 'lucide-react';
import { dashboardApi } from '../lib/api';
import { formatDate } from '../lib/utils';
import PageHeader from '../components/PageHeader';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400',
  read: 'bg-[#2a2a2a] text-[#888]',
  replied: 'bg-green-500/15 text-green-400',
  archived: 'bg-[#1a1a1a] text-[#555]',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'Nova', read: 'Pročitano', replied: 'Odgovoreno', archived: 'Arhivirano',
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.stats().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  const statCards = [
    { label: 'Proizvodi', value: stats?.products ?? '-', icon: Package, to: '/products', color: '#e5252a' },
    { label: 'Kategorije', value: stats?.categories ?? '-', icon: Tag, to: '/categories', color: '#f59e0b' },
    { label: 'Blog članci', value: stats?.publishedPosts ?? '-', icon: FileText, to: '/blog', color: '#10b981' },
    { label: 'Nove poruke', value: stats?.newMessages ?? '-', icon: Mail, to: '/contact', color: '#3b82f6' },
    { label: 'Pretplatnici', value: stats?.activeSubscribers ?? '-', icon: Users, to: '/newsletter', color: '#8b5cf6' },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Dobrodošli u Bioclinica Admin Panel · ${new Date().toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="admin-card p-5 hover:border-[#333] transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: `${card.color}1a` }}
              >
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <ArrowRight size={14} className="text-[#444] group-hover:text-[#888] transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {loading ? <span className="animate-pulse">—</span> : card.value}
            </div>
            <div className="text-xs text-[#666] mt-1 font-medium">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="admin-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#e5252a]" />
            <h2 className="font-semibold text-white text-sm">Nedavne poruke</h2>
          </div>
          <Link to="/contact" className="text-xs text-[#e5252a] hover:text-[#c91d22] font-semibold transition-colors">
            Sve poruke →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#555] text-sm">Učitavam...</div>
        ) : !data?.recentMessages?.length ? (
          <div className="p-8 text-center text-[#555] text-sm">Nema poruka.</div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {data.recentMessages.map((msg: any) => (
              <div key={msg.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1e1e1e] transition-colors">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: '#e5252a22', color: '#e5252a' }}
                >
                  {msg.first_name?.[0]}{msg.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {msg.first_name} {msg.last_name}
                  </div>
                  <div className="text-xs text-[#666] truncate">{msg.subject || msg.email}</div>
                </div>
                <span className={`status-badge ${STATUS_COLORS[msg.status] || ''}`}>
                  {STATUS_LABELS[msg.status] || msg.status}
                </span>
                <div className="text-xs text-[#555] flex-shrink-0">{formatDate(msg.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
