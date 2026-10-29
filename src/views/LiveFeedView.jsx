import { useState, useEffect } from 'react';
import ThreatDetail from '../components/ThreatDetail';
import { Radio, RefreshCw, Clock, MapPin, ShieldAlert, Sparkles, AlertCircle, Wifi, Play, Pause } from 'lucide-react';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';

export default function LiveFeedView({
  threats = [],
  onRefresh,
  isRefreshing = false,
  catalogVersion,
  selectedThreat,
  onSelectThreat,
}) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [filterSource, setFilterSource] = useState('all');

  // Countdown timer for auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (onRefresh) onRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

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

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              autoRefresh
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'bg-panel-light text-text-muted border border-border-subtle hover:text-text'
            }`}
          >
            {autoRefresh ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRefresh ? `Auto (${timerSeconds}s)` : 'En pause'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => {
              if (onRefresh) onRefresh();
              setTimerSeconds(30);
            }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-bg hover:bg-accent/90 text-xs font-semibold font-mono transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Feed Filters strip */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted font-mono text-[11px] mr-1">Filtrer par source :</span>
          <button
            onClick={() => setFilterSource('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterSource === 'all'
                ? 'bg-panel text-accent border border-accent/40 font-bold'
                : 'bg-panel-light text-text-muted hover:text-text border border-border-subtle'
            }`}
          >
            Toutes ({threats.length})
          </button>
          <button
            onClick={() => setFilterSource('real')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterSource === 'real'
                ? 'bg-panel text-accent border border-accent/40 font-bold'
                : 'bg-panel-light text-text-muted hover:text-text border border-border-subtle'
            }`}
          >
            🟢 CISA KEV ({threats.filter((t) => t.isReal).length})
          </button>
          <button
            onClick={() => setFilterSource('demo')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterSource === 'demo'
                ? 'bg-panel text-amber border border-amber/40 font-bold'
                : 'bg-panel-light text-text-muted hover:text-text border border-border-subtle'
            }`}
          >
            🟡 Télémétrie ({threats.filter((t) => !t.isReal).length})
          </button>
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
          const sev = SEVERITY_LEVELS[threat.severity] || { label: threat.severity, color: '#D99B53' };

          return (
            <div
              key={threat.id}
              onClick={() => onSelectThreat(threat)}
              className="panel p-4 border border-border-subtle hover:border-accent/40 transition-all duration-150 cursor-pointer bg-panel shadow-md group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Real-time ping dot for top items */}
                  {index < 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono font-bold animate-pulse">
                      NOUVEAU
                    </span>
                  )}

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{ backgroundColor: sev.bg || 'rgba(217,155,83,0.15)', color: sev.color }}
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
                    <span>
                      {new Date(threat.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
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
