import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: 'frontend',
  plugins: [react(), tsconfigPaths()],
  server: { port: 5173 },
  build: { outDir: 'dist' },
});
