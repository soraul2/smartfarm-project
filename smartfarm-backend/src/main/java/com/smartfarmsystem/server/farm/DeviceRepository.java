package com.smartfarmsystem.server.farm;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    // 폼에서 "조회" 버튼을 누르거나, 시리얼 번호로 디바이스를 찾을 때 사용합니다.
    Optional<Device> findBySerial(String serial);
}