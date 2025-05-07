package ma.ensa.dtos;
import ma.ensa.entities.User;

public class UserEvent {

    private String eventType;
    private String eventId;
    private User payload;

    // Constructeur privé pour forcer l'utilisation du Builder
    private UserEvent(Builder builder) {
        this.eventType = builder.eventType;
        this.eventId = builder.eventId;
        this.payload = builder.payload;
    }

    // Getters
    public String getEventType() {
        return eventType;
    }

    public String getEventId() {
        return eventId;
    }

    public User getPayload() {
        return payload;
    }

    // Builder static nested class
    public static class Builder {
        private String eventType;
        private String eventId;
        private User payload;

        // Méthode pour définir eventType
        public Builder eventType(String eventType) {
            this.eventType = eventType;
            return this;
        }

        // Méthode pour définir eventId
        public Builder eventId(String eventId) {
            this.eventId = eventId;
            return this;
        }

        // Méthode pour définir payload
        public Builder payload(User payload) {
            this.payload = payload;
            return this;
        }

        // Méthode pour construire une instance de UserEvent
        public UserEvent build() {
            return new UserEvent(this);
        }
    }

    @Override
    public String toString() {
        return "UserEvent{" +
                "eventType='" + eventType + '\'' +
                ", eventId='" + eventId + '\'' +
                ", payload=" + payload +
                '}';
    }
}
