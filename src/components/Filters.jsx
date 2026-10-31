import { Search, X, SlidersHorizontal } from 'lucide-react';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';

export const DEFAULT_FILTERS = {
  search: '',
  type: '',
  severity: '',
  source: '',
  country: '',
};

export default function Filters({ filters, onFiltersChange }) {
  const categories = [
    { value: '', label: 'Toutes les catégories' },
    ...Object.entries(THREAT_CATEGORIES).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  const severities = [
    { value: '', label: 'Toutes les gravités' },
    ...Object.entries(SEVERITY_LEVELS).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  const sources = [
    { value: '', label: 'Toutes les sources' },
    { value: 'real', label: '🟢 CISA KEV (En direct)' },
    { value: 'demo', label: '🟡 Télémétrie Simulée' },
  ];

  const hasActive = filters.search || filters.type || filters.severity || filters.source || filters.country;

  const clear = () => {
    onFiltersChange({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="panel p-3.5 sm:p-4 border border-border-subtle bg-panel shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text">
          <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
          <span>Filtres de Renseignement</span>
        </div>

        {hasActive && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent font-medium transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher CVE, mot-clé, cible..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="input w-full pl-9 text-xs h-9"
          />
        </div>

        {/* Category / Severity / Source Selects */}
        {[
          { key: 'type', options: categories },
          { key: 'severity', options: severities },
          { key: 'source', options: sources },
        ].map(({ key, options }) => (
          <div key={key}>
            <select
              value={filters[key]}
              onChange={(e) => onFiltersChange({ ...filters, [key]: e.target.value })}
              className="select w-full text-xs h-9"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value} className="bg-panel text-text">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
