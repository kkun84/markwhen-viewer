import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const resolveBasePath = () => {
  const configuredBasePath = process.env.VITE_BASE_PATH
  if (!configuredBasePath) {
    return '/markwhen-viewer/'
  }

  return configuredBasePath.endsWith('/')
    ? configuredBasePath
    : `${configuredBasePath}/`
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  base: resolveBasePath()
})
