package com.smartfarmsystem.server.farm;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartfarmsystem.server.user.User;
import java.util.Optional;

public interface FarmRepository extends JpaRepository<Farm,Long>{
    List<Farm> findByUser(User user);

    // 농장 ID와 사용자 정보로 농장을 찾는 메소드 추가
    Optional<Farm> findByIdAndUser(Long id, User user);
}
