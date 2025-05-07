package ma.ensa.controllers;

import ma.ensa.dtos.FullUserDto;
import ma.ensa.entities.Profile;
import ma.ensa.entities.User;
import ma.ensa.producer.UserEventProducer;
import ma.ensa.services.InscreptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private InscreptionService inscreptionService;
    @Autowired
    private UserEventProducer userEventProducer;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User createdUser = inscreptionService.signup(user .getCne(), user.getPassword());
        if (createdUser != null) {
            userEventProducer.publishListUsers();
        }
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        inscreptionService.login(user.getCne(), user.getPassword());
        return ResponseEntity.ok("Connexion réussie !");
    }

    @PostMapping("/addProfile")
    public ResponseEntity<String> addProfile(@RequestBody FullUserDto fullUserDto) {
        inscreptionService.addProfile(fullUserDto);
        return ResponseEntity.ok("Profil ajouté avec succès !");
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Profile> getProfileByUserId(@PathVariable Long userId) {
        Profile profile = inscreptionService.getProfileByUserId(userId);
        if (profile != null) {
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

