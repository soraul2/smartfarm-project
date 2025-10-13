# ----------------------------------------------------
# STAGE 1: 빌드 스테이지 (BUILDER) - Jar 파일 생성 담당
# ----------------------------------------------------
# 빌드에 필요한 Gradle과 JDK가 포함된 이미지를 사용합니다.
FROM gradle:8.8-jdk21-alpine AS builder 
WORKDIR /app
COPY . /app
RUN gradle build -x test

# ----------------------------------------------------
# STAGE 2: 실행 스테이지 (FINAL RUNTIME) - 요청하신 이미지를 사용
# ----------------------------------------------------
# 1. 베이스 이미지 선택: JDK 21이 설치된 환경에서 시작합니다. (요청 사항 준수)
FROM openjdk:21-jdk-slim 
WORKDIR /app

# 3. .jar 파일 복사: 빌드 스테이지에서 생성된 Jar 파일만 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 4. 실행 명령어: 컨테이너가 시작될 때 이 명령어를 실행하여 스프링 부트 앱을 구동합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]