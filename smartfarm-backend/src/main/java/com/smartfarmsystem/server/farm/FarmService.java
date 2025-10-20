package com.smartfarmsystem.server.farm;

import com.smartfarmsystem.server.user.User;
import com.smartfarmsystem.server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    // 농장, 디바이스, 사용자 Repository를 모두 주입받습니다.
    @Autowired
    public FarmService(FarmRepository farmRepository, 
                       DeviceRepository deviceRepository, 
                       UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    /**
     * 새로운 농장을 추가하는 핵심 메서드
     * @param dto 폼에서 받은 농장 및 디바이스 정보
     * @param userEmail (매우 중요) JWT 토큰에서 추출한, 현재 로그인된 사용자의 이메일
     * @return 저장된 Farm 엔티티
     */
    @Transactional // 이 메서드 내의 모든 DB 작업은 하나의 트랜잭션으로 묶여서 처리됩니다.
    public Farm addFarm(FarmRequestDto dto, String userEmail) {
        
        // 1. (인증) 요청을 보낸 사용자를 DB에서 찾습니다.
        //    (우리는 이메일을 ID처럼 사용하기로 했습니다)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        // 2. (변환) DTO를 Farm 엔티티로 변환합니다.
        Farm farm = new Farm();
        farm.setName(dto.getName());
        farm.setAddress(dto.getAddress());
        farm.setDetailedAddress(dto.getDetailedAddress());
        farm.setDescription(dto.getDescription());
        
        // 3. (관계 설정) 이 농장의 주인을 방금 찾은 user로 설정합니다.
        farm.setUser(user); 

        // 4. (변환 및 유효성 검사) DTO에 포함된 디바이스 목록을 Device 엔티티로 변환합니다.
        if (dto.getDevices() != null) {
            for (DeviceRequestDto deviceDto : dto.getDevices()) {
                
                // 4-1. (유효성 검사) 디바이스 시리얼 번호가 이미 DB에 있는지 확인합니다.
                if (deviceRepository.findBySerial(deviceDto.getSerial()).isPresent()) {
                    throw new IllegalArgumentException("이미 등록된 디바이스 시리얼 번호입니다: " + deviceDto.getSerial());
                }

                // 4-2. 새 디바이스 엔티티 생성
                Device device = new Device();
                device.setSerial(deviceDto.getSerial());
                device.setDescription(deviceDto.getDescription());
                
                // 4-3. (관계 설정) Farm의 'addDevice' 편의 메서드를 사용해 농장과 디바이스를 연결합니다.
                farm.addDevice(device);
            }
        }

        // 5. (저장) Farm을 저장합니다.
        //    Farm 엔티티의 @OneToMany(cascade = CascadeType.ALL) 설정 덕분에,
        //    Farm을 저장하면 Farm에 연결된 Device들도 자동으로 함께 DB에 저장됩니다.
        return farmRepository.save(farm);
    }
}