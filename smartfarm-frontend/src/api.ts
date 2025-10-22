import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 주소
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
        // config.headers가 존재하고 토큰이 있을 때만 헤더를 추가합니다.
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) // 타입스크립트가 타입을 추론할 수 있으므로 any를 명시할 필요가 없습니다.
);

export default api;