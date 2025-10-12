# --- 1단계: 빌드 환경 ---
# Node.js 18 버전을 베이스 이미지로 사용하여 앱을 빌드합니다.
FROM node:18-alpine AS builder

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 의존성 파일을 먼저 복사하여 캐싱 효과를 극대화합니다.
COPY package*.json ./

# 의존성을 설치합니다.
RUN npm install

# 프로젝트 소스 코드를 전부 복사합니다.
COPY . .

# React 앱을 정적 파일로 빌드합니다.
RUN npm run build

# --- 2단계: 서빙 환경 ---
# 웹 서버인 Nginx를 베이스 이미지로 사용하여 사용자에게 화면을 보여줍니다.
FROM nginx:stable-alpine

# 빌드 단계(builder)에서 생성된 결과물(/app/build 폴더)을
# Nginx의 기본 웹 루트 디렉토리(/usr/share/nginx/html)로 복사합니다.
COPY --from=builder /app/build /usr/share/nginx/html

# 컨테이너의 80번 포트를 외부로 노출시킵니다.
EXPOSE 80

# Nginx를 실행하여 웹 서버를 구동합니다.
CMD ["nginx", "-g", "daemon off;"]