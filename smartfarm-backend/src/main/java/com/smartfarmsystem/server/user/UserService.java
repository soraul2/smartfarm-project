package com.smartfarmsystem.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signUp(String username , String password , String email){
        //아이디 중복 확인
        if(userRepository.findByUsername(username).isPresent()){
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }   

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

}
