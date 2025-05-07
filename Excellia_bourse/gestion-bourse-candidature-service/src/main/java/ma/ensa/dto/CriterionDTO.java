package ma.ensa.dto;

public class CriterionDTO {
    private String name;
    private String value;

    // No-args constructor
    public CriterionDTO() {}

    // Constructor with arguments
    public CriterionDTO(String name, String value) {
        this.name = name;
        this.value = value;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
