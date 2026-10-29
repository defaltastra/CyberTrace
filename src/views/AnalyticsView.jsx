import Charts from '../components/Charts';
import { BarChart3, TrendingUp, ShieldAlert, Globe, Server, CheckCircle2 } from 'lucide-react';

export default function AnalyticsView({ threats = [] }) {
  const critical = threats.filter((t) => t.severity === 'critical').length;
  const high = threats.filter((t) => t.severity === 'high').length;
  const realCount = threats.filter((t) => t.isReal).length;
  const countries = [...new Set(threats.map((t) => t.country).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Analyses & Tendances Cyber</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Indicateurs statistiques de répartition des menaces, analyse temporelle et cibles d'exploitation active.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-panel border border-border-subtle text-accent">
            Échantillon : <strong>{threats.length}</strong> incidents
          </span>
        </div>
      </div>

      {/* Analytics KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="panel p-4 border border-border-subtle bg-panel">
          <div className="text-xs text-text-muted font-mono mb-1">RATIO CRITICITÉ</div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {threats.length > 0 ? Math.round(((critical + high) / threats.length) * 100) : 0}%
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Menaces d'impact Critique ou Élevé</div>
        </div>

        <div className="panel p-4 border border-border-subtle bg-panel">
          <div className="text-xs text-text-muted font-mono mb-1">EXPLOITS OFFICIELS</div>
          <div className="text-2xl font-bold font-mono text-accent">{realCount}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Failles CISA KEV en exploitation</div>
        </div>

        <div className="panel p-4 border border-border-subtle bg-panel">
          <div className="text-xs text-text-muted font-mono mb-1">COUVERTURE RÉGIONALE</div>
          <div className="text-2xl font-bold font-mono text-amber">{countries.length}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Pays & territoires répertoriés</div>
        </div>

        <div className="panel p-4 border border-border-subtle bg-panel">
          <div className="text-xs text-text-muted font-mono mb-1">CYCLE DE VIE CTI</div>
          <div className="text-2xl font-bold font-mono text-text">T4 2026</div>
          <div className="text-[11px] text-text-muted mt-0.5">Période de veille opérationnelle</div>
        </div>
      </div>

      {/* Main Charts Component */}
      <Charts threats={threats} />

      {/* Analytical Methodology Card */}
      <div className="panel p-5 border border-border-subtle bg-panel">
        <h4 className="text-sm font-bold text-text mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <span>Méthodologie d'Analyse des Menaces</span>
        </h4>
        <p className="text-xs text-text-muted leading-relaxed mb-3">
          Les statistiques présentées combinent les entrées du catalogue officiel américain <strong>CISA KEV</strong> (failles
          pour lesquelles une exploitation active est confirmée sur le terrain) avec un flux de télémétrie multi-vectorielle
          couvrant les attaques DDoS, les campagnes de phishing par ransomware et les réseaux de botnets.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-text-muted font-mono">
          <div className="flex items-center gap-1.5 bg-panel-light p-2 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Pondération CVSS v3.1 / KEV</span>
          </div>
          <div className="flex items-center gap-1.5 bg-panel-light p-2 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Normalisation des Catégories CTI</span>
          </div>
          <div className="flex items-center gap-1.5 bg-panel-light p-2 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Actualisation Continue des Flux</span>
          </div>
        </div>
      </div>
    </div>
  );
}
