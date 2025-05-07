package ma.ensa.dto;

import lombok.Data;

import java.util.Date;
import java.util.Map;

@Data
public class CandidatureDTO {
    private Long id;
    private Long bourseId;
    private String bourseTitle;
    private String university;
    private String name;
    private String email;
    private String cne;
    private String status;
    private Date applicationDate;
    private Map<String, String> criteriaResponses;
    private Map<String, String> documents;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBourseId() {
        return bourseId;
    }

    public void setBourseId(Long bourseId) {
        this.bourseId = bourseId;
    }

    public String getBourseTitle() {
        return bourseTitle;
    }

    public void setBourseTitle(String bourseTitle) {
        this.bourseTitle = bourseTitle;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCne() {
        return cne;
    }

    public void setCne(String cne) {
        this.cne = cne;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public Map<String, String> getCriteriaResponses() {
        return criteriaResponses;
    }

    public void setCriteriaResponses(Map<String, String> criteriaResponses) {
        this.criteriaResponses = criteriaResponses;
    }

    public Map<String, String> getDocuments() {
        return documents;
    }

    public void setDocuments(Map<String, String> documents) {
        this.documents = documents;
    }
}