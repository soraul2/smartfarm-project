package com.smartfarmsystem.server.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
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
    
    public String generateToken(String username) {
        
        // 토큰 만료 시간 (예: 1시간)
        long now = (new Date()).getTime();
        Date validity = new Date(now + 3600000); // 1시간 (1000 * 60 * 60)

        return Jwts.builder()
                .setSubject(username) // 토큰 주체 (여기서는 username)
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(validity) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 비밀키와 암호화 알고리즘 설정
                .compact();
    }
    

    
}
