import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  Clock,
  AlertTriangle,
  Tag,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Hash,
  ArrowUpRight,
} from 'lucide-react';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';

function formatDate(ts) {
  if (!ts) return 'N/A';
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ThreatDetail({ threat, onClose, isModal = false }) {
  // Close modal on Escape key
  useEffect(() => {
    if (!isModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  if (!threat) return null;

  const cat = THREAT_CATEGORIES[threat.type] || { label: threat.type, color: '#48D597' };
  const sev = SEVERITY_LEVELS[threat.severity] || {
    label: threat.severity,
    color: '#D99B53',
    bg: 'rgba(217,155,83,0.15)',
  };

  const isCve = threat.id?.startsWith('CVE-');
  const nvdUrl = isCve ? `https://nvd.nist.gov/vuln/detail/${threat.id}` : null;
  const cisaUrl = threat.isReal ? 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' : null;

  const content = (
    <div className="panel h-full overflow-y-auto flex flex-col border border-border-subtle bg-panel shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle flex items-start justify-between gap-3 shrink-0 bg-panel-light/40 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
              style={{ backgroundColor: sev.bg, color: sev.color }}
            >
              {sev.label}
            </span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
            >
              {cat.label}
            </span>
            {threat.isReal ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono font-semibold">
                ● CISA EN DIRECT
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber/15 text-amber border border-amber/30 font-mono font-semibold">
                ▲ DONNÉE SIMULÉE
              </span>
            )}
            <span className="text-xs font-mono text-text-muted ml-auto">{threat.id}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-text leading-snug">{threat.title}</h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-panel-light hover:bg-accent/20 text-text-muted hover:text-text transition-colors shrink-0 cursor-pointer"
            title="Fermer la fiche détaillée (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-5 flex-1">
        {/* Description */}
        <div>
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-accent" />
            Résumé de l'incident
          </h3>
          <p className="text-sm text-text leading-relaxed bg-bg/60 p-3.5 rounded-lg border border-border-subtle">
            {threat.description}
          </p>
        </div>

        {/* Location & Time Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="panel-light p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Emplacement Observé
            </div>
            <p className="text-sm font-semibold text-text">{threat.country}</p>
            <p className="text-[11px] font-mono text-text-muted">
              {threat.lat?.toFixed(2)}°, {threat.lng?.toFixed(2)}°
            </p>
          </div>

          <div className="panel-light p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
              <Clock className="w-3.5 h-3.5 text-amber" /> Date de Détection
            </div>
            <p className="text-xs sm:text-sm font-semibold text-text">{formatDate(threat.timestamp)}</p>
            <p className="text-[11px] font-mono text-text-muted">Horodatage vérifié</p>
          </div>
        </div>

        {/* CISA Remediation & Due Date */}
        {(threat.requiredAction || threat.dueDate) && (
          <div className="panel-light p-3.5 border border-red-500/30 bg-red-950/20">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-red-300">Action Corrective Mandatée (CISA)</div>
                {threat.requiredAction && (
                  <p className="text-xs text-text-muted leading-relaxed">{threat.requiredAction}</p>
                )}
                {threat.dueDate && (
                  <div className="text-[11px] font-mono text-amber flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Échéance d'application : {threat.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Affected Systems */}
        {threat.affected && (
          <div className="panel-light p-3.5 border border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber" /> Systèmes / Logiciels Ciblés
            </div>
            <p className="text-xs sm:text-sm font-semibold text-text">{threat.affected}</p>
          </div>
        )}

        {/* Indicators of Compromise (IOCs) */}
        {threat.iocs && threat.iocs.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-accent" />
              Indicateurs de Compromission (IOCs)
            </h3>
            <div className="flex flex-wrap gap-2">
              {threat.iocs.map((ioc, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs px-2.5 py-1 bg-bg border border-border-subtle rounded-md text-accent flex items-center gap-1 select-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  {ioc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {threat.tags && threat.tags.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-text-muted" />
              Mots-clés & Catégorisation
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {threat.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-panel-light text-text-muted border border-border-subtle"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source info & External links */}
        <div className="panel-light p-3.5 border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-text">Source du Renseignement</div>
            <span className="text-[10px] font-mono text-accent">{threat.dataSource}</span>
          </div>
          <p className="text-xs text-text-muted">{threat.source}</p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle/50">
            {nvdUrl && (
              <a
                href={nvdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg text-accent hover:bg-accent/10 border border-border-subtle text-xs font-mono font-medium transition-colors"
              >
                <span>Fiche NIST NVD</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
            {cisaUrl && (
              <a
                href={cisaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg text-text-muted hover:text-text hover:bg-panel-light border border-border-subtle text-xs font-mono transition-colors"
              >
                <span>Catalogue CISA KEV</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // When rendered as a modal, render via createPortal into document.body with max z-index
  if (isModal) {
    return createPortal(
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] h-[700px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border-subtle"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>,
      document.body
    );
  }

  return content;
}
