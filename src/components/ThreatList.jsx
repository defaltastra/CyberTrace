import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';
import { themeColor } from '../utils/theme';
import { Clock, MapPin, ChevronRight, ShieldAlert, Filter } from 'lucide-react';

function timeAgo(ts) {
  if (!ts) return '';
  const now = Date.now();
  const past = new Date(ts).getTime();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return "À l'instant";
  if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
  const diffDays = Math.floor(diffSec / 86400);
  if (diffDays === 1) return 'Hier';
  if (diffDays < 30) return `Il y a ${diffDays} j`;
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function ThreatList({ threats = [], selected, onSelect, title = "Flux des Menaces Récentes" }) {
  return (
    <div className="panel flex flex-col h-full overflow-hidden border border-border-subtle bg-panel shadow-xl">
      {/* List Header */}
      <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between shrink-0 bg-panel-light/30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-text">{title}</h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-accent font-semibold">{threats.length}</span>
          <span className="text-text-muted">éléments</span>
        </div>
      </div>

      {/* Items Container */}
      <div className="overflow-y-auto flex-1 divide-y divide-border-subtle/70">
        {threats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-text-muted">
            <Filter className="w-8 h-8 text-text-muted/40 mb-2" />
            <p className="text-sm font-medium">Aucune menace ne correspond à vos filtres</p>
            <p className="text-xs text-text-muted/70 mt-1">Modifiez vos critères de recherche pour réinitialiser la vue.</p>
          </div>
        ) : (
          threats.map((threat) => {
            const cat = THREAT_CATEGORIES[threat.type] || { label: threat.type, color: '#48D597' };
            const sev = SEVERITY_LEVELS[threat.severity] || { label: threat.severity, themeKey: 'amber' };
            const isSelected = selected?.id === threat.id;

            return (
              <button
                key={threat.id}
                onClick={() => onSelect(threat)}
                className={`w-full text-left px-4 py-3 transition-all duration-150 group relative cursor-pointer ${
                  isSelected
                    ? 'bg-panel-light border-l-4 border-accent pl-3'
                    : 'hover:bg-panel-light/70 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: themeColor(sev.themeKey) }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                        style={{ backgroundColor: themeColor(sev.themeKey, 0.15), color: themeColor(sev.themeKey) }}
                      >
                        {sev.label}
                      </span>
                      <span className="text-[11px] text-text-muted">{cat.label}</span>

                      {threat.isReal ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-mono ml-auto font-medium">
                          CISA
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber/15 text-amber font-mono ml-auto font-medium">
                          SIMULÉ
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-semibold text-text leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                      {threat.title}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                      <span className="flex items-center gap-1 truncate max-w-[130px]">
                        <MapPin className="w-3 h-3 text-accent/80 shrink-0" />
                        <span className="truncate">{threat.country}</span>
                      </span>

                      <span className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-amber/80" />
                        <span>{timeAgo(threat.timestamp)}</span>
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-150 self-center ${
                      isSelected ? 'text-accent translate-x-0.5' : 'text-text-muted/40 group-hover:text-accent'
                    }`}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
