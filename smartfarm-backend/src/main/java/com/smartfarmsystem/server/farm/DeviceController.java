package com.smartfarmsystem.server.farm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    /**
     * 디바이스 시리얼 번호 조회 API
     * GET /api/devices/check?serial=SN-12345
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkDeviceBySerial(@RequestParam("serial") String serial) {
        try {
            Device device = deviceService.checkDevice(serial);
            // 성공: 200 OK + 디바이스 정보 반환
            return ResponseEntity.ok(device); 
        } catch (IllegalArgumentException e) {
            // 실패(404): 디바이스가 DB에 존재하지 않음
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            // 실패(409): 디바이스는 존재하지만, 이미 다른 농장에 등록됨
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}