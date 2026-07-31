import { defineConfig, build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Custom Vite Plugin to bundle content script into a standalone IIFE classic script.
 * Chrome Extension MV3 content scripts run as classic scripts (NOT ES Modules),
 * so they cannot use top-level 'import' or 'export' statements or code splitting.
 */
const buildContentScriptPlugin = () => {
  return {
    name: 'build-content-script',
    async closeBundle() {
      await build({
        configFile: false,
        resolve: {
          alias: {
            '@': resolve(__dirname, 'src'),
          },
        },
        build: {
          write: true,
          outDir: resolve(__dirname, 'dist'),
          emptyOutDir: false,
          sourcemap: false,
          lib: {
            entry: resolve(__dirname, 'src/content/index.ts'),
            name: 'JOGuardContentScript',
            formats: ['iife'],
            fileName: () => 'content.js',
          },
        },
      });
    },
  };
};

/**
 * Main Vite Configuration for JOGuard Chrome Extension
 * 
 * 1. Background Service Worker: ES Module (manifest.json specifies "type": "module")
 * 2. Popup & Options UI: Standard Vite React app build
 * 3. Content Script: Built via buildContentScriptPlugin into standalone IIFE (dist/content.js)
 */
export default defineConfig({
  plugins: [react(), buildContentScriptPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/pages/options/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
