// FarmService.java
package com.smartfarmsystem.server.farm;

import com.smartfarmsystem.server.user.User;
import com.smartfarmsystem.server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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
        //로그인이 안 됐을 경우 농장 생성 실패

        // 2. 새 농장 엔티티 생성 및 기본 정보 설정
        Farm farm = new Farm();
        farm.setName(dto.getName());
        farm.setAddress(dto.getAddress());
        farm.setDetailedAddress(dto.getDetailedAddress()); // 상세 주소 추가
        farm.setDescription(dto.getDescription());
        farm.setUser(user); // 농장 주인 설정
            //farm 객체에 dto 객체를 이용해서 데이터를 넣는 작업    
        
        // 3. 농장을 먼저 저장하여 ID를 부여받고 영속 상태로 만듭니다.
        // 이렇게 해야 디바이스와 연결할 때 TransientObjectException이 발생하지 않습니다.
        Farm savedFarm = farmRepository.save(farm);
        
        // 3. 디바이스 연결 처리
        if (dto.getDevices() != null && !dto.getDevices().isEmpty()) {
            //디바이스가 있는지 없는지 이중 체크
            for (DeviceRequestDto deviceDto : dto.getDevices()) {
                //모든 DeviceRequestDto deviceDto라는 리스트에 dto.getDevices() 를 실행하여 있는지 없는지 체크한다.
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
                
                // 3-4. 찾은 디바이스를 방금 저장한 농장에 연결합니다.
                savedFarm.addDevice(device); // Farm 엔티티의 연관관계 편의 메서드 사용
                //이 경우를 찾아봐야함.여기에서 여러개의 device를 list로 받아서 활용하는지 체크
            }
        } else {
            // 디바이스가 하나도 없는 경우 (선택사항: 비어있는 농장 생성을 막을 수도 있음)
            // throw new IllegalArgumentException("농장에 최소 하나 이상의 디바이스를 등록해야 합니다.");
        }
        // 4. @Transactional에 의해 변경된 Device 정보는 메서드 종료 시 자동으로 DB에 반영(update)됩니다.
        return savedFarm;
    }

    /**
     * 특정 사용자가 소유한 모든 농장 목록을 조회합니다.
     * @param userEmail JWT 토큰에서 추출한 사용자 이메일
     * @return 해당 사용자의 Farm 엔티티 리스트
     */
    @Transactional(readOnly = true) // 데이터를 변경하지 않는 조회 작업이므로 readOnly = true 설정
    public List<Farm> getFarmsByUser(String userEmail) {
        // 1. 사용자 확인
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
        // 2. 해당 사용자의 모든 농장 목록을 조회하여 반환
        return farmRepository.findByUser(user);
    }
}