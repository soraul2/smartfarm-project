package com.smartfarmsystem.server.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.security.SecurityException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import java.util.Collections;

@Component
public class JwtTokenProvider {


    //토큰 암호와에 사용할 비밀 키 (application.properties에 설정)
    private final Key key;

    //application.properties에서 설정한 SECRET_KEY를 주입받아 Key 객체 생성
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }


    /**
     * 사용자 이름을 기반으로 Access Token을 생성합니다.
     * @param username 토큰에 담을 사용자 ID
     * @return 생성된 JWT 문자열
     */
    
    public String generateToken(String email) {
        
        // 토큰 만료 시간 (예: 1시간)
        long now = (new Date()).getTime();
        Date validity = new Date(now + 3600000); // 1시간 (1000 * 60 * 60)

        return Jwts.builder()
                .setSubject(email) // 토큰 주체 (여기서는 username)
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(validity) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 비밀키와 암호화 알고리즘 설정
                .compact();
    }
    

    // ▼▼▼ 1. getAuthentication 메서드 (추가) ▼▼▼
    /**
     * HTTP 요청 헤더에서 받은 토큰으로부터 사용자 인증 정보(Authentication)를 생성합니다.
     */
    public Authentication getAuthentication(String token) {
        // 토큰에서 이메일(Subject)을 추출합니다.
        String email = getEmailFromToken(token);
        
        // Spring Security의 UserDetails 객체를 생성합니다. (우리는 이메일을 ID로 사용합니다)
        UserDetails userDetails = new User(email, "", Collections.emptyList());
        
        // 인증 객체(Authentication)를 생성하여 반환합니다.
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // ▼▼▼ 2. getEmailFromToken 메서드 (추가) ▼▼▼
    /**
     * 토큰에서 사용자 이메일(Subject)을 추출합니다.
     */
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ▼▼▼ 3. validateToken 메서드 (추가) ▼▼▼
    /**
     * 토큰이 유효한지 검증합니다.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            System.out.println("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            System.out.println("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            System.out.println("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            System.out.println("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    
}
