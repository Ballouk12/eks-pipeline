package ma.ensa.test.uitests;

import ma.ensa.test.UITest;
import ma.ensa.test.pages.SignInPage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class SignInTest extends UITest {

    @Test
    public void testSignInWithIncorrectCredentials() {
        SignInPage signInPage = new SignInPage(driver);
        signInPage.navigateTo();

        // Essayer de se connecter avec des identifiants incorrects
        signInPage.signIn("c13516", "wrongpassword");

        // Vérifier que le message d'erreur est affiché
        Assertions.assertTrue(signInPage.isErrorMessageDisplayed(), "Le message d'erreur n'est pas affiché");
        Assertions.assertEquals("Mot de passe incorrect !", signInPage.getErrorMessage());
    }

    @Test
    public void testSignInWithCorrectCredentials() {
        SignInPage signInPage = new SignInPage(driver);
        signInPage.navigateTo();

        // Essayer de se connecter avec des identifiants corrects
        signInPage.signIn("c13516", "123");

        // Utiliser un wait explicite pour attendre la redirection vers la page d'accueil
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/"));

        // Vérifier que l'URL est celle de la page d'accueil attendue
        String currentUrl = driver.getCurrentUrl();
        Assertions.assertEquals("http://localhost:3000/", currentUrl, "La redirection vers la page d'accueil a échoué");

    }
}
