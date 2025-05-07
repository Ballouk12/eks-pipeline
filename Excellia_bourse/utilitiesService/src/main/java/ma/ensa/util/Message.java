package ma.ensa.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private Long id ;
    private Long userId;
    private String expediteur ;
    private String message ;
    private Date date ;
}