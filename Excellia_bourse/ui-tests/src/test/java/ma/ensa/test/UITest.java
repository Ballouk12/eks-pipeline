package ma.ensa.test;


import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class UITest {

    protected static WebDriver driver;
    protected static WebDriverWait wait;

    // URL de base de l'application
    protected static final String BASE_URL = "http://localhost:3000";

    @BeforeAll
    public static void setup() {
        // Configuration du driver Chrome
        ChromeOptions options = new ChromeOptions();
        // Décommenter pour exécuter les tests sans interface graphique
        // options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Nettoyage du stockage local avant de commencer les tests
        driver.get(BASE_URL);
        driver.manage().deleteAllCookies();
    }

    @AfterAll
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @BeforeEach
    public void navigateToHome() {
        driver.get(BASE_URL);
    }
}