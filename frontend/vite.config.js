import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
