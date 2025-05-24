import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as dotenv from 'dotenv'
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  dotenv.config(); // Load .env variables

  return {
    plugins: [react()],
    server: {
      port: parseInt(process.env.PORT || '4000'),
    },
    define: {
      'process.env': loadEnv(mode, process.cwd(), '')
    },
  }
})
