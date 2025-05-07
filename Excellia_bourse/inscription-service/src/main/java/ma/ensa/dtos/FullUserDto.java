package ma.ensa.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ensa.entities.Profile;
import ma.ensa.entities.User;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FullUserDto {

    private Profile profile;
    private User user;
}
