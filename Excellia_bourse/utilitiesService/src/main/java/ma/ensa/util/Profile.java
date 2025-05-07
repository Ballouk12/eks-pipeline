package ma.ensa.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    private Long id;
    private String firstName;
    private String lastName;
    private Date dateNaissance;
    private String gender;
    private String image;
    private String notesFile;
    private User user;
}