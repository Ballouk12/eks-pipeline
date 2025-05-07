package ma.ensa.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ensa.entities.Bourse;
import org.springframework.core.io.Resource;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BourseWithPdfResponse {
    private Bourse bourse;
    private Resource pdfFile;
}
