import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, FileText, Mail,
  Users, Search, LogOut, ChevronRight, Layers,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/hero', label: 'Hero Slajdovi', icon: Layers },
  { to: '/products', label: 'Proizvodi', icon: Package },
  { to: '/categories', label: 'Kategorije', icon: Tag },
  { to: '/blog', label: 'Blog članci', icon: FileText },
  { to: '/contact', label: 'Poruke', icon: Mail },
  { to: '/newsletter', label: 'Newsletter', icon: Users },
  { to: '/seo', label: 'SEO', icon: Search },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('bioclinica_token');
    navigate('/login');
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-60 flex flex-col z-40" style={{ background: '#141414', borderRight: '1px solid #222' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#222]">
        <img src="/Bioclinica_Logo.png" alt="Bioclinica" className="h-8" />
        <div>
          <div className="text-xs font-semibold text-[#e5252a] uppercase tracking-widest">Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[#e5252a] text-white'
                  : 'text-[#aaa] hover:text-white hover:bg-[#222]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} className={isActive ? 'text-white' : 'text-[#666] group-hover:text-white'} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[#222] pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#aaa] hover:text-white hover:bg-[#222] transition-all"
        >
          <LogOut size={17} className="text-[#666]" />
          Odjava
        </button>
      </div>
    </aside>
  );
}
