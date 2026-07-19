package com.employee.automation.utilities;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ScreenshotUtility — Captures screenshots on test failure.
 * Saves to screenshots/ directory with timestamp and test name.
 */
public class ScreenshotUtility {

    private static final Logger log = LogManager.getLogger(ScreenshotUtility.class);
    private static final String SCREENSHOT_DIR = "screenshots";

    private ScreenshotUtility() {}

    /**
     * Captures a screenshot and returns the absolute file path.
     *
     * @param driver   Active WebDriver instance
     * @param testName Name of the test for file naming
     * @return Absolute path to the saved screenshot file, or empty string on failure
     */
    public static String captureScreenshot(WebDriver driver, String testName) {
        try {
            File screenshotDir = new File(SCREENSHOT_DIR);
            if (!screenshotDir.exists()) screenshotDir.mkdirs();

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String safeTestName = testName.replaceAll("[^a-zA-Z0-9_\\-]", "_");
            String fileName = safeTestName + "_" + timestamp + ".png";

            File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            File destFile = new File(screenshotDir, fileName);

            Files.copy(srcFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            String absolutePath = destFile.getAbsolutePath();
            log.info("Screenshot saved: " + absolutePath);
            return absolutePath;

        } catch (IOException e) {
            log.error("Failed to capture screenshot for test '" + testName + "': " + e.getMessage());
            return "";
        }
    }

    /**
     * Returns screenshot as Base64 string (for embedding in HTML reports).
     */
    public static String captureScreenshotAsBase64(WebDriver driver) {
        try {
            return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
        } catch (Exception e) {
            log.error("Failed to capture Base64 screenshot: " + e.getMessage());
            return "";
        }
    }
}
