// FarmService.java
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

    @Autowired
    public FarmService(FarmRepository farmRepository,
                       DeviceRepository deviceRepository,
                       UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    /**
     * 새로운 농장을 추가하고, 미리 등록된 디바이스들을 이 농장에 연결합니다.
     * @param dto 폼에서 받은 농장 및 디바이스(시리얼, 설명) 정보
     * @param userEmail JWT 토큰에서 추출한 사용자 이메일
     * @return 저장된 Farm 엔티티
     */
    @Transactional // DB 작업 중 하나라도 실패하면 모두 롤백
    public Farm addFarm(FarmRequestDto dto, String userEmail) {

        // 1. 사용자 확인
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        // 2. 새 농장 엔티티 생성 및 기본 정보 설정
        Farm farm = new Farm();
        farm.setName(dto.getName());
        farm.setAddress(dto.getAddress());
        farm.setDetailedAddress(dto.getDetailedAddress()); // 상세 주소 추가
        farm.setDescription(dto.getDescription());
        farm.setUser(user); // 농장 주인 설정

        // 3. 디바이스 연결 처리
        if (dto.getDevices() != null && !dto.getDevices().isEmpty()) {
            for (DeviceRequestDto deviceDto : dto.getDevices()) {
                // 3-1. 시리얼 번호로 DB에서 '주인 없는' 디바이스를 찾습니다.
                Device device = deviceRepository.findBySerial(deviceDto.getSerial())
                        .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 디바이스 시리얼입니다: " + deviceDto.getSerial()));

                // 3-2. (이중 체크) 혹시 이미 다른 농장에 할당되었는지 다시 확인합니다.
                if (device.getFarm() != null) {
                    throw new IllegalStateException("이미 다른 농장에 등록된 디바이스입니다: " + deviceDto.getSerial());
                }

                // 3-3. 디바이스 정보 업데이트 (설명 등)
                // (선택사항: 폼에서 입력한 설명으로 DB의 설명을 덮어쓸지 결정)
                // device.setDescription(deviceDto.getDescription()); // 주석 처리 - 필요하면 활성화

                // 3-4. 찾은 디바이스를 새로 만드는 농장에 연결합니다.
                farm.addDevice(device); // Farm 엔티티의 연관관계 편의 메서드 사용
            }
        } else {
            // 디바이스가 하나도 없는 경우 (선택사항: 비어있는 농장 생성을 막을 수도 있음)
            // throw new IllegalArgumentException("농장에 최소 하나 이상의 디바이스를 등록해야 합니다.");
        }

        // 4. 농장 저장 (Cascade 설정 때문에 연결된 Device들의 farm_id도 자동으로 업데이트됨)
        return farmRepository.save(farm);
    }
}