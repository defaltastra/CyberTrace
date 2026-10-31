/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--color-bg-rgb'),
        panel: withOpacity('--color-panel-rgb'),
        'panel-light': withOpacity('--color-panel-light-rgb'),
        accent: withOpacity('--color-accent-rgb'),
        amber: withOpacity('--color-amber-rgb'),
        critical: withOpacity('--color-critical-rgb'),
        text: withOpacity('--color-text-rgb'),
        'text-muted': withOpacity('--color-text-muted-rgb'),
        'border-subtle': withOpacity('--color-border-subtle-rgb'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
