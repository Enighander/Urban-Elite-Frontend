import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_REACT_APP_API_KEY':JSON.stringify(process.env.VITE_REACT_APP_API_KEY)
  }
})
