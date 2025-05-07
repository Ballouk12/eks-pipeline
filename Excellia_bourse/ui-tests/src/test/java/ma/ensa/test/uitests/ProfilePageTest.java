/*package ma.ensa.test.uitests;

import ma.ensa.test.UITest;
import ma.ensa.test.pages.ProfilePage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class ProfilePageTest extends UITest {

    @Test
    public void testProfileInfo() {
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.navigateTo();

        // Vérifier que le nom de l'utilisateur est affiché
        String userName = profilePage.getUserName();
        Assertions.assertNotNull(userName, "Le nom de l'utilisateur est null");
        Assertions.assertTrue(userName.length() > 0, "Le nom de l'utilisateur n'est pas affiché");

        // Vérifier que le code Massar est présent
        String massar = profilePage.getMassarCode();
        Assertions.assertNotNull(massar, "Le code Massar est null");
        Assertions.assertTrue(massar.length() > 0, "Le code Massar n'est pas affiché");
    }

    @Test
    public void testProfileTabSwitching() {
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.navigateTo();

        // Sélectionner et vérifier l'onglet "Personal Information"
        profilePage.selectPersonalTab();
        Assertions.assertTrue(driver.getPageSource().contains("Personal Information"),
                "L'onglet Personal Information n'est pas visible");

        // Sélectionner et vérifier l'onglet "Address"
        profilePage.selectAddressTab();
        Assertions.assertTrue(driver.getPageSource().contains("Address"),
                "L'onglet Address n'est pas visible");

        // Sélectionner et vérifier l'onglet "Emergency Contact"
        profilePage.selectEmergencyTab();
        Assertions.assertTrue(driver.getPageSource().contains("Emergency Contact"),
                "L'onglet Emergency Contact n'est pas visible");

        // Sélectionner et vérifier l'onglet "Education History"
        profilePage.selectEducationTab();
        Assertions.assertTrue(driver.getPageSource().contains("Education History"),
                "L'onglet Education History n'est pas visible");
    }

    @Test
    public void testLogoutFunctionality() {
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.navigateTo();

        // Cliquer sur le bouton Logout
        profilePage.clickLogout();

        // Attendre la redirection vers la page de connexion (par exemple, URL contenant "/signin")
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/signin"));

        // Vérifier que l'URL contient "/signin"
        String currentUrl = driver.getCurrentUrl();
        Assertions.assertTrue(currentUrl.contains("/signin"),
                "La redirection vers la page de connexion n'a pas fonctionné après le logout");
    }

    @Test
    public void testEditModalOpens() {
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.navigateTo();

        // Cliquer sur le bouton Edit Profile pour ouvrir la modale
        profilePage.clickEditProfile();

        // Attendre brièvement l'ouverture de la modale (si nécessaire)
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                // Ce sélecteur doit correspondre à l'id utilisé dans le composant de la modale, par exemple "editProfileModal"
                // Adaptez-le selon votre implémentation.
                org.openqa.selenium.By.id("editProfileModal")
        ));

        // Vérifier que la modale est affichée
        Assertions.assertTrue(profilePage.isEditModalOpen(), "La modale d'édition du profil n'est pas ouverte");
    }
}
*/