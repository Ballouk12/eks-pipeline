package ma.ensa.util;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bourse {

    private Long id;
    private String nom;
    private String ecole;
    private int capacite;
    private String niveauScolair;
    private String description;
    private List<Condidature> condidatures;
}
