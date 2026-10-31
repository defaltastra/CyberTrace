import {
  Settings as SettingsIcon,
  Palette,
  Check,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { THEMES_CONFIG } from '../utils/theme';

const SWATCH_KEYS = ['bg', 'panel', 'accent', 'amber', 'critical'];
const THEMES = Object.values(THEMES_CONFIG).map((t) => ({
  ...t,
  colors: SWATCH_KEYS.map((k) => ({ name: k, hex: t.colors[k] })),
}));

const REFRESH_RATES = [
  { value: 15, label: '15 secondes (Haute fréquence)' },
  { value: 30, label: '30 secondes (Recommandé)' },
  { value: 60, label: '60 secondes (Standard)' },
  { value: 120, label: '2 minutes (Économie)' },
  { value: 0, label: 'Désactivé (Manuel uniquement)' },
];

export default function SettingsView({
  theme,
  onThemeChange,
  refreshInterval,
  onRefreshIntervalChange,
  onResetSettings,
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      {/* Header */}
      <div className="panel p-6 border border-border-subtle bg-panel shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-panel-light text-accent border border-border-subtle">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Paramètres & Préférences</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Personnalisez le thème visuel, la fréquence de rafraîchissement des flux CTI et la télémétrie.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Theme Selection */}
      <div className="panel p-6 border border-border-subtle bg-panel space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Thème Visuel
            </h3>
          </div>
          <span className="text-xs font-mono text-accent">Thème actif : {theme}</span>
        </div>
        <p className="text-xs text-text-muted">
          Choisissez l'identité graphique de CyberTrace. Le thème s'applique instantanément à tous les panneaux, graphiques et tuiles de la carte.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {THEMES.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`panel p-4 text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-accent bg-panel-light shadow-lg scale-[1.02]'
                    : 'border border-border-subtle hover:border-accent/40 bg-panel hover:bg-panel-light/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-text">{t.name}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-accent text-bg flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mb-4">{t.subtitle}</p>
                </div>

                {/* Color swatches */}
                <div className="space-y-1.5 pt-2 border-t border-border-subtle/50">
                  <div className="flex items-center gap-1.5">
                    {t.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name}: ${c.hex}`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted/80">
                    {t.colors.map((c) => c.hex).join(' • ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Refresh Rate Selection */}
      <div className="panel p-6 border border-border-subtle bg-panel space-y-4 shadow-md">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber" />
          <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
            Fréquence de Rafraîchissement
          </h3>
        </div>
        <p className="text-xs text-text-muted">
          Réglez l'intervalle d'actualisation automatique du flux en direct et des alertes de menaces CISA KEV.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {REFRESH_RATES.map((rate) => {
            const isSelected = refreshInterval === rate.value;
            return (
              <button
                key={rate.value}
                onClick={() => onRefreshIntervalChange(rate.value)}
                className={`px-4 py-3 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-accent bg-accent/15 text-accent font-bold'
                    : 'border-border-subtle bg-panel-light text-text-muted hover:text-text hover:border-accent/30'
                }`}
              >
                <span>{rate.label}</span>
                {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Reset Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onResetSettings}
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-red-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurer les paramètres par défaut</span>
        </button>
      </div>
    </div>
  );
}
