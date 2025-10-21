package com.smartfarmsystem.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity // 💡 시큐리티 설정을 활성화합니다.
public class SecurityConfig {

    //1. 방금 만든 보안요원 필터를 주입받습니다.
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter){
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean // HTTP 보안 설정을 위한 필터 체인을 Bean으로 등록합니다.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 보호 비활성화 (Stateless한 REST API에서는 필수)
                .csrf(csrf -> csrf.disable()) 

                // 추가: form-based login 비활성화
                .formLogin(form -> form.disable())

                // 추가: http basic auth 기반 로그인 인증창 비활성화
                .httpBasic(basic -> basic.disable())

                // 추가: 세션 관리를 Stateless로 설정 (JWT 인증 방식이므로)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 2. HTTP 요청에 대한 접근 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                // 💡 회원가입 및 로그인 API는 누구나 접근 허용
                .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
                // 💡 농장 및 디바이스 관련 API는 반드시 '인증'이 필요함
                .requestMatchers("/api/farms/**", "/api/devices/**").authenticated()

                // 그 외 나머지 모든 요청은 반드시 인증이 필요함
                .anyRequest().authenticated() // 💡 그 외 모든 요청은 인증 필요
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}