package com.employee.automation.stepdefinitions;

import com.employee.automation.hooks.Hooks;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.utilities.ConfigReader;
import io.cucumber.java.en.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.openqa.selenium.WebDriver;

/**
 * LoginSteps — Cucumber step definitions for login.feature.
 */
public class LoginSteps {

    private static final Logger log = LogManager.getLogger(LoginSteps.class);
    private final ConfigReader config = ConfigReader.getInstance();
    private LoginPage loginPage;

    private WebDriver getDriver() { return Hooks.getDriver(); }

    // ===================================================================
    //  Given Steps
    // ===================================================================

    @Given("I open the application")
    public void iOpenTheApplication() {
        loginPage = new LoginPage(getDriver());
        loginPage.navigateToLogin(config.getBaseUrl());
        log.info("LoginSteps: Application opened at {}/login", config.getBaseUrl());
        Hooks.getTest().info("Application opened: " + config.getBaseUrl() + "/login");
    }

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        if (loginPage == null) loginPage = new LoginPage(getDriver());
        getDriver().get(config.getBaseUrl() + "/login");
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page is not displayed.");
        Hooks.getTest().info("Verified: Login page is displayed.");
    }

    // ===================================================================
    //  When Steps
    // ===================================================================

    @When("I enter valid credentials")
    public void iEnterValidCredentials() {
        loginPage.login(config.getAdminEmail(), config.getAdminPassword());
        log.info("LoginSteps: Valid credentials submitted.");
        Hooks.getTest().info("Valid credentials entered and submitted.");
    }

    @When("I enter email {string} and password {string}")
    public void iEnterEmailAndPassword(String email, String password) {
        loginPage.login(email, password);
        log.info("LoginSteps: Credentials entered — email: {}", email);
        Hooks.getTest().info("Credentials submitted — email: " + email);
    }

    @When("I enter only the email {string}")
    public void iEnterOnlyEmail(String email) {
        loginPage.enterEmail(email);
        loginPage.clickLogin();
    }

    @When("I enter only the password {string}")
    public void iEnterOnlyPassword(String password) {
        loginPage.enterPassword(password);
        loginPage.clickLogin();
    }

    @When("I submit empty credentials")
    public void iSubmitEmptyCredentials() {
        loginPage.clickLogin();
    }

    // ===================================================================
    //  Then Steps
    // ===================================================================

    @Then("I should be on the dashboard")
    public void iShouldBeOnTheDashboard() {
        Assert.assertTrue(loginPage.isDashboardDisplayed(),
                "Dashboard is not displayed after login. Current URL: " + getDriver().getCurrentUrl());
        log.info("LoginSteps: Dashboard verified.");
        Hooks.getTest().pass("Dashboard displayed after successful login.");
    }

    @Then("I should see a login error message")
    public void iShouldSeeALoginErrorMessage() {
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Expected login error message was not displayed.");
        Hooks.getTest().info("Login error message confirmed: " + loginPage.getErrorMessage());
    }

    @Then("I should remain on the login page")
    public void iShouldRemainOnTheLoginPage() {
        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Expected to remain on login page but navigated away.");
        Hooks.getTest().info("Confirmed: User remained on login page.");
    }
}
