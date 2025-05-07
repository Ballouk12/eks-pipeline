package ma.ensa.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String cin ;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String gender;
    private String image;
    private String school;
    private String stadyLevel;
    private String major;
    private LocalDate bacYear;
    private String bacHonor;
    private float bacGrade ;
    private String emergencyContactName;
    private String emergencyContactEmail;
    private int emergencyContactPhone;
    private String relationship ;
    @OneToOne
    private User user;
}
