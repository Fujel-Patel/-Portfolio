import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  /* ── Path aliases ───────────────────────────────── */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  /* ── Environment variable prefix ────────────────── */
  envPrefix: 'VITE_',

  /* ── Dev server ─────────────────────────────────── */
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  /* ── Preview (production preview) ───────────────── */
  preview: {
    port: 4173,
    open: true,
  },

  /* ── Build optimizations ────────────────────────── */
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'esbuild',

    /* Raise chunk warning (Three.js core is ~666 KB minified) */
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        /* ── Manual chunk splitting ─────────────── */
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          // Three.js ecosystem
          if (id.includes('node_modules/three/')) {
            return 'three-vendor'
          }
          // R3F + drei
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'r3f-vendor'
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-vendor'
          }
          // Router
          if (id.includes('react-router')) {
            return 'router-vendor'
          }
        },

        /* Hashed filenames for long-term caching */
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  /* ── Dependency optimisation ────────────────────── */
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', 'zustand'],
  },
}))
