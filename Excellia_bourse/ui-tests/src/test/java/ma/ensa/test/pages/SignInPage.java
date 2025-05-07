package ma.ensa.test.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

// Page Object pour la page de connexion
public class SignInPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators mis à jour pour utiliser les id
    private By cneInput = By.id("cne");
    private By passwordInput = By.id("password");
    private By signInButton = By.id("signInButton");
    private By errorMessage = By.id("errorMessage");
    private By signUpLink = By.id("signUpLink");

    public SignInPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo() {
        driver.get("http://localhost:3000/signin");
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

    public void clickSignIn() {
        wait.until(ExpectedConditions.elementToBeClickable(signInButton)).click();
    }

    public void signIn(String cne, String password) {
        enterCne(cne);
        enterPassword(password);
        clickSignIn();
    }

    public void clickSignUpLink() {
        wait.until(ExpectedConditions.elementToBeClickable(signUpLink)).click();
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return errorElement.getText();
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return driver.findElement(errorMessage).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
