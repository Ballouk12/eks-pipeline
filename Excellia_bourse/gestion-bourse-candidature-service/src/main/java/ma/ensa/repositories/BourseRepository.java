package ma.ensa.repositories;


import ma.ensa.entities.Bourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BourseRepository extends JpaRepository<Bourse, Long> {
    List<Bourse> findByTitleContainingOrUniversityContainingOrDescriptionContaining(
            String title, String university, String description);

    List<Bourse> findByPlacesGreaterThanEqual(int places);

    List<Bourse> findByDurationGreaterThanEqual(int duration);

    List<Bourse> findByAmountGreaterThanEqual(double amount);
}