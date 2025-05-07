package ma.ensa.repositories;

import ma.ensa.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CondidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findByBourseId(Long bourseId);
    List<Candidature> findByUserId(Long userId);
    boolean existsByUserIdAndBourseId(Long userId, Long bourseId);
}