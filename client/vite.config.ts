import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

/**
 * Only used in the Base44 sandbox: the preview is served through a proxy whose host is
 * `3000-<sandbox id>.<domain>`. The sandbox id rotates, so the allow-list extends with a
 * wildcard for the sandbox domain (never a single host) and only while preview mode is on.
 */
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : [],
    ...(previewMode ? { hmr: { protocol: 'wss', clientPort: 443 } } : {}),
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
