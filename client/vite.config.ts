import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function allowedHosts(): string[] {
  const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;
  if (process.env.BASE44_PREVIEW_MODE === '1' && sandboxDomain) {
    return [`.${sandboxDomain}`, 'localhost', '127.0.0.1'];
  }
  return ['localhost', '127.0.0.1'];
}

// The Vite dev server proxies /api to the API container so cookies stay same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // In the Base44 sandbox the preview is served through a rotating proxy host, so the
    // sandbox wildcard is allowed only when BASE44_PREVIEW_MODE=1. Any other value keeps
    // the default localhost-only behaviour.
    allowedHosts: allowedHosts(),
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://api:4000',
        changeOrigin: false,
      },
    },
    watch: { usePolling: true, interval: 300 },
  },
});
