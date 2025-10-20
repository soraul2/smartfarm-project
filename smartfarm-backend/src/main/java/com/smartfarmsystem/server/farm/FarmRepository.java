package com.smartfarmsystem.server.farm;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartfarmsystem.server.user.User;

public interface FarmRepository extends JpaRepository<Farm,Long>{
    List<Farm> findByUser(User user);

    List<Farm> findByUserEmail(String email);
}
