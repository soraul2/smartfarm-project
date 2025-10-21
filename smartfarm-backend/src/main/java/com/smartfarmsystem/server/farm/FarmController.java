package com.smartfarmsystem.server.farm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farms") // 이 컨트롤러의 모든 API는 '/api/farms'로 시작합니다.
public class FarmController {

    private final FarmService farmService;

    @Autowired
    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    /**
     * 새 농장 추가 API
     * POST /api/farms
     */
    @PostMapping
    public ResponseEntity<?> addFarm(@RequestBody FarmRequestDto requestDto,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        
        // 💡 1. @AuthenticationPrincipal 어노테이션이 핵심입니다.
        //    '보안요원(JwtAuthenticationFilter)'이 토큰을 검사하고 SecurityContext에 저장한
        //    '사용자 정보(UserDetails)'를 여기서 바로 꺼내 쓸 수 있습니다.
        
        // 2. userDetails.getUsername()에는 우리가 토큰에 넣었던 '이메일'이 들어있습니다.
        String userEmail = userDetails.getUsername(); 

        try {
            // 3. Service에 폼 데이터(DTO)와 사용자 이메일을 넘겨 농장을 추가합니다.
            Farm savedFarm = farmService.addFarm(requestDto, userEmail);
            
            // 4. 성공 시 200 OK와 함께 저장된 농장 정보를 반환합니다.
            return ResponseEntity.ok(savedFarm); 
            
        } catch (IllegalArgumentException e) {
            // 5. (Service에서 발생한) 중복 시리얼 등의 에러가 발생하면 400 Bad Request를 반환합니다.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}