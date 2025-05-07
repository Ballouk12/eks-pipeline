package ma.ensa.repositories;

import ma.ensa.entities.UserRef;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface  UserRefRepository extends JpaRepository<UserRef, Long> {
    Optional<UserRef> findByCne(String cne);

}
