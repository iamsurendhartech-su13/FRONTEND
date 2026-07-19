package com.employee.automation.base;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * BasePage — Parent class for all Page Object classes.
 * Contains reusable, retry-safe Selenium helper methods.
 */
public class BasePage {

    protected static final Logger log = LogManager.getLogger(BasePage.class);
    protected final WebDriver driver;
    protected final WebDriverWait wait;
    private static final int DEFAULT_TIMEOUT = 15;
    private static final int RETRY_COUNT     = 3;
    private static final int RETRY_DELAY_MS  = 300;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
    }

    // ===================================================================
    //  Core Interactions
    // ===================================================================

    protected void click(By locator) {
        for (int attempt = 1; attempt <= RETRY_COUNT; attempt++) {
            try {
                WebElement el = wait.until(ExpectedConditions.elementToBeClickable(locator));
                scrollIntoView(el);
                el.click();
                return;
            } catch (StaleElementReferenceException | ElementClickInterceptedException e) {
                if (attempt == RETRY_COUNT) throw new RuntimeException("click() failed after " + RETRY_COUNT + " attempts: " + locator, e);
                sleep(RETRY_DELAY_MS);
            }
        }
    }

    protected void jsClick(By locator) {
        WebElement el = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", el);
    }

    protected void type(By locator, String text) {
        for (int attempt = 1; attempt <= RETRY_COUNT; attempt++) {
            try {
                WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
                scrollIntoView(el);
                el.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.BACK_SPACE);
                if (text != null && !text.isEmpty()) el.sendKeys(text);
                return;
            } catch (StaleElementReferenceException e) {
                if (attempt == RETRY_COUNT) throw new RuntimeException("type() failed after " + RETRY_COUNT + " attempts: " + locator, e);
                sleep(RETRY_DELAY_MS);
            }
        }
    }

    protected void clearAndType(By locator, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        el.clear();
        if (text != null) el.sendKeys(text);
    }

    protected void selectByVisibleText(By locator, String text) {
        if (text == null || text.isBlank()) return;
        for (int attempt = 1; attempt <= RETRY_COUNT; attempt++) {
            try {
                WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
                scrollIntoView(el);
                Select select = new Select(el);
                try {
                    select.selectByVisibleText(text);
                } catch (NoSuchElementException nse) {
                    // Fallback: case-insensitive match
                    select.getOptions().stream()
                            .filter(o -> o.getText().trim().equalsIgnoreCase(text.trim()))
                            .findFirst()
                            .ifPresent(WebElement::click);
                }
                return;
            } catch (StaleElementReferenceException e) {
                if (attempt == RETRY_COUNT) throw new RuntimeException("selectByVisibleText() failed: " + text, e);
                sleep(RETRY_DELAY_MS);
            }
        }
    }

    // ===================================================================
    //  Waits & Visibility
    // ===================================================================

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement waitForClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected void waitForInvisible(By locator) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    protected boolean isDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }

    protected boolean isPresent(By locator) {
        return !driver.findElements(locator).isEmpty();
    }

    protected List<WebElement> findAll(By locator) {
        return driver.findElements(locator);
    }

    // ===================================================================
    //  Text Retrieval
    // ===================================================================

    protected String getText(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText().trim();
    }

    protected String getAttribute(By locator, String attribute) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator)).getAttribute(attribute);
    }

    // ===================================================================
    //  Alerts
    // ===================================================================

    protected void acceptAlert() {
        try {
            wait.until(ExpectedConditions.alertIsPresent()).accept();
            log.info("Alert accepted.");
        } catch (Exception e) {
            log.warn("No alert present to accept.");
        }
    }

    protected String getAlertText() {
        return wait.until(ExpectedConditions.alertIsPresent()).getText();
    }

    // ===================================================================
    //  Scroll & Utility
    // ===================================================================

    protected void scrollIntoView(WebElement element) {
        try {
            ((JavascriptExecutor) driver)
                    .executeScript("arguments[0].scrollIntoView({behavior:'instant',block:'center'});", element);
        } catch (Exception ignored) {}
    }

    protected void scrollToTop() {
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, 0);");
    }

    protected void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
    }

    protected void navigateTo(String url) {
        driver.get(url);
        log.info("Navigated to: {}", url);
    }

    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    protected String getTitle() {
        return driver.getTitle();
    }

    protected int countElements(By locator) {
        return driver.findElements(locator).size();
    }
}
