import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'webllm': ['@mlc-ai/web-llm'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'class-variance-authority'],
          'markdown-vendor': ['react-markdown', 'rehype-highlight', 'rehype-raw', 'rehype-sanitize', 'remark-gfm', 'highlight.js'],
          'tanstack-vendor': ['@tanstack/react-query', '@tanstack/react-table', '@tanstack/react-store'],
          'utils-vendor': ['zod', '@faker-js/faker']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  base: process.env.NODE_ENV === 'production' ? '/webllm/' : '/',
})