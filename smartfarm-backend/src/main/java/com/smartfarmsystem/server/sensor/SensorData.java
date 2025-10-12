package com.smartfarmsystem.server.sensor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB에 저장될 고유 ID

    // JSON 데이터 필드와 매핑
    private int num; // JSON의 "num"

    private String serial; // JSON의 "serial"
    
    private String date; // JSON의 "date" (수신 시간)

    private float temperature; // JSON의 "temperature" (온도)

    private float humidity; // JSON의 "humidity" (습도)

    private float waterTemperature; // JSON의 "waterTemperature" (수온)

    private int co2; // JSON의 "co2" (이산화탄소)

    private float lux; // JSON의 "lux" (조도)

    private float ph; // JSON의 "ph" (수소 이온 농도)

    private float ec; // JSON의 "ec" (전기 전도도)

    @CreationTimestamp // 이 데이터가 DB에 저장되는 시간
    private LocalDateTime createdAt;
}