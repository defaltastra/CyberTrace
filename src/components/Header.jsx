import { Shield, Bell, RefreshCw, Radio, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({
  criticalCount,
  onRefresh,
  isRefreshing,
  catalogVersion,
  refreshCountdown,
  refreshInterval,
}) {
  return (
    <header className="app-header flex items-center justify-between px-4 sm:px-6 pb-3 border-b border-border-subtle bg-bg/90 backdrop-blur-md">
      {/* Brand */}
      <Link
        to="/"
        aria-label="CyberTrace — retour au tableau de bord"
        className="flex items-center gap-2.5 sm:gap-3 rounded-lg"
      >
        <div className="relative">
          <div className="p-1.5 sm:p-2 rounded-xl bg-panel border border-border-subtle shadow-md">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse-slow ring-4 ring-bg" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text leading-none">
              Cyber<span className="text-accent">Trace</span>
            </h1>
            <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25 font-bold">
              v2.0
            </span>
          </div>
          <p className="hidden sm:block text-[11px] text-text-muted font-mono mt-0.5">
            Centre Mondial de Renseignement Cybermenaces
          </p>
        </div>
      </Link>

      {/* Middle: Live feed status */}
      <div className="hidden md:flex items-center gap-2 text-xs text-text-muted font-mono bg-panel px-3 py-1.5 rounded-full border border-border-subtle">
        <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="text-text font-semibold">FLUX OFFICIEL :</span>
        <span className="text-accent">CISA KEV {catalogVersion}</span>
      </div>

      {/* Right Controls: Actualiser with Countdown + Critical Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-panel hover:bg-panel-light text-text-muted hover:text-accent border border-border-subtle text-xs font-mono transition-all cursor-pointer disabled:opacity-50 shadow-sm group"
          title="Rafraîchir manuellement les flux de menaces"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-accent ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
          <span className="hidden sm:inline font-semibold text-text group-hover:text-accent transition-colors">
            Actualiser
          </span>

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

        <div
          aria-label={`${criticalCount} alertes critiques`}
          className="flex items-center gap-1.5 bg-critical/10 border border-critical/30 rounded-lg px-2 sm:px-2.5 py-1.5"
        >
          <Bell className="w-3.5 h-3.5 text-critical animate-pulse" />
          <span className="text-xs font-mono font-bold text-critical">
            {criticalCount}<span className="hidden sm:inline"> Critiques</span>
          </span>
        </div>
      </div>
    </header>
  );
}
