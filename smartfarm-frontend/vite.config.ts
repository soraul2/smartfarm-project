import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // 모든 IP 주소에서 접속 허용
    port: 3000,      // 3000번 포트 사용
    proxy: {
      '/api': {
        // Docker 컨테이너 환경에서는 'localhost' 대신
        // 백엔드 서비스의 컨테이너 이름(또는 서비스 이름)을 사용해야 합니다.
        // docker-compose.yml에 정의된 백엔드 서비스 이름을 사용하세요. (예: 'backend', 'api-server' 등)
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
})