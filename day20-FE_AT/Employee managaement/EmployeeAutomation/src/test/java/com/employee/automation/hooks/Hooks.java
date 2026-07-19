package com.employee.automation.hooks;

import com.aventstack.extentreports.ExtentTest;
import com.employee.automation.base.BasePage;
import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.DriverFactory;
import com.employee.automation.utilities.ExtentManager;
import com.employee.automation.utilities.ScreenshotUtility;
import io.cucumber.java.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;

import java.net.Socket;

/**
 * Hooks — Cucumber lifecycle hooks for setup/teardown, Extent Reports, screenshots.
 */
public class Hooks {

    private static final Logger log = LogManager.getLogger(Hooks.class);

    // Shared WebDriver holder for Cucumber step context
    private static final ThreadLocal<WebDriver> driverHolder = new ThreadLocal<>();
    private static final ThreadLocal<ExtentTest> testHolder  = new ThreadLocal<>();

    // ===================================================================
    //  Static accessor (used by step definitions)
    // ===================================================================

    public static WebDriver getDriver() {
        return driverHolder.get();
    }

    public static ExtentTest getTest() {
        return testHolder.get();
    }

    public static void setTest(ExtentTest test) {
        testHolder.set(test);
    }

    // ===================================================================
    //  Before Each Scenario
    // ===================================================================

    @Before(order = 1)
    public void beforeScenario(Scenario scenario) {
        log.info("=== SCENARIO START: {} ===", scenario.getName());

        // Initialize Extent test node for this scenario
        ExtentTest test = ExtentManager.getInstance().createTest(
                scenario.getName(),
                String.join(", ", scenario.getSourceTagNames())
        );
        testHolder.set(test);

        // Create WebDriver
        WebDriver driver = DriverFactory.createDriver();
        driverHolder.set(driver);

        // Start servers if needed (if BaseTest hasn't done it yet)
        ensureServersRunning();

        log.info("Hooks: WebDriver initialized for scenario: {}", scenario.getName());
    }

    // ===================================================================
    //  After Each Scenario
    // ===================================================================

    @After(order = 1)
    public void afterScenario(Scenario scenario) {
        WebDriver driver = driverHolder.get();
        ExtentTest test  = testHolder.get();

        if (scenario.isFailed()) {
            log.error("SCENARIO FAILED: {}", scenario.getName());
            if (driver != null) {
                // Capture screenshot and embed in report
                byte[] screenshotBytes = ((org.openqa.selenium.TakesScreenshot) driver)
                        .getScreenshotAs(org.openqa.selenium.OutputType.BYTES);
                scenario.attach(screenshotBytes, "image/png", "Failure Screenshot");

                // Save to file and attach to Extent Report
                String path = ScreenshotUtility.captureScreenshot(driver, scenario.getName());
                if (test != null && !path.isEmpty()) {
                    test.fail("Scenario FAILED: " + scenario.getName());
                    test.addScreenCaptureFromPath(path, "Failure Screenshot");
                }
            }
        } else {
            log.info("SCENARIO PASSED: {}", scenario.getName());
            if (test != null) test.pass("Scenario PASSED: " + scenario.getName());
        }

        if (driver != null) {
            driver.quit();
            driverHolder.remove();
            log.info("Hooks: WebDriver closed after scenario: {}", scenario.getName());
        }

        ExtentManager.flush();
    }

    // ===================================================================
    //  Server Health Check
    // ===================================================================

    private void ensureServersRunning() {
        if (!isPortOpen(5000)) log.warn("Backend (port 5000) not reachable! Tests may fail.");
        if (!isPortOpen(3001)) log.warn("Frontend (port 3001) not reachable! Tests may fail.");
    }

    private boolean isPortOpen(int port) {
        try (Socket s = new Socket("127.0.0.1", port)) { return true; }
        catch (Exception e) { return false; }
    }
}
