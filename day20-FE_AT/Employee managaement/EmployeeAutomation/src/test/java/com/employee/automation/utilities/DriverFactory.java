package com.employee.automation.utilities;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

/**
 * DriverFactory — Creates WebDriver instances based on configured browser.
 * Supports Chrome, Firefox, Edge. Headless mode configurable.
 */
public class DriverFactory {

    private static final Logger log = LogManager.getLogger(DriverFactory.class);

    private DriverFactory() {}

    /**
     * Creates a WebDriver instance for the given browser.
     *
     * @param browser "chrome" | "firefox" | "edge"  (case-insensitive)
     * @return Configured WebDriver instance
     */
    public static WebDriver createDriver(String browser) {
        if (browser == null || browser.isBlank()) browser = "chrome";
        log.info("DriverFactory: Creating {} WebDriver...", browser.toLowerCase());

        switch (browser.toLowerCase().trim()) {

            case "firefox" -> {
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions options = new FirefoxOptions();
                options.addArguments("--width=1920", "--height=1080");
                return new FirefoxDriver(options);
            }

            case "edge" -> {
                WebDriverManager.edgedriver().setup();
                EdgeOptions options = new EdgeOptions();
                options.addArguments("--remote-allow-origins=*", "--no-sandbox",
                        "--disable-dev-shm-usage", "--window-size=1920,1080");
                return new EdgeDriver(options);
            }

            default -> {
                WebDriverManager.chromedriver().setup();
                ChromeOptions options = new ChromeOptions();
                options.addArguments("--remote-allow-origins=*");
                options.addArguments("--disable-gpu");
                options.addArguments("--no-sandbox");
                options.addArguments("--disable-dev-shm-usage");
                options.addArguments("--window-size=1920,1080");
                options.addArguments("--disable-extensions");
                options.addArguments("--start-maximized");
                return new ChromeDriver(options);
            }
        }
    }

    /**
     * Creates Chrome driver with default settings.
     */
    public static WebDriver createDriver() {
        return createDriver("chrome");
    }
}
