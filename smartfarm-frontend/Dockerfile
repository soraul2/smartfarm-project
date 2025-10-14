# Node.js 18 버전을 베이스 이미지로 사용합니다.
FROM node:18-alpine

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 의존성 파일을 먼저 복사하여 캐싱 효과를 극대화합니다.
COPY package*.json ./

# 의존성을 설치하고 Vite 개발 서버를 실행합니다.
RUN npm install

# 프로젝트 소스 코드를 전부 복사합니다.
COPY . .

# Vite 개발 서버가 사용하는 5173 포트를 노출합니다.
EXPOSE 5173

# 컨테이너가 시작될 때 Vite 개발 서버를 실행합니다.
CMD ["npm", "run", "dev"]