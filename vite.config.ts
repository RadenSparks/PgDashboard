import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), 'VITE_') };
  console.log(`Loading environment variables for mode: ${mode}`);
  return {
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_PORT || '4000'),
    }
  }
})
