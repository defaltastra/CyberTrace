import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Search,
  Radio,
  Settings,
  Info,
} from 'lucide-react';

export const NAV_SECTIONS = [
  { path: '/', label: 'Tableau de Bord', icon: LayoutDashboard, badge: null },
  { path: '/map', label: 'Carte Mondiale', icon: Globe, badge: 'Géo' },
  { path: '/explorer', label: 'Explorateur', icon: Search, badge: null },
  { path: '/feed', label: 'Flux en Direct', icon: Radio, badge: 'Live' },
  { path: '/settings', label: 'Paramètres', icon: Settings, badge: null },
  { path: '/about', label: 'À Propos & Créateurs', icon: Info, badge: null },
];

export default function Navbar({ criticalCount = 0 }) {
  return (
    <nav className="bg-panel/70 border-b border-border-subtle backdrop-blur-md sticky top-14 z-40 px-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_SECTIONS.map(({ path, label, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/30 shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-panel-light border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-accent/20 text-accent font-bold">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right status badge */}
        <div className="hidden lg:flex items-center gap-2 pl-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-panel-light border border-border-subtle text-[11px] font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>CISA KEV EN LIGNE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
