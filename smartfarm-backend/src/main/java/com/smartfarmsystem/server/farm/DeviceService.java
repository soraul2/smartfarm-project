package com.smartfarmsystem.server.farm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * 시리얼 번호로 디바이스를 조회하고, 사용 가능한지 확인합니다.
     * @param serial 조회할 시리얼 번호
     * @return 사용 가능한 Device 엔티티
     */
    @Transactional(readOnly = true) // 단순 조회이므로 readOnly=true
    public Device checkDevice(String serial) {
        
        // 1. 시리얼 번호로 DB에서 디바이스를 찾습니다.
        Device device = deviceRepository.findBySerial(serial)
                .orElseThrow(() -> new IllegalArgumentException("해당 DEVICE가 존재하지 않습니다. 시리얼 번호를 확인해주세요."));

        // 2. 만약 farm_id가 null이 아니라면 (즉, 이미 다른 농장에 속해있다면)
        if (device.getFarm() != null) {
            throw new IllegalStateException("이미 다른 농장에 등록된 디바이스입니다.");
        }

        // 3. 존재하고, 아직 등록되지 않은 디바이스라면 반환합니다.
        return device;
    }
}