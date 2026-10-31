import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Search,
  Radio,
  Settings,
  Info,
} from 'lucide-react';

const NAV_SECTIONS = [
  { path: '/', label: 'Tableau de Bord', shortLabel: 'Tableau', icon: LayoutDashboard, badge: null },
  { path: '/map', label: 'Carte Mondiale', shortLabel: 'Carte', icon: Globe, badge: 'Géo' },
  { path: '/explorer', label: 'Explorateur', shortLabel: 'Explorer', icon: Search, badge: null },
  { path: '/feed', label: 'Flux en Direct', shortLabel: 'Flux', icon: Radio, badge: 'Live' },
  { path: '/settings', label: 'Paramètres', shortLabel: 'Réglages', icon: Settings, badge: null },
  { path: '/about', label: 'À Propos & Créateurs', shortLabel: 'À Propos', icon: Info, badge: null },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Navigation principale"
      className="bg-panel/70 border-b border-border-subtle backdrop-blur-md px-4 sm:px-6"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-6 items-stretch gap-1 py-1 sm:flex sm:items-center sm:justify-between sm:gap-2 sm:overflow-x-auto sm:overscroll-x-contain no-scrollbar">
        <div className="contents sm:flex sm:items-center sm:gap-2">
          {NAV_SECTIONS.map(({ path, label, shortLabel, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              aria-label={label}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-0.5 py-2 text-[10px] tracking-tight font-semibold leading-none whitespace-nowrap transition-all duration-150 cursor-pointer sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-xs sm:leading-normal ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/30 shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-panel-light border border-transparent'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0 sm:w-4 sm:h-4" />
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
              {badge && (
                <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold">
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
