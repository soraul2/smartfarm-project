package com.smartfarmsystem.server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. 요청(Request) 헤더에서 "Authorization" 헤더를 찾습니다.
        String token = resolveToken(request);

        // 2. 토큰이 존재하고 유효하다면
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            
            // 3. 토큰에서 인증 정보(Authentication)를 가져옵니다.
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            
            // 4. 이 인증 정보를 Spring Security의 실행 컨텍스트에 저장합니다.
            //    이제 이 요청은 "인증된" 요청이 됩니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 5. 다음 필터로 요청을 전달합니다.
        filterChain.doFilter(request, response);
    }

    // "Authorization" 헤더에서 'Bearer ' 접두사를 제거하고 순수 토큰만 추출하는 메서드
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}