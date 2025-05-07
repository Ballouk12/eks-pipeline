package ma.ensa.test.pages;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

// Page Object pour la page d'inscription
public class SignUpPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators mis à jour pour utiliser les id
    private By cneInput = By.id("cne");
    private By passwordInput = By.id("password");
    private By confirmPasswordInput = By.id("confirmPassword");
    private By continueButton = By.id("continueButton");
    private By errorMessage = By.id("errorMessage");
    private By signInLink = By.id("signInLink");

    public SignUpPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo() {
        driver.get("http://localhost:3000/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(cneInput));
    }

    public void enterCne(String cne) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(cneInput));
        input.clear();
        input.sendKeys(cne);
    }

    public void enterPassword(String password) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput));
        input.clear();
        input.sendKeys(password);
    }

    public void enterConfirmPassword(String confirmPassword) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(confirmPasswordInput));
        input.clear();
        input.sendKeys(confirmPassword);
    }

    public void clickContinue() {
        wait.until(ExpectedConditions.elementToBeClickable(continueButton)).click();
    }

    public void signUp(String cne, String password, String confirmPassword) {
        enterCne(cne);
        enterPassword(password);
        enterConfirmPassword(confirmPassword);
        clickContinue();
    }

    public String getErrorMessage() {
        WebElement errorElem = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return errorElem.getText();
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return driver.findElement(errorMessage).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickSignInLink() {
        wait.until(ExpectedConditions.elementToBeClickable(signInLink)).click();
    }

    // Méthode pour vérifier si la popup SweetAlert est affichée
    public boolean isSweetAlertVisible() {
        try {
            WebElement sweetAlert = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(By.className("swal2-popup"))
            );
            return sweetAlert.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // Cliquer sur le bouton de confirmation de SweetAlert
    public void clickSweetAlertConfirm() {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.className("swal2-confirm")
        )).click();
    }

    @Test
    public void testSignUpWithMismatchedPasswords() {
        SignUpPage signUpPage = new SignUpPage(driver);
        signUpPage.navigateTo();

        // Inscrire un utilisateur avec un mot de passe qui ne correspond pas à la confirmation
        signUpPage.signUp("123456789", "password123", "password456");

        // Vérifier que le message d'erreur est affiché
        Assertions.assertTrue(signUpPage.isErrorMessageDisplayed(), "Le message d'erreur n'est pas affiché");
        Assertions.assertEquals("Les mots de passe ne correspondent pas", signUpPage.getErrorMessage());
    }
}
