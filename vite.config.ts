import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure PDF files are treated as assets and served properly
  assetsInclude: ['**/*.pdf'],
  
  // Configure server to serve PDFs with correct headers
  server: {
    fs: {
      // Allow serving files from the public directory
      allow: ['..']
    }
  },
  
  // Build configuration to handle static assets properly
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      // Ensure PDF files are copied to build output
      input: {
        main: './index.html'
      }
    }
  }
});
