package com.employee.automation.base;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.DriverFactory;
import com.employee.automation.utilities.ExtentManager;
import com.employee.automation.utilities.ScreenshotUtility;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;

import java.io.File;
import java.io.IOException;
import java.net.Socket;

/**
 * BaseTest — Parent class for all TestNG test classes.
 * Handles: WebDriver lifecycle, server auto-start, Extent Reports.
 */
public class BaseTest {

    protected static final Logger log = LogManager.getLogger(BaseTest.class);
    protected static ExtentReports extent;
    protected static ExtentTest testNode;

    protected static final ConfigReader config = ConfigReader.getInstance();
    private static Process frontendProcess;
    private static Process backendProcess;
    private static boolean frontendStarted = false;
    private static boolean backendStarted  = false;

    private final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    public WebDriver getDriver() {
        return driverThreadLocal.get();
    }

    // ===================================================================
    //  Suite Setup
    // ===================================================================

    @BeforeSuite(alwaysRun = true)
    public static void suiteSetup() {
        // Start backend if offline
        if (!isPortOpen(5000)) {
            log.info("Starting Node.js backend on port 5000...");
            backendProcess  = startProcess("../backend", "npm start");
            if (backendProcess == null) backendProcess = startProcess("e:/html placement/Employee managaement/backend", "npm start");
            backendStarted  = waitForPort(5000, 60);
            if (backendStarted) log.info("Backend started on port 5000.");
            else                log.warn("Backend did not start within 60s.");
        } else {
            log.info("Backend already running on port 5000.");
        }

        // Start frontend if offline
        if (!isPortOpen(3001)) {
            log.info("Starting React frontend on port 3001...");
            frontendProcess = startProcess("../Empoyee-management", "npm run dev");
            if (frontendProcess == null) frontendProcess = startProcess("e:/html placement/Employee managaement/Empoyee-management", "npm run dev");
            frontendStarted = waitForPort(3001, 45);
            if (frontendStarted) log.info("Frontend started on port 3001.");
            else                 log.warn("Frontend did not start within 45s.");
        } else {
            log.info("Frontend already running on port 3001.");
        }

        // Init Extent Reports
        extent = ExtentManager.getInstance();
        log.info("BaseTest suite setup complete.");
    }

    // ===================================================================
    //  Method Setup / Teardown
    // ===================================================================

    @BeforeMethod(alwaysRun = true)
    @Parameters("browser")
    public void methodSetup(@Optional("chrome") String browser) {
        WebDriver driver = DriverFactory.createDriver(browser);
        driverThreadLocal.set(driver);
        log.info("WebDriver ({}) initialized.", browser);
    }

    @AfterMethod(alwaysRun = true)
    public void methodTearDown(ITestResult result) {
        WebDriver driver = getDriver();
        if (driver != null) {
            if (result.getStatus() == ITestResult.FAILURE) {
                String path = ScreenshotUtility.captureScreenshot(driver, result.getName());
                log.error("FAILED: {} — screenshot: {}", result.getName(), path);
                if (testNode != null) {
                    testNode.fail(result.getThrowable());
                    testNode.addScreenCaptureFromPath(path, "Failure Screenshot");
                }
            } else if (result.getStatus() == ITestResult.SUCCESS) {
                if (testNode != null) testNode.pass("Test PASSED: " + result.getName());
            } else if (result.getStatus() == ITestResult.SKIP) {
                if (testNode != null) testNode.skip("Test SKIPPED: " + result.getName());
            }
            driver.quit();
            driverThreadLocal.remove();
            log.info("WebDriver closed.");
        }
    }

    // ===================================================================
    //  Suite Teardown
    // ===================================================================

    @AfterSuite(alwaysRun = true)
    public static void suiteTearDown() {
        ExtentManager.flush();

        if (frontendStarted && frontendProcess != null) {
            killProcess(frontendProcess, "Frontend");
        }
        if (backendStarted && backendProcess != null) {
            killProcess(backendProcess, "Backend");
        }
    }

    // ===================================================================
    //  Server Management Helpers
    // ===================================================================

    private static boolean isPortOpen(int port) {
        try (Socket s = new Socket("127.0.0.1", port)) { return true; }
        catch (IOException e) {
            try (Socket s2 = new Socket("::1", port)) { return true; }
            catch (IOException e2) { return false; }
        }
    }

    private static Process startProcess(String directory, String command) {
        try {
            File dir = new File(directory);
            if (!dir.exists()) return null;
            File logDir = new File("logs");
            if (!logDir.exists()) logDir.mkdirs();

            ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", command);
            pb.directory(dir);
            pb.redirectOutput(new File("logs/" + command.replace(" ", "_") + ".log"));
            pb.redirectError(new File("logs/" + command.replace(" ", "_") + "_err.log"));
            return pb.start();
        } catch (IOException e) {
            log.error("Failed to start process '{}' in '{}': {}", command, directory, e.getMessage());
            return null;
        }
    }

    private static boolean waitForPort(int port, int timeoutSeconds) {
        long start = System.currentTimeMillis();
        while (System.currentTimeMillis() - start < timeoutSeconds * 1000L) {
            if (isPortOpen(port)) return true;
            try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
        return false;
    }

    private static void killProcess(Process process, String name) {
        try {
            Runtime.getRuntime().exec(new String[]{"taskkill", "/F", "/T", "/PID", String.valueOf(process.pid())}).waitFor();
            log.info("{} process stopped.", name);
        } catch (Exception e) {
            log.error("Failed to stop {} process: {}", name, e.getMessage());
        }
    }
}
