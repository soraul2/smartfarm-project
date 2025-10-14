package com.smartfarmsystem.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 이 클래스가 REST API를 처리하는 컨트롤러임을 나타냅니다.
@RequestMapping("/api/auth")// 이 컨트롤러의 모든 API는 '/api/auth' 라는 주소로 시작합니다.
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    // /api/auth/signup 주소로 오는 post 요청을 처리합니다.
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequestDto requestDto){
        userService.signUp(requestDto.getUsername(), requestDto.getPassword(), requestDto.getEmail());
        //성공 시 201 Created 상태 코드와 메시지를 반환
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 성공적으로 완료됐습니다.");
    }

}
