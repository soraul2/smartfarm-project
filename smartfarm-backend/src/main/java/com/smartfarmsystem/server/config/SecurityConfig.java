package com.smartfarmsystem.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // HttpMethod import
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // 💡 시큐리티 설정을 활성화합니다.
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean // HTTP 보안 설정을 위한 필터 체인을 Bean으로 등록합니다.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 보호 비활성화 (Stateless한 REST API에서는 필수)
                .csrf(csrf -> csrf.disable()) 
                
                // 2. HTTP 요청에 대한 접근 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                // 💡 POST 메서드의 "/api/auth/signup" 경로만 누구나 접근 허용 (403 해결)
                .requestMatchers(HttpMethod.POST, "/api/auth/signup").permitAll() 
                    
                // 💡 POST 메서드의 "/api/auth/login" 경로 허용 (추가)
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll() 

                // 그 외 나머지 모든 요청은 반드시 인증이 필요함
                .anyRequest().authenticated() // 💡 그 외 모든 요청은 인증 필요
            );

        return http.build();
    }
}