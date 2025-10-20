package com.smartfarmsystem.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.smartfarmsystem.server.config.JwtTokenProvider; // 💡 추가

import org.springframework.transaction.annotation.Transactional; 

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // 💡 추가

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider; // 💡 추가
    }

    public User signUp(String username , String password , String email){

        if(userRepository.findByEmail(email).isPresent()){
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        //비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(password);

        //User 객체 생성 및 정보 설정
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setEmail(email);
        
        return userRepository.save(user);

    }

    @Transactional(readOnly = true)
    public LoginResponseDto login(String email, String password) {
        // 1. DB에서 사용자 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.")); 
        
        // 2. 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        
        // 3. JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(user.getEmail());
        // 4. 응답 DTO 생성 및 반환
        return new LoginResponseDto(
            token, 
            user.getEmail(),
            user.getUsername() 
        );
    }
}
