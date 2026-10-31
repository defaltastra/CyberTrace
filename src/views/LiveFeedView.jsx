import { useState } from 'react';
import { Radio, RefreshCw, Clock, MapPin } from 'lucide-react';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';
import { themeColor } from '../utils/theme';
import { formatTime } from '../utils/format';

export default function LiveFeedView({
  threats = [],
  onRefresh,
  isRefreshing = false,
  onSelectThreat,
}) {
  const [filterSource, setFilterSource] = useState('all');

  const filteredFeed = threats.filter((t) => {
    if (filterSource === 'real') return t.isReal;
    if (filterSource === 'demo') return !t.isReal;
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 panel p-4 border border-border-subtle bg-panel">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-accent animate-pulse" />
            <h2 className="text-lg font-bold text-text">Flux Cyber en Direct (Live Threat Stream)</h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Flux de renseignement continuellement synchronisé avec le catalogue officiel CISA KEV et le réseau de télémétrie.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-bg hover:bg-accent/90 text-xs font-semibold font-mono transition-all disabled:opacity-50 cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Feed Filters strip */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted font-mono text-[11px] mr-1">Filtrer par source :</span>
          {[
            { value: 'all', label: 'Toutes', count: threats.length, accent: true },
            { value: 'real', label: '🟢 CISA KEV', count: threats.filter((t) => t.isReal).length, accent: true },
            { value: 'demo', label: '🟡 Télémétrie', count: threats.filter((t) => !t.isReal).length, accent: false },
          ].map(({ value, label, count, accent }) => (
            <button
              key={value}
              onClick={() => setFilterSource(value)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                filterSource === value
                  ? accent
                    ? 'bg-panel text-accent border border-accent/40 font-bold'
                    : 'bg-panel text-amber border border-amber/40 font-bold'
                  : 'bg-panel-light text-text-muted hover:text-text border border-border-subtle'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Surveillance active</span>
        </div>
      </div>

      {/* Stream List */}
      <div className="space-y-2.5">
        {filteredFeed.map((threat, index) => {
          const cat = THREAT_CATEGORIES[threat.type] || { label: threat.type, color: '#48D597' };
          const sev = SEVERITY_LEVELS[threat.severity] || { label: threat.severity, themeKey: 'amber' };

          return (
            <div
              key={threat.id}
              onClick={() => onSelectThreat(threat)}
              className="panel p-4 border border-border-subtle hover:border-accent/40 transition-all duration-150 cursor-pointer bg-panel shadow-md group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {index < 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono font-bold animate-pulse">
                      NOUVEAU
                    </span>
                  )}

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{ backgroundColor: themeColor(sev.themeKey, 0.15), color: themeColor(sev.themeKey) }}
                  >
                    {sev.label}
                  </span>

                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.label}
                  </span>

                  <span className="text-xs font-mono font-bold text-accent">{threat.id}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span>{threat.country}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber" />
                    <span>{formatTime(threat.timestamp)}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors mb-1.5">
                {threat.title}
              </h3>

              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
                {threat.description}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border-subtle/50 text-text-muted">
                <div className="font-mono text-text-muted/80 flex items-center gap-1">
                  <span>Source :</span>
                  <span className="text-accent font-semibold">{threat.dataSource}</span>
                </div>

                <span className="text-accent group-hover:underline font-semibold flex items-center gap-1">
                  Examiner la fiche complète →
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
