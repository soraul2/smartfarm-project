package com.smartfarmsystem.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
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

                // 💡 CORS 설정을 Spring Security 필터 체인에 통합합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 추가: form-based login 비활성화
                .formLogin(form -> form.disable())

                // 추가: http basic auth 기반 로그인 인증창 비활성화
                .httpBasic(basic -> basic.disable())

                // 추가: 세션 관리를 Stateless로 설정 (JWT 인증 방식이므로)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 2. HTTP 요청에 대한 접근 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                // 💡 회원가입 및 로그인 API는 누구나 접근 허용
                // 💡 Preflight 요청(OPTIONS)은 인증 없이 모두 허용
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
                // 💡 농장 및 디바이스 관련 API는 반드시 '인증'이 필요함
                .requestMatchers("/api/farms/**", "/api/devices/**").authenticated()

                // 그 외 나머지 모든 요청은 반드시 인증이 필요함
                .anyRequest().authenticated() // 💡 그 외 모든 요청은 인증 필요
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 💡 CORS(Cross-Origin Resource Sharing) 설정을 위한 Bean
     * Spring Security 필터 체인에 통합되어 전역적으로 CORS 정책을 관리합니다.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 Origin 목록 (프론트엔드 개발 서버)
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // 허용할 HTTP 메서드 (OPTIONS는 preflight 요청에 필수)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // 허용할 모든 HTTP 헤더
        configuration.setAllowedHeaders(List.of("*"));
        // 자격 증명(쿠키, Authorization 헤더 등)을 포함한 요청 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 위 설정 적용
        return source;
    }
}