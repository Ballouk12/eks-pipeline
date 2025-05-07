package ma.ensa.controllers;


import ma.ensa.entities.UserRef;
import ma.ensa.services.InscreptionService;
import ma.ensa.services.UserRefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ref")
public class UserRefController {

    @Autowired
    private InscreptionService inscreptionService;
    @Autowired
    private UserRefService userRefService;


    @PostMapping
    public ResponseEntity<UserRef> createUserRef(@RequestBody UserRef userRef) {
        UserRef savedUserRef = userRefService.saveUserRef(userRef);
        return ResponseEntity.ok(savedUserRef);
    }

    // 2. Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UserRef>> getAllUserRefs() {
        List<UserRef> users = userRefService.getAllUserRefs();
        return ResponseEntity.ok(users);
    }

    // 3. Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<UserRef> getUserRefById(@PathVariable Long id) {
        Optional<UserRef> user = userRefService.getUserRefById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<UserRef> updateUserRef(@PathVariable Long id, @RequestBody UserRef updatedUserRef) {
        UserRef user = userRefService.updateUserRef(id, updatedUserRef);
        return ResponseEntity.ok(user);
    }

    // 5. Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRef(@PathVariable Long id) {
        userRefService.deleteUserRef(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<List<UserRef>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            List<UserRef> usersRef = userRefService.processUploadedFile(file);
            return ResponseEntity.ok(usersRef);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
