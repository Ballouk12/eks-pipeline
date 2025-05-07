package ma.ensa.test.uitests;

import ma.ensa.test.UITest;
import ma.ensa.test.pages.SignUpPage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

public class SignUpTest extends UITest {

    @Test
    public void testSignUpWithMismatchedPasswords() {
        SignUpPage signUpPage = new SignUpPage(driver);
        signUpPage.navigateTo();

        // Inscrire un utilisateur avec un mot de passe qui ne correspond pas à la confirmation
        signUpPage.signUp("c13516", "password123", "password456");

        // Vérifier que le message d'erreur est affiché
        Assertions.assertTrue(signUpPage.isErrorMessageDisplayed(), "Le message d'erreur n'est pas affiché");
        Assertions.assertEquals("Passwords do not match", signUpPage.getErrorMessage());
    }
}
