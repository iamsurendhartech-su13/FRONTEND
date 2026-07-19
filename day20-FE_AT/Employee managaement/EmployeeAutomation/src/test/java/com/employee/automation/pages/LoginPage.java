package com.employee.automation.pages;

import com.employee.automation.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * LoginPage — Page Object for the Login screen.
 * URL: /login
 */
public class LoginPage extends BasePage {

    // ===================================================================
    //  Locators
    // ===================================================================
    private final By emailInput      = By.id("email");
    private final By passwordInput   = By.id("password");
    private final By loginButton     = By.id("login-btn");
    private final By errorMessage    = By.cssSelector(".text-red-500, [class*='error'], [class*='alert']");
    private final By pageHeading     = By.xpath("//h1[contains(text(),'Sign In') or contains(text(),'Login') or contains(text(),'Employee')]");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    // ===================================================================
    //  Actions
    // ===================================================================

    public void navigateToLogin(String baseUrl) {
        navigateTo(baseUrl + "/login");
        log.info("LoginPage: Navigated to login page.");
    }

    public void enterEmail(String email) {
        type(emailInput, email);
        log.info("LoginPage: Entered email: {}", email);
    }

    public void enterPassword(String password) {
        type(passwordInput, password);
        log.info("LoginPage: Entered password.");
    }

    public void clickLogin() {
        click(loginButton);
        log.info("LoginPage: Login button clicked.");
    }

    /**
     * Full login flow: enter credentials and submit.
     */
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
        log.info("LoginPage: Login submitted for user: {}", email);
    }

    // ===================================================================
    //  Assertions / Verifications
    // ===================================================================

    public boolean isLoginPageDisplayed() {
        try {
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.visibilityOfElementLocated(emailInput),
                    ExpectedConditions.visibilityOfElementLocated(pageHeading)
            ));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isDashboardDisplayed() {
        try {
            // After login, URL should not contain /login
            wait.until(d -> !d.getCurrentUrl().contains("/login"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getErrorMessage() {
        if (isPresent(errorMessage)) return getText(errorMessage);
        return "";
    }

    public boolean isErrorDisplayed() {
        return isPresent(errorMessage) && isDisplayed(errorMessage);
    }
}
