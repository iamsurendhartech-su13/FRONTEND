package base;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import utils.DriverFactory;
import utils.ScreenshotUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.Properties;

public class BaseTest {

    protected static final Logger log = LogManager.getLogger(BaseTest.class);
    protected static ExtentReports extent;
    protected static ExtentTest testNode;
    protected static Properties config = new Properties();

    protected ThreadLocal<WebDriver> driver = new ThreadLocal<>();
    
    private static Process serverProcess;
    private static boolean serverStartedByTest = false;
    private static Process backendProcess;
    private static boolean backendStartedByTest = false;

    public WebDriver getDriver() {
        return driver.get();
    }

    private static boolean isServerRunning(int port) {
        try (Socket socket = new Socket("127.0.0.1", port)) {
            return true;
        } catch (IOException e) {
            try (Socket socket2 = new Socket("::1", port)) {
                return true;
            } catch (IOException e2) {
                return false;
            }
        }
    }

    @BeforeSuite
    public static void beforeSuiteSetup() {
        // Load properties
        try (FileInputStream fis = new FileInputStream("src/test/resources/config.properties")) {
            config.load(fis);
            log.info("Configuration properties loaded successfully.");
        } catch (IOException e) {
            log.error("Failed to load config.properties file: " + e.getMessage());
        }

        // NOTE: Database deletion is intentionally DISABLED so that employees
        // added during automation remain visible in Postman and the live frontend.
        // To re-enable isolation mode, uncomment the block below.
        /*
        File dbFile = new File("../backend/database.sqlite");
        if (!dbFile.exists()) dbFile = new File("backend/database.sqlite");
        if (!dbFile.exists()) dbFile = new File("e:/html placement/Employee managaement/backend/database.sqlite");
        if (dbFile.exists()) {
            log.info("Deleting existing database for clean execution...");
            dbFile.delete();
        }
        */

        // Check/Start Backend
        if (!isServerRunning(5000)) {
            log.info("Backend server is offline. Starting backend server programmatically...");
            try {
                File directory = new File("../backend");
                if (!directory.exists()) directory = new File("backend");
                if (!directory.exists()) directory = new File("e:/html placement/Employee managaement/backend");

                ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", "npm start");
                pb.directory(directory);
                File logFile = new File("logs/backend_startup.log");
                if (!logFile.getParentFile().exists()) logFile.getParentFile().mkdirs();
                pb.redirectOutput(logFile);
                pb.redirectError(logFile);

                backendProcess = pb.start();
                backendStartedByTest = true;

                long start = System.currentTimeMillis();
                boolean started = false;
                while (System.currentTimeMillis() - start < 60000) {  // increased from 30s to 60s
                    if (isServerRunning(5000)) {
                        started = true;
                        break;
                    }
                    Thread.sleep(1000);
                }
                if (started) {
                    log.info("Backend server started successfully on port 5000.");
                } else {
                    log.warn("Timed out waiting for backend server to respond on port 5000.");
                }
            } catch (Exception e) {
                log.error("Failed to start backend server: " + e.getMessage());
            }
        }

        // Check/Start Frontend
        if (!isServerRunning(3001)) {
            log.info("Frontend server is offline. Starting frontend server programmatically...");
            try {
                File directory = new File("../Empoyee-management");
                if (!directory.exists()) directory = new File("Empoyee-management");
                if (!directory.exists()) directory = new File("e:/html placement/Employee managaement/Empoyee-management");

                ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", "npm run dev");
                pb.directory(directory);
                File logFile = new File("logs/server_startup.log");
                if (!logFile.getParentFile().exists()) logFile.getParentFile().mkdirs();
                pb.redirectOutput(logFile);
                pb.redirectError(logFile);

                serverProcess = pb.start();
                serverStartedByTest = true;

                long start = System.currentTimeMillis();
                boolean started = false;
                while (System.currentTimeMillis() - start < 30000) {
                    if (isServerRunning(3001)) {
                        started = true;
                        break;
                    }
                    Thread.sleep(1000);
                }
                if (started) {
                    log.info("Frontend server started successfully on port 3001.");
                } else {
                    log.warn("Timed out waiting for frontend server to respond on port 3001.");
                }
            } catch (Exception e) {
                log.error("Failed to start frontend server: " + e.getMessage());
            }
        }

        // Extent Report Init
        File reportDir = new File("reports");
        if (!reportDir.exists()) reportDir.mkdirs();

        ExtentSparkReporter htmlReporter = new ExtentSparkReporter("reports/ExtentReport.html");
        htmlReporter.config().setTheme(Theme.DARK);
        htmlReporter.config().setDocumentTitle("Employee Module Automation Report");
        htmlReporter.config().setReportName("Employee Module Test Execution Spark Report");

        extent = new ExtentReports();
        extent.attachReporter(htmlReporter);
        extent.setSystemInfo("Host Name", "Localhost");
        extent.setSystemInfo("Environment", "Local QA");
        extent.setSystemInfo("User Name", "Senior QA Automation Engineer");
        extent.setSystemInfo("OS", System.getProperty("os.name"));
        extent.setSystemInfo("Browser", "Chrome");
    }

    @BeforeMethod
    public void setup() {
        log.info("Setting up WebDriver instances for execution...");
        WebDriver webDriver = DriverFactory.createDriver();
        driver.set(webDriver);
        log.info("WebDriver initiated and thread local binding complete.");
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        WebDriver webDriver = getDriver();
        if (webDriver != null) {
            if (result.getStatus() == ITestResult.FAILURE) {
                String screenshotPath = ScreenshotUtil.captureScreenshot(webDriver, result.getName());
                log.error("Test failed: " + result.getName() + ". Screenshot captured at: " + screenshotPath);
                if (testNode != null) {
                    testNode.fail("Test Case FAILED: " + result.getThrowable());
                    testNode.addScreenCaptureFromPath(screenshotPath);
                }
            } else if (result.getStatus() == ITestResult.SUCCESS) {
                log.info("Test passed: " + result.getName());
                if (testNode != null) {
                    testNode.pass("Test Case PASSED: " + result.getName());
                }
            } else if (result.getStatus() == ITestResult.SKIP) {
                log.warn("Test skipped: " + result.getName());
                if (testNode != null) {
                    testNode.skip("Test Case SKIPPED: " + result.getName());
                }
            }
            webDriver.quit();
            log.info("WebDriver closed and session destroyed.");
        }
    }

    @AfterSuite(alwaysRun = true)
    public static void afterSuiteTearDown() {
        if (extent != null) {
            extent.flush();
            log.info("Extent report flushed and written to disk.");
        }

        // Terminate Programmatic servers
        if (serverStartedByTest && serverProcess != null) {
            log.info("Stopping frontend dev server...");
            try {
                Runtime.getRuntime().exec("taskkill /F /T /PID " + serverProcess.pid()).waitFor();
                log.info("Frontend process tree terminated successfully.");
            } catch (Exception e) {
                log.error("Failed to stop frontend dev server process: " + e.getMessage());
            }
        }
        if (backendStartedByTest && backendProcess != null) {
            log.info("Stopping backend server...");
            try {
                Runtime.getRuntime().exec("taskkill /F /T /PID " + backendProcess.pid()).waitFor();
                log.info("Backend process tree terminated successfully.");
            } catch (Exception e) {
                log.error("Failed to stop backend server process: " + e.getMessage());
            }
        }
    }
}
