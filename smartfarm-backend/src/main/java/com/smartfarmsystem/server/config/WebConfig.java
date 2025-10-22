package com.smartfarmsystem.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Spring Security에서 CORS를 관리하므로 WebMvcConfigurer의 설정은 비활성화하거나 제거합니다.
        // 이 설정이 남아있으면 SecurityConfig의 설정과 충돌할 수 있습니다.
    }
}