// Theme configuration & dynamic style application

export const THEMES_CONFIG = {
  'toxic-earth': {
    id: 'toxic-earth',
    name: 'Toxic Earth (Original)',
    subtitle: 'Centre de surveillance SOC & nature sombre',
    colors: {
      bg: '#0A1512',
      panel: '#19352B',
      panelLight: '#1F3F34',
      accent: '#48D597',
      accentDim: '#2A7A58',
      amber: '#D99B53',
      critical: '#E05C5C',
      text: '#E7E5D9',
      textMuted: '#9B9A8F',
      borderSubtle: '#2A3F36',
    },
    rgb: {
      bg: '10, 21, 18',
      panel: '25, 53, 43',
      panelLight: '31, 63, 52',
      accent: '72, 213, 151',
      accentDim: '42, 122, 88',
      amber: '217, 155, 83',
      critical: '224, 92, 92',
      text: '231, 229, 217',
      textMuted: '155, 154, 143',
      borderSubtle: '42, 63, 54',
    },
  },
  'void': {
    id: 'void',
    name: 'Void',
    subtitle: 'Néon violet cosmique & cyan tranchant',
    colors: {
      bg: '#100D1C',
      panel: '#251C38',
      panelLight: '#32254C',
      accent: '#B49AFF',
      accentDim: '#8465D4',
      amber: '#70F0D0',
      critical: '#FF6B8A',
      text: '#EDE9FE',
      textMuted: '#A79BBF',
      borderSubtle: '#3D2D5E',
    },
    rgb: {
      bg: '16, 13, 28',
      panel: '37, 28, 56',
      panelLight: '50, 37, 76',
      accent: '180, 154, 255',
      accentDim: '132, 101, 212',
      amber: '112, 240, 208',
      critical: '255, 107, 138',
      text: '237, 233, 254',
      textMuted: '167, 155, 191',
      borderSubtle: '61, 45, 94',
    },
  },
  'gruvbox': {
    id: 'gruvbox',
    name: 'Gruvbox Cyber',
    subtitle: 'Esthétique hacker rétro chaleureuse',
    colors: {
      bg: '#1d2021',
      panel: '#282828',
      panelLight: '#3c3836',
      accent: '#b8bb26',
      accentDim: '#79740e',
      amber: '#fabd2f',
      critical: '#fb4934',
      text: '#ebdbb2',
      textMuted: '#a89984',
      borderSubtle: '#504945',
    },
    rgb: {
      bg: '29, 32, 33',
      panel: '40, 40, 40',
      panelLight: '60, 56, 54',
      accent: '184, 187, 38',
      accentDim: '121, 116, 14',
      amber: '250, 189, 47',
      critical: '251, 73, 52',
      text: '235, 219, 178',
      textMuted: '168, 153, 132',
      borderSubtle: '80, 73, 69',
    },
  },
};

export function applyTheme(themeId) {
  const selectedTheme = THEMES_CONFIG[themeId] || THEMES_CONFIG['toxic-earth'];

  document.documentElement.setAttribute('data-theme', selectedTheme.id);
  document.body.setAttribute('data-theme', selectedTheme.id);

  const root = document.documentElement;
  // Apply comma-separated RGB variables for Tailwind opacity function
  root.style.setProperty('--color-bg-rgb', selectedTheme.rgb.bg);
  root.style.setProperty('--color-panel-rgb', selectedTheme.rgb.panel);
  root.style.setProperty('--color-panel-light-rgb', selectedTheme.rgb.panelLight);
  root.style.setProperty('--color-accent-rgb', selectedTheme.rgb.accent);
  root.style.setProperty('--color-accent-dim-rgb', selectedTheme.rgb.accentDim);
  root.style.setProperty('--color-amber-rgb', selectedTheme.rgb.amber);
  root.style.setProperty('--color-critical-rgb', selectedTheme.rgb.critical);
  root.style.setProperty('--color-text-rgb', selectedTheme.rgb.text);
  root.style.setProperty('--color-text-muted-rgb', selectedTheme.rgb.textMuted);
  root.style.setProperty('--color-border-subtle-rgb', selectedTheme.rgb.borderSubtle);

  // Directly set body background and color inline as well for immediate 100% guarantee
  document.body.style.backgroundColor = selectedTheme.colors.bg;
  document.body.style.color = selectedTheme.colors.text;

  localStorage.setItem('cybertrace_theme', selectedTheme.id);
  return selectedTheme;
}
