import {defineConfig, UserConfig} from "vite";
import {BuiltinEnvironment} from "vitest/node"
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react-swc";
import {resolve} from "path";
import {VitePWA, VitePWAOptions} from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  includeAssets: ['favicon.ico'],
  manifest: {
    name: 'Juleølkalender',
    short_name: 'Juleølkalender',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ]
  },
  registerType: 'autoUpdate'
}
const config: UserConfig | { test: { global: boolean, environment: BuiltinEnvironment } } = {
  base: '/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@reduxjs')) {
            return "redux"
          }
          if (id.includes('node_modules/redux')) {
            return "redux"
          }
          if (id.includes('node_modules/reactjs-social-login')) {
            return "auth"
          }
          if (id.includes('node_modules/@react-oauth')) {
            return "auth"
          }
          if (id.includes('node_modules/jwt-decode')) {
            return "auth"
          }
          if (id.includes('node_modules/@emotion')) {
            return "emotion"
          }
          if (id.includes('node_modules/i18next')) {
            return "i18next"
          }
          if (id.includes('node_modules/react')) {
            return "react"
          }
        }
      }
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    VitePWA(pwaOptions)
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    global: true,
    environment: 'happy-dom',
  },
};
export default defineConfig(config);
