package ma.ensa.producer;

import ma.ensa.entities.User;
import ma.ensa.repositories.UserRepository;
import ma.ensa.util.UserEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class UserEventProducer {
    @Autowired
    private  StreamBridge streamBridge;
    @Autowired
    private UserRepository userRepository;
    public void publishListUsers() {
        publishUsers(userRepository.findAll());

    }


    public void publishUserCreated(User user) {
        // Création de l'événement pour le premier topic
        UserEvent event = new UserEvent.Builder()
                .eventType("UserCreated")
                .eventId(UUID.randomUUID().toString())
                .payload(new ma.ensa.util.User(user.getId(),user.getCne(),user.getPassword()))
                .build();

        // Publication dans le premier topic (événement unique)
       boolean sent = streamBridge.send("userEvents-out-0", event);

        // Publication dans le deuxième topic (liste d'utilisateurs)
        //List<User> users = Collections.singletonList(user);
        //boolean sent = streamBridge.send("usersTopic-out-0", users);

        if (sent) {
            System.out.println("User created message successfully sent to both topics: " + user);
        } else {
            System.err.println("Failed to send user created message to usersTopic-out-0");
        }
    }

    public void publishUserUpdated(ma.ensa.util.User user) {
        // Création de l'événement pour le premier topic
        UserEvent event = new UserEvent.Builder()
                .eventType("UserUpdated")
                .eventId(UUID.randomUUID().toString())
                .payload(user)
                .build();

        // Publication dans le premier topic (événement unique)
        boolean sent =  streamBridge.send("userEvents-out-0", event);

        // Publication dans le deuxième topic (liste d'utilisateurs)
        //List<User> users = Collections.singletonList(user);
       // boolean sent = streamBridge.send("usersTopic-out-0", event);

        if (sent) {
            System.out.println("User updated message successfully sent to both topics: " + user);
        } else {
            System.err.println("Failed to send user updated message to usersTopic-out-0");
        }
    }

    // Méthode supplémentaire pour publier une liste d'utilisateurs (similaire à UserPublishBridgeService)
    public void publishUsers(List<User> users) {
        boolean sent = streamBridge.send("usersTopic-out-0", users);

        if (sent) {
            System.out.println("Multiple users successfully sent to Kafka topic: =====> " + users);
        } else {
            System.err.println("Failed to send multiple users to Kafka topic.");
        }
    }
}