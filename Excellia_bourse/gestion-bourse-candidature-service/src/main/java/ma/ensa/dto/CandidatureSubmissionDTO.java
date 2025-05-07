package ma.ensa.dto;

import lombok.Data;

import java.util.Map;

@Data
public class CandidatureSubmissionDTO {
    private Long bourseId;
    private String name;
    private String email;
    private String cne;
    private Map<String, String> criteriaResponses;

    public Long getBourseId() {
        return bourseId;
    }

    public void setBourseId(Long bourseId) {
        this.bourseId = bourseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCne() {
        return cne;
    }

    public void setCne(String cne) {
        this.cne = cne;
    }

    public Map<String, String> getCriteriaResponses() {
        return criteriaResponses;
    }

    public void setCriteriaResponses(Map<String, String> criteriaResponses) {
        this.criteriaResponses = criteriaResponses;
    }
}