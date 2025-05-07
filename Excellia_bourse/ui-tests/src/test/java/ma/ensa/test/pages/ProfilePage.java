package ma.ensa.test.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class ProfilePage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators mis à jour pour utiliser des id
    private By profileHeader = By.id("profileHeader");
    private By editProfileButton = By.id("editProfileButton");
    private By logoutButton = By.id("logoutButton");
    private By tabPersonal = By.id("tabPersonal");
    private By tabAddress = By.id("tabAddress");
    private By tabEmergency = By.id("tabEmergency");
    private By tabEducation = By.id("tabEducation");
    // Pour l'information du profil, on peut utiliser les id définis dans le composant
    private By userNameHeader = By.id("userName");
    private By massarCode = By.id("massarCode");

    public ProfilePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo() {
        driver.get("http://localhost:3000/profile");
        wait.until(ExpectedConditions.visibilityOfElementLocated(profileHeader));
    }

    public boolean isProfilePageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(profileHeader)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickEditProfile() {
        wait.until(ExpectedConditions.elementToBeClickable(editProfileButton)).click();
    }

    public void clickLogout() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton)).click();
    }

    public void selectPersonalTab() {
        wait.until(ExpectedConditions.elementToBeClickable(tabPersonal)).click();
    }

    public void selectAddressTab() {
        wait.until(ExpectedConditions.elementToBeClickable(tabAddress)).click();
    }

    public void selectEmergencyTab() {
        wait.until(ExpectedConditions.elementToBeClickable(tabEmergency)).click();
    }

    public void selectEducationTab() {
        wait.until(ExpectedConditions.elementToBeClickable(tabEducation)).click();
    }

    public String getUserName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(userNameHeader)).getText();
    }

    public String getMassarCode() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(massarCode)).getText();
    }

    // Méthode pour vérifier si un élément d'information spécifique est affiché
    public boolean isInfoElementDisplayed(String infoLabel) {
        try {
            // Ici, on suppose que chaque libellé d'info est contenu dans un élément identifié par un id spécifique.
            // Vous pouvez adapter ce sélecteur selon votre structure.
            WebElement element = driver.findElement(By.xpath("//*[contains(text(), '" + infoLabel + "')]"));
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // Méthode pour obtenir la valeur d'une information spécifique à partir d'un conteneur parent
    public String getInfoValue(String infoLabel) {
        try {
            WebElement labelElement = driver.findElement(By.xpath("//*[contains(text(), '" + infoLabel + "')]"));
            WebElement parent = labelElement.findElement(By.xpath("./.."));
            WebElement valueElement = parent.findElement(By.className("infoValue"));
            return valueElement.getText();
        } catch (Exception e) {
            return null;
        }
    }

    // Vérifier si la modale d'édition du profil est ouverte via son id
    public boolean isEditModalOpen() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("editProfileModal"))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
