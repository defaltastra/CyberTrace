import { AlertTriangle, Globe, Database, Zap } from 'lucide-react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'text-accent',
  sub,
  badge,
  badgeColor = 'bg-accent/15 text-accent border-accent/25',
}) => (
  <div className="panel p-4 flex items-center gap-3.5 border border-border-subtle hover:border-accent/30 transition-colors bg-panel shadow-md">
    <div className="p-2.5 rounded-lg bg-panel-light shrink-0">
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold font-mono tracking-tight ${color}`}>{value}</span>
        {badge && (
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-xs font-semibold text-text truncate mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-text-muted/70 truncate">{sub}</div>}
    </div>
  </div>
);

export default function StatsBar({ threats = [] }) {
  const total = threats.length;
  const critical = threats.filter((t) => t.severity === 'critical').length;
  const realCount = threats.filter((t) => t.isReal).length;
  const countriesCount = [...new Set(threats.map((t) => t.country).filter(Boolean))].length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Zap}
        label="Incidents Répertoriés"
        value={total}
        color="text-accent"
        sub="Flux CISA KEV & Télémétrie"
      />
      <StatCard
        icon={AlertTriangle}
        label="Gravité Critique"
        value={critical}
        color="text-critical"
        sub="Failles activement exploitées"
        badge="ALERTE"
        badgeColor="bg-critical/15 text-critical border-critical/25"
      />
      <StatCard
        icon={Database}
        label="CVEs CISA en Direct"
        value={realCount}
        color="text-accent"
        sub="Données officielles US Gov"
        badge="OFFICIEL"
      />
      <StatCard
        icon={Globe}
        label="Territoires Observés"
        value={countriesCount}
        color="text-amber"
        sub="Juridictions et cibles"
      />
    </div>
  );
}
