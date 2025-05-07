package ma.ensa.services;

import ma.ensa.dtos.FullUserDto;
import ma.ensa.entities.Profile;
import ma.ensa.entities.User;
import ma.ensa.repositories.ProfileRepository;
import ma.ensa.repositories.UserRefRepository;
import ma.ensa.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class InscreptionService {
    @Autowired
    UserRefRepository userRefRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    ProfileRepository profileRepository;

    public User signup(String cne, String password) {
        if (userRepository.findByCne(cne).isPresent()) {
            throw new RuntimeException("CNE déjà utilisé !");
        }
        if (!userRefRepository.findByCne(cne).isPresent()) {
            throw new RuntimeException("Etudiant inexistant !");
        }
        User user = new User();
        user.setCne(cne);
        user.setPassword(passwordEncoder.encode(password)); // Hachage du mot de passe
        return userRepository.save(user);
    }

    public User login(String cne, String password) {
        User user = userRepository.findByCne(cne)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé !"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect !");
        }
        return user;
    }

    public void addProfile(FullUserDto fullUserDto) {
        User user = fullUserDto.getUser();
        Profile profile = fullUserDto.getProfile();

        if (userRepository.existsByCne(user.getCne())) {
            user = userRepository.findByCne(user.getCne()).get();
            profile.setUser(user);
            profileRepository.save(profile);
        } else {
            throw new RuntimeException("Utilisateur introuvable !");
        }
    }

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

}
