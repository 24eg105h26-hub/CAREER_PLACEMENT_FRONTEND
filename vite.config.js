import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on current mode
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_BACKEND_URL || env.BACKEND_URL || (env.PORT ? `http://127.0.0.1:${env.PORT}` : 'http://127.0.0.1:8080');

  return {
    plugins: [react()],
    base: '/',
    server: {
      port: parseInt(env.PORT || '5173', 10),
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
