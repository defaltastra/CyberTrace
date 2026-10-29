import { useState, useMemo } from 'react';
import Filters from '../components/Filters';
import ThreatDetail from '../components/ThreatDetail';
import { exportToCSV, exportToJSON } from '../services/threatService';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ExternalLink,
  MapPin,
  Calendar,
  ShieldAlert,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

export default function ThreatExplorerView({
  threats = [],
  filteredThreats = [],
  filters,
  onFiltersChange,
  selectedThreat,
  onSelectThreat,
}) {
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sorting logic
  const sortedThreats = useMemo(() => {
    return [...filteredThreats].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'timestamp') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortField === 'severity') {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        valA = order[valA] || 0;
        valB = order[valB] || 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredThreats, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedThreats.length / itemsPerPage) || 1;
  const paginatedThreats = sortedThreats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Search className="w-5 h-5 text-accent" />
            <span>Explorateur de Cybermenaces</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Moteur de recherche multicritère et tableau analytique des vulnérabilités et indicateurs répertoriés.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => exportToCSV(sortedThreats)}
            className="btn bg-panel-light hover:bg-panel text-xs text-text border border-border-subtle flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-mono transition-colors cursor-pointer"
            title="Exporter les résultats filtrés au format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToJSON(sortedThreats)}
            className="btn bg-panel-light hover:bg-panel text-xs text-text border border-border-subtle flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-mono transition-colors cursor-pointer"
            title="Exporter les données au format JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-amber" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <Filters filters={filters} onFiltersChange={onFiltersChange} />

      {/* Results Table */}
      <div className="panel border border-border-subtle overflow-hidden bg-panel shadow-xl">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-panel-light/30 text-xs">
          <div className="font-mono text-text-muted">
            Affichage de <strong className="text-accent">{paginatedThreats.length}</strong> sur{' '}
            <strong className="text-text">{sortedThreats.length}</strong> menaces filtrées
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span>Page {currentPage} / {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 rounded bg-panel-light border border-border-subtle disabled:opacity-40 hover:text-accent cursor-pointer"
              >
                Précédent
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-0.5 rounded bg-panel-light border border-border-subtle disabled:opacity-40 hover:text-accent cursor-pointer"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg/40 font-mono text-text-muted">
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Identifiant / CVE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('type')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Catégorie</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('severity')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Gravité</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('title')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Désignation / Cible</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('country')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Localisation</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('timestamp')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-accent"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {paginatedThreats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    Aucune menace ne correspond aux filtres actifs.
                  </td>
                </tr>
              ) : (
                paginatedThreats.map((threat) => {
                  const cat = THREAT_CATEGORIES[threat.type] || { label: threat.type, color: '#48D597' };
                  const sev = SEVERITY_LEVELS[threat.severity] || { label: threat.severity, color: '#D99B53' };

                  return (
                    <tr
                      key={threat.id}
                      onClick={() => onSelectThreat(threat)}
                      className="hover:bg-panel-light/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-accent whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{threat.id}</span>
                          {threat.isReal && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-accent/20 text-accent">
                              LIVE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          {cat.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: sev.bg || 'rgba(217,155,83,0.15)', color: sev.color }}
                        >
                          {sev.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-semibold text-text truncate group-hover:text-accent transition-colors">
                          {threat.title}
                        </div>
                        <div className="text-[11px] text-text-muted truncate mt-0.5">
                          {threat.description}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-text-muted">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-accent" />
                          <span>{threat.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {new Date(threat.timestamp).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectThreat(threat);
                          }}
                          className="px-2.5 py-1 rounded bg-panel-light hover:bg-accent hover:text-bg text-text-muted text-[11px] font-semibold transition-colors"
                        >
                          Détails →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
