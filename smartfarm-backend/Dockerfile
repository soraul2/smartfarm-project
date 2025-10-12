# 1. 베이스 이미지 선택: JDK 21이 설치된 환경에서 시작합니다.
FROM openjdk:21-jdk-slim

# 2. 작업 디렉토리 설정: 컨테이너 내에서 명령어가 실행될 기본 폴더를 지정합니다.
WORKDIR /app

# 3. .jar 파일 복사: 빌드된 .jar 파일을 컨테이너의 작업 디렉토리로 복사합니다.
#    (아래 'my-project.jar' 부분은 실제 생성된 jar 파일 이름으로 바꿔주세요.)
COPY build/libs/*.jar app.jar

# 4. 실행 명령어: 컨테이너가 시작될 때 이 명령어를 실행하여 스프링 부트 앱을 구동합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]