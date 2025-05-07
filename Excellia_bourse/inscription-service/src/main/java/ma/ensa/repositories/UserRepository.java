package ma.ensa.repositories;

import ma.ensa.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCne(String cne);
    boolean existsByCne(String cne);
}
