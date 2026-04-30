import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// URL the *host browser* uses to reach Vite inside Docker (compose maps 5173:5173).
// Override in .env with VITE_DEV_SERVER_ORIGIN if needed (e.g. http://localhost:5173).
const devServerOriginEnv = process.env.VITE_DEV_SERVER_ORIGIN ?? 'http://127.0.0.1:5173';
const devServerUrl = new URL(devServerOriginEnv);
const devPort = devServerUrl.port ? Number(devServerUrl.port) : 5173;

export default defineConfig(({ command }) => ({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Lets the Laravel plugin write a reachable URL to public/hot (do not create that file by hand).
    origin: devServerUrl.origin,
    cors: { origin: true },
    hmr: {
      host: devServerUrl.hostname,
      port: devPort,
      clientPort: devPort,
      protocol: 'ws',
    },
    watch: {
      // Docker Desktop (Windows/Mac) bind mounts miss many native fs events; polling is reliable.
      usePolling: true,
      interval: 1000,
    },
  },
  // Subdirectory (Apache `/lang-note`) assets in production only; dev uses `/` so the
  // Vite server answers without requiring that URL prefix under port 5173.
  base: command === 'build' ? '/lang-note/build/' : '/',
}));
