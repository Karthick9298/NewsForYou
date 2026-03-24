import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@/*" maps to the project root, matching the existing tsconfig paths
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
