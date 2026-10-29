import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/cisa': {
        target: 'https://www.cisa.gov',
        changeOrigin: true,
        rewrite: () => '/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      },
    },
  },
})
