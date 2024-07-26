import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        './Button': './src/components/Button',
         './Att': './src/components/Att'
      },
      shared: ['react','react-dom']
    })
  ],
  base:"http://localhost:5001",
  build: {
    rollupOptions: {
      external:[],
    },
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
