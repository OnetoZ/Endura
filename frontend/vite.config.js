import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 85 },
      jpeg: { quality: 85 },
      jpg: { quality: 85 },
      webp: { lossless: true },
      avif: { lossless: true },
    })
  ],
  server: {
    port: 5173,
    strictPort: true, // fail if 5173 is taken rather than auto-increment to a random port
  },
  esbuild: {
    // Drop all console logs and debuggers in production to hide data from users
    drop: ['console', 'debugger'],
  },
  build: {
    // Disable source maps so your original React code is not visible in browser DevTools
    sourcemap: false,
    // Minify code to make it unreadable (gibberish)
    minify: 'esbuild',
    // Optionally chunk the files to further complicate inspection
    chunkSizeWarningLimit: 1000,
  }
})
