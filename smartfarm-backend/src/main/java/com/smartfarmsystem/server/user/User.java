package com.smartfarmsystem.server.user;

import jakarta.persistence.Column; // 클래스의 필드(변수)를 테이블의 특정 컬럼(열)에 매핑할 때 세부 설정을 추가합니다. (예: NOT NULL, UNIQUE)
import jakarta.persistence.Entity; // 이 클래스가 데이터베이스 테이블과 일대일로 매핑되는 '엔티티' 클래스임을 선언합니다.
import jakarta.persistence.GeneratedValue; // 기본 키(Primary Key) 값이 어떻게 생성될지 전략을 설정합니다.
import jakarta.persistence.GenerationType; // 기본 키 값 생성 전략의 종류를 정의합니다. (예: IDENTITY - DB가 알아서 자동 증가)
import jakarta.persistence.Id; // 이 필드가 테이블의 기본 키(Primary Key)임을 나타냅니다.
import jakarta.persistence.Table; // 엔티티 클래스와 매핑될 테이블의 이름을 지정할 때 사용합니다. (지정 안 하면 클래스 이름으로 생성)

// lombok 라이브러리는 반복적인 코드를 어노테이션 하나로 자동 생성해줍니다.
import lombok.Getter; // 모든 필드에 대한 getter 메서드(예: getUsername())를 자동으로 만들어줍니다.
import lombok.Setter; // 모든 필드에 대한 setter 메서드(예: setUsername(...))를 자동으로 만들어줍니다.


@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false,unique = true)
    private String email;
    
}
