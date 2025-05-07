package ma.ensa.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bourse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String university;
    private String description;
    private int places;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date deadline;

    private double amount;
    private int duration;

    private String pdfLink;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "bourse_criteria", joinColumns = @JoinColumn(name = "bourse_id"))
    private List<Criterion> eligibilityCriteria; // Changement ici

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "required_documents", joinColumns = @JoinColumn(name = "bourse_id"))
    @Column(name = "document_name")
    private List<String> requiredDocuments;

    @OneToMany(mappedBy = "bourse", cascade = CascadeType.ALL)
    private List<Candidature> candidatures;
    public Long getId() {
        return id;
    }
    public List<Criterion> getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(List<Criterion> eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPlaces() {
        return places;
    }

    public void setPlaces(int places) {
        this.places = places;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getPdfLink() {
        return pdfLink;
    }

    public void setPdfLink(String pdfLink) {
        this.pdfLink = pdfLink;
    }


    public List<String> getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(List<String> requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }

    public List<Candidature> getCandidatures() {
        return candidatures;
    }

    public void setCandidatures(List<Candidature> candidatures) {
        this.candidatures = candidatures;
    }
}
