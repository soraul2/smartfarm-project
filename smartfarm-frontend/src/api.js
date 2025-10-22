import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 주소
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기 (키 이름 수정)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;