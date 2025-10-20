package com.smartfarmsystem.server.farm;

import com.smartfarmsystem.server.user.User; // User 엔티티 import
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "farms") // DB에 'farms'라는 이름의 테이블로 생성
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 농장 고유 ID

    @Column(nullable = false)
    private String name; // 농장 이름

    private String address; // 주소

    private String detailedAddress; // 상세 주소

    @Column(length = 1000) // 설명은 길 수 있으므로 넉넉하게
    private String description; // 설명

    // --- 관계 설정 ---

    // Farm(Many) To User(One) : 여러 농장이 한 명의 사용자에 속함
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 'user_id' 라는 이름으로 User의 FK를 가짐
    private User user;

    // Farm(One) To Device(Many) : 한 농장이 여러 디바이스를 가짐
    // cascade = CascadeType.ALL: 농장을 저장/삭제할 때, 이 농장에 속한 디바이스들도 함께 저장/삭제
    // orphanRemoval = true: 리스트에서 디바이스를 제거하면 DB에서도 해당 디바이스가 삭제됨
    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Device> devices = new ArrayList<>();

    // == 연관관계 편의 메서드 == //
    // 디바이스를 추가할 때, Farm의 리스트에도 추가하고 Device 객체에도 Farm을 설정
    public void addDevice(Device device) {
        this.devices.add(device);
        device.setFarm(this);
    }
}