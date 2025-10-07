import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      // Configure for client-side only deployment
      adapter: 'static',
    }),
    viteReact(),
  ],
  build: {
    // Configure for GitHub Pages deployment
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Configure base path for GitHub Pages (update this with your repo name)
  base: process.env.NODE_ENV === 'production' ? '/webllm/' : '/',
})

export default config
