package ma.ensa.consumer;


import ma.ensa.util.User;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Component
public class SimpleUserConsumer {

    private Map<Long, ma.ensa.util.User> cashUsers = new HashMap<>();
    private List<ma.ensa.util.User> cashUsersList = new ArrayList<>();

    @Bean
    public Consumer<List<User>> usersTopicConsumer() {
        return users -> {
            System.out.println("Réception d'une liste d'utilisateurs: " + users.size() + "users"+ users);
            cashUsersList.clear();  // Pour éviter les doublons si rechargé
            cashUsers.clear();

            cashUsersList.addAll(users);
            for(User user : users) {
                cashUsers.put(user.getId(), user);
                System.out.println("Utilisateur chargé: " + user);
            }

            System.out.println("Chargement de " + users.size() + " utilisateurs terminé");
        };
    }

    public User getUserById(long id) {
        try {
            return cashUsers.get(id);
        } catch (NullPointerException e) {
            System.out.println("User not found");
            return null;
        }
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(cashUsersList);
    }


}