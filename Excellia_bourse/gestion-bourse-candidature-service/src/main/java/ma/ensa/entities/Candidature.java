package ma.ensa.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidature {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User info
    private Long userId;
    private String name;
    private String email;
    private String cne;

    // Status of the application
    private String status;

    // Application date
    @Temporal(TemporalType.TIMESTAMP)
    private Date applicationDate;

    @ManyToOne
    @JoinColumn(name = "bourse_id")
    private Bourse bourse;

    @ElementCollection
    @CollectionTable(name = "candidature_responses", joinColumns = @JoinColumn(name = "candidature_id"))
    @MapKeyColumn(name = "criteria_name")
    @Column(name = "response")
    private Map<String, String> criteriaResponses;


    @ElementCollection
    @CollectionTable(name = "candidature_documents", joinColumns = @JoinColumn(name = "candidature_id"))
    @MapKeyColumn(name = "document_name")
    @Column(name = "file_path")
    private Map<String, String> documents;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Bourse getBourse() {
        return bourse;
    }

    public void setBourse(Bourse bourse) {
        this.bourse = bourse;
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
