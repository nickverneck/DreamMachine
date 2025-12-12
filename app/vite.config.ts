import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const sslKeyPath = env.DEV_SSL_KEY_PATH
  const sslCertPath = env.DEV_SSL_CERT_PATH

  const httpsConfig =
    sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)
      ? {
          key: fs.readFileSync(path.resolve(sslKeyPath)),
          cert: fs.readFileSync(path.resolve(sslCertPath)),
        }
      : true

  return {
    server: {
      host: '0.0.0.0',
      https: httpsConfig,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'DreamMachine',
          short_name: 'DreamMachine',
          description: 'Binaural and Isochronic tone generator for VR',
          theme_color: '#000000',
          icons: [
            {
              src: 'pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
})
