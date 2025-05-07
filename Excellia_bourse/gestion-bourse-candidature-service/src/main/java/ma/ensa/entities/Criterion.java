package ma.ensa.entities;

import jakarta.persistence.Embeddable;

@Embeddable
public class Criterion {
    private String name;
    private String value;

    // No-arg constructor
    public Criterion() {}

    // All-args constructor
    public Criterion(String name, String value) {
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
