package com.smartfarmsystem.server.farm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "devices") // DB에 'devices'라는 이름의 테이블로 생성
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 디바이스 고유 ID

    @Column(nullable = false, unique = true) // 시리얼 번호는 비어있을 수 없고, 고유해야 함
    private String serial; // 디바이스 시리얼

    private String description; // 디바이스 상세 설명

    // --- 관계 설정 ---

    // Device(Many) To Farm(One) : 여러 디바이스가 하나의 농장에 속함
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id") // 'farm_id' 라는 이름으로 Farm의 FK를 가짐
    @JsonIgnore // JSON 직렬화 시 이 필드를 무시하여 순환 참조 방지
    private Farm farm;
}