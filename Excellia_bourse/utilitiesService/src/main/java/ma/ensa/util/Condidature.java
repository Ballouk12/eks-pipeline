package ma.ensa.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Condidature {
    private Long id;
    private String status;
    private Long UserId ;
    private int activities;
    private String lettreMotivation;
    private float score;
    private Bourse bourse;
}
