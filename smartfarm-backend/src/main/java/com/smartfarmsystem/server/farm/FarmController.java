package com.smartfarmsystem.server.farm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        
        // 3. Service에 폼 데이터(DTO)와 사용자 이메일을 넘겨 농장을 추가합니다.
        // 예외 처리는 GlobalExceptionHandler에서 자동으로 처리됩니다.
        Farm savedFarm = farmService.addFarm(requestDto, userEmail);
        
        // 4. 성공 시 200 OK와 함께 저장된 농장 정보를 반환합니다.
        return ResponseEntity.ok(savedFarm);
    }

    /**
     * 로그인한 사용자의 모든 농장 목록 조회 API
     * GET /api/farms
     */
    @GetMapping
    public ResponseEntity<List<Farm>> getFarms(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. @AuthenticationPrincipal을 통해 인증된 사용자의 정보를 가져옵니다.
        String userEmail = userDetails.getUsername();

        // 2. FarmService를 호출하여 해당 사용자의 농장 목록을 조회합니다.
        List<Farm> farms = farmService.getFarmsByUser(userEmail);

        // 3. 성공 시 200 OK와 함께 농장 목록을 반환합니다.
        return ResponseEntity.ok(farms);
    }

    /**
     * 특정 농장의 상세 정보 조회 API
     * GET /api/farms/{farmId}
     * @param farmId URL 경로에서 받아온 농장 ID
     * @param userDetails 인증된 사용자 정보
     * @return 200 OK와 함께 농장 상세 정보 반환
     */
    @GetMapping("/{farmId}")
    public ResponseEntity<Farm> getFarmDetail(@PathVariable Long farmId,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        // 1. 인증된 사용자의 이메일을 가져옵니다.
        String userEmail = userDetails.getUsername();
        // 2. Service를 호출하여 해당 사용자의 특정 농장 정보를 조회합니다.
        Farm farm = farmService.getFarmDetail(farmId, userEmail);
        return ResponseEntity.ok(farm);
    }
}