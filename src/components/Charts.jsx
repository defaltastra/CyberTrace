import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MONTHLY_TRENDS, THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';
import { THEMES_CONFIG } from '../utils/theme';
import { BarChart3, PieChart as PieIcon, TrendingUp, ShieldAlert, Layers } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-panel border border-border-subtle rounded-lg p-3 text-xs shadow-xl backdrop-blur-md">
        <p className="font-bold text-text mb-1 border-b border-border-subtle/50 pb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="flex items-center justify-between gap-3 py-0.5 font-mono">
            <span>{p.name}:</span>
            <strong className="text-text">{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Charts({ threats = [], currentTheme = 'toxic-earth' }) {
  const themeColors = THEMES_CONFIG[currentTheme]?.colors || THEMES_CONFIG['toxic-earth'].colors;

  // 1. Dynamic category count from loaded threats
  const categoryCounts = threats.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryCounts).map(([key, count]) => {
    const cat = THREAT_CATEGORIES[key] || { label: key, color: themeColors.accent };
    return {
      name: cat.label,
      value: count,
      color: cat.color,
    };
  }).filter((d) => d.value > 0);

  // 2. Top targeted vendors in real CISA KEV
  const vendorCounts = threats.reduce((acc, t) => {
    if (t.vendorProject) {
      acc[t.vendorProject] = (acc[t.vendorProject] || 0) + 1;
    }
    return acc;
  }, {});

  const topVendors = Object.entries(vendorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([vendor, count]) => ({ vendor, count }));

  // 3. Severity breakdown with theme-aware colors
  const severityCounts = {
    critical: threats.filter((t) => t.severity === 'critical').length,
    high: threats.filter((t) => t.severity === 'high').length,
    medium: threats.filter((t) => t.severity === 'medium').length,
    low: threats.filter((t) => t.severity === 'low').length,
  };

  const severityBarData = [
    { name: 'Critique', count: severityCounts.critical, fill: themeColors.critical },
    { name: 'Élevé', count: severityCounts.high, fill: themeColors.amber },
    { name: 'Moyen', count: severityCounts.medium, fill: themeColors.accentDim },
    { name: 'Faible', count: severityCounts.low, fill: themeColors.accent },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Area Chart: Volume Trend (12 Months) */}
        <div className="panel p-5 lg:col-span-2 border border-border-subtle bg-panel shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Évolution Historique des Attaques (12 Derniers Mois)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Tendance des volumes d'attaques observés</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel-light text-accent border border-border-subtle">
              TENDANCE GLOBALE
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPhishing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.amber} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={themeColors.amber} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradRansomware" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.critical} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={themeColors.critical} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradMalware" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.accent} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={themeColors.accent} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="month" stroke={themeColors.textMuted} tick={{ fontSize: 10, fill: themeColors.textMuted }} />
              <YAxis stroke={themeColors.textMuted} tick={{ fontSize: 10, fill: themeColors.textMuted }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
              <Area type="monotone" dataKey="phishing" name="Phishing" stroke={themeColors.amber} fill="url(#gradPhishing)" strokeWidth={2} />
              <Area type="monotone" dataKey="ransomware" name="Ransomware" stroke={themeColors.critical} fill="url(#gradRansomware)" strokeWidth={2} />
              <Area type="monotone" dataKey="malware" name="Malware" stroke={themeColors.accent} fill="url(#gradMalware)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Donut / Pie Chart: Category Distribution */}
        <div className="panel p-5 border border-border-subtle bg-panel shadow-md">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-accent" />
              Répartition par Catégorie
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Calculé sur les menaces actives chargées</p>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={themeColors.panel} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 10, paddingTop: '8px' }}
                formatter={(val) => <span style={{ color: themeColors.text }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 3. Bar Chart: Severity Breakdown */}
        <div className="panel p-5 border border-border-subtle bg-panel shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber" />
              Distribution par Niveau de Gravité
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Nombre d'incidents selon la sévérité</p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityBarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="name" stroke={themeColors.textMuted} tick={{ fontSize: 11, fill: themeColors.text }} />
              <YAxis stroke={themeColors.textMuted} tick={{ fontSize: 10, fill: themeColors.textMuted }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Menaces" radius={[4, 4, 0, 0]}>
                {severityBarData.map((entry, index) => (
                  <Cell key={`sev-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Top Targeted Vendors in CISA KEV */}
        <div className="panel p-5 border border-border-subtle bg-panel shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              Top Éditeurs les Plus Ciblé(e)s (CISA KEV)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Failles activement exploitées en production</p>
          </div>

          {topVendors.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topVendors} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="vendor" stroke={themeColors.textMuted} tick={{ fontSize: 10, fill: themeColors.text }} />
                <YAxis stroke={themeColors.textMuted} tick={{ fontSize: 10, fill: themeColors.textMuted }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Vulnérabilités KEV" fill={themeColors.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-xs text-text-muted">
              Données éditeurs indisponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
