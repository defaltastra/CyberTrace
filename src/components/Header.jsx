import { Shield, Activity, Bell, RefreshCw, Radio, Clock } from 'lucide-react';

export default function Header({
  criticalCount = 0,
  onRefresh,
  isRefreshing = false,
  catalogVersion = '2026.10',
  refreshCountdown = 30,
  refreshInterval = 30,
}) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border-subtle bg-bg/90 backdrop-blur-md sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="p-2 rounded-xl bg-panel border border-border-subtle shadow-md">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse-slow ring-4 ring-bg" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text leading-none">
              Cyber<span className="text-accent">Trace</span>
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25 font-bold">
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-text-muted font-mono mt-0.5">
            Centre Mondial de Renseignement Cybermenaces
          </p>
        </div>
      </div>

      {/* Middle: Live feed status */}
      <div className="hidden md:flex items-center gap-2 text-xs text-text-muted font-mono bg-panel px-3 py-1.5 rounded-full border border-border-subtle">
        <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="text-text font-semibold">FLUX OFFICIEL :</span>
        <span className="text-accent">CISA KEV {catalogVersion}</span>
      </div>

      {/* Right Controls: Actualiser with Countdown + Critical Badge */}
      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel hover:bg-panel-light text-text-muted hover:text-accent border border-border-subtle text-xs font-mono transition-all cursor-pointer disabled:opacity-50 shadow-sm group"
            title="Rafraîchir manuellement les flux de menaces"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-accent ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            <span className="font-semibold text-text group-hover:text-accent transition-colors">
              Actualiser
            </span>

            {/* Countdown Badge */}
            {refreshInterval > 0 ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/15 text-accent text-[11px] font-mono font-bold border border-accent/25">
                <Clock className="w-2.5 h-2.5 opacity-70" />
                <span>{isRefreshing ? '...' : `${refreshCountdown}s`}</span>
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-panel-light text-text-muted text-[10px] font-mono">
                Manuel
              </span>
            )}
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-800/40 rounded-lg px-2.5 py-1.5">
          <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-red-400">
            {criticalCount} Critiques
          </span>
        </div>
      </div>
    </header>
  );
}
