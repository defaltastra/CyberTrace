import { useMemo } from 'react';
import ThreatMap from '../components/ThreatMap';
import Filters from '../components/Filters';
import { Globe, MapPin, Compass } from 'lucide-react';

export default function GlobalMapView({
  threats = [],
  filteredThreats = [],
  filters,
  onFiltersChange,
  selectedThreat,
  onSelectThreat,
}) {
  // Extract unique countries with their threat counts
  const countryDistribution = useMemo(() => {
    const counts = {};
    threats.forEach((t) => {
      if (t.country) {
        counts[t.country] = (counts[t.country] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [threats]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            <span>Carte Mondiale des Cybermenaces</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Cartographie plein écran interactive. Cliquez sur un marqueur pour afficher l'aperçu, puis sur « Inspecter l'incident » pour la fiche complète.
          </p>
        </div>

        {/* Quick Country Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-mono text-text-muted mr-1 shrink-0">Top Régions :</span>
          {countryDistribution.map(([country, count]) => (
            <button
              key={country}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  country: filters.country === country ? '' : country,
                  search: filters.country === country ? '' : country,
                })
              }
              className={`text-xs px-2.5 py-1 rounded-full font-mono transition-colors whitespace-nowrap cursor-pointer ${
                filters.search === country
                  ? 'bg-accent text-bg font-bold'
                  : 'bg-panel-light text-text-muted hover:text-text border border-border-subtle'
              }`}
            >
              {country} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <Filters filters={filters} onFiltersChange={onFiltersChange} />

      {/* Dedicated Full-Width Map */}
      <div
        className="w-full rounded-xl overflow-hidden shadow-2xl border border-border-subtle"
        style={{ height: 'clamp(600px, 76vh, 900px)' }}
      >
        <ThreatMap
          threats={filteredThreats}
          onInspect={onSelectThreat}
          selected={selectedThreat}
          height="100%"
        />
      </div>

      {/* Bottom Summary Bar */}
      <div className="panel p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs border border-border-subtle bg-panel">
        <div className="flex items-center gap-4 text-text-muted font-mono">
          <span>Menaces visibles : <strong className="text-accent">{filteredThreats.length}</strong></span>
          <span>Critiques : <strong className="text-red-400">{filteredThreats.filter((t) => t.severity === 'critical').length}</strong></span>
          <span>Pays actifs : <strong className="text-amber">{[...new Set(filteredThreats.map((t) => t.country).filter(Boolean))].length}</strong></span>
        </div>

        <div className="text-[11px] text-text-muted">
          💡 Astuce : Cliquez sur un marqueur pour ouvrir la bulle d'info, puis sur <strong>« Inspecter l'incident »</strong> pour ouvrir la fiche détaillée.
        </div>
      </div>
    </div>
  );
}
