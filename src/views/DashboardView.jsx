import StatsBar from '../components/StatsBar';
import Charts from '../components/Charts';
import ThreatList from '../components/ThreatList';
import {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardView({
  threats = [],
  onSelectThreat,
  selectedThreat,
  theme = 'toxic-earth',
}) {
  const criticalThreats = threats.filter((t) => t.severity === 'critical');
  const latestCritical = criticalThreats[0];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 panel p-5 border border-border-subtle bg-panel">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-text">Tableau de Bord Exécutif & Analyses</h2>
          </div>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Vue d'ensemble de la cyber-télémétrie mondiale, analyses d'impact, tendances d'exploitation CISA KEV et distribution par criticité.
          </p>
        </div>

        <Link
          to="/map"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg hover:bg-accent/90 text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>Ouvrir la Carte Mondiale</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Critical Alert Ticker */}
      {latestCritical && (
        <div className="panel p-3.5 bg-critical/10 border-critical/30 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <span className="p-1 rounded bg-critical/15 text-critical shrink-0">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </span>
            <div className="sm:truncate">
              <span className="font-bold text-critical mr-2">[ALERTE CRITIQUE EN COURS]</span>
              <span className="text-text font-medium">{latestCritical.title}</span>
              <span className="text-text-muted ml-2">({latestCritical.country})</span>
            </div>
          </div>
          <button
            onClick={() => onSelectThreat(latestCritical)}
            className="text-xs text-accent hover:underline font-semibold shrink-0 self-end sm:self-auto cursor-pointer"
          >
            Examiner l'incident →
          </button>
        </div>
      )}

      {/* 1. Statistics KPIs */}
      <StatsBar threats={threats} />

      {/* 2. Primary Analytics Grid (Charts & Trends) */}
      <Charts threats={threats} currentTheme={theme} />

      {/* 3. Bottom Grid: Recent Incidents Feed + Quick Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Threat Feed */}
        <div className="panel h-[420px] overflow-hidden flex flex-col border border-border-subtle bg-panel">
          <ThreatList
            threats={threats.slice(0, 25)}
            selected={selectedThreat}
            onSelect={onSelectThreat}
            title="Derniers Incidents Détectés"
          />
        </div>

        {/* Threat Context & Quick Links */}
        <div className="flex flex-col gap-3 h-[420px]">
          <Link
            to="/map"
            className="panel p-4 border border-border-subtle hover:border-accent/50 transition-all bg-panel group flex-1 flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent">
                INTERACTIF
              </span>
            </div>
            <h3 className="text-sm font-bold text-text group-hover:text-accent transition-colors">
              Carte Mondiale des Menaces
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Explorez les cybermenaces sur la carte Leaflet avec filtres par pays, constructeur et criticité.
            </p>
          </Link>

          <Link
            to="/feed"
            className="panel p-4 border border-border-subtle hover:border-accent/50 transition-all bg-panel group flex-1 flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-2">
              <Radio className="w-6 h-6 text-amber group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/15 text-amber">
                LIVE STREAM
              </span>
            </div>
            <h3 className="text-sm font-bold text-text group-hover:text-amber transition-colors">
              Flux en Direct
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Suivez en temps réel les vulnérabilités ajoutées au catalogue officiel CISA KEV avec rafraîchissement automatique.
            </p>
          </Link>
        </div>
      </div>

    </div>
  );
}
