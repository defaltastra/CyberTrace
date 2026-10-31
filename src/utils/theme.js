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
  },
};

export function applyTheme(themeId) {
  const selectedTheme = THEMES_CONFIG[themeId] || THEMES_CONFIG['toxic-earth'];

  document.documentElement.setAttribute('data-theme', selectedTheme.id);

  // Keep the mobile status bar / browser chrome in sync with the active theme
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', selectedTheme.colors.bg);

  localStorage.setItem('cybertrace_theme', selectedTheme.id);
}

const THEME_COLOR_VARS = {
  critical: '--color-critical-rgb',
  amber: '--color-amber-rgb',
  accentDim: '--color-accent-dim-rgb',
  accent: '--color-accent-rgb',
};

export function themeColor(themeKey, alpha) {
  const varName = THEME_COLOR_VARS[themeKey];
  return alpha == null
    ? `rgb(var(${varName}))`
    : `rgba(var(${varName}), ${alpha})`;
}

export function resolveThemeColor(themeKey) {
  const varName = THEME_COLOR_VARS[themeKey];
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return rgb ? `rgb(${rgb})` : '';
}
