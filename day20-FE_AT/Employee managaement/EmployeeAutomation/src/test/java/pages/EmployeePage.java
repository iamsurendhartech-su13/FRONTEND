package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class EmployeePage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    // Navigation and Logout
    private final By employeesLink = By.xpath("//a[contains(@href, '/employees')]");
    private final By logoutButton = By.cssSelector("button[title='Logout']");

    // Directory Page
    private final By addEmployeeButton = By.xpath("//button[contains(., 'Add Employee')]");
    private final By searchBox = By.cssSelector("input[placeholder*='Search by name']");
    
    // Modal Form Elements
    private final By nameInput = By.xpath("//label[contains(text(), 'Full Name')]/following-sibling::input");
    private final By emailInput = By.xpath("//label[contains(text(), 'Email Address')]/following-sibling::input");
    private final By phoneInput = By.xpath("//label[contains(text(), 'Phone Number')]/following-sibling::input");
    private final By salaryInput = By.xpath("//label[contains(text(), 'Salary')]/following-sibling::input");
    private final By departmentSelect = By.xpath("//label[contains(text(), 'Department')]/following-sibling::select");
    private final By designationInput = By.xpath("//label[contains(text(), 'Designation')]/following-sibling::input");
    private final By genderSelect = By.xpath("//label[contains(text(), 'Gender')]/following-sibling::select");
    
    private final By saveButton = By.xpath("//button[@form='empForm']");

    // Details Page Elements
    private final By detailName = By.cssSelector("h1");
    private final By detailDesignation = By.cssSelector("h1 + p");
    private final By detailEmail = By.xpath("//span[contains(text(), '@')]");
    private final By detailDepartment = By.xpath("//span[contains(text(), 'Department:')]");
    private final By detailSalary = By.xpath("//span[contains(text(), 'Salary:')]");
    private final By backToDirectoryButton = By.xpath("//button[contains(., 'Back to Directory')]");

    public EmployeePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    private void scrollToElement(WebElement element) {
        try {
            ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", element);
            Thread.sleep(100);
        } catch (Exception ignored) {}
    }

    private void safeClick(By locator) {
        int attempts = 0;
        while (attempts < 3) {
            try {
                WebElement el = wait.until(ExpectedConditions.elementToBeClickable(locator));
                scrollToElement(el);
                el.click();
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts >= 3) throw new RuntimeException("Failed to click element: " + locator, e);
                try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            }
        }
    }

    private void safeType(By locator, String text) {
        int attempts = 0;
        while (attempts < 3) {
            try {
                WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
                scrollToElement(el);
                el.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), org.openqa.selenium.Keys.BACK_SPACE);
                if (text != null) {
                    el.sendKeys(text);
                }
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts >= 3) throw new RuntimeException("Failed to type into: " + locator, e);
                try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            }
        }
    }

    private void safeSelect(By locator, String value) {
        if (value != null && !value.isEmpty()) {
            int attempts = 0;
            while (attempts < 3) {
                try {
                    WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
                    scrollToElement(el);
                    Select select = new Select(el);
                    try {
                        select.selectByVisibleText(value);
                    } catch (org.openqa.selenium.NoSuchElementException nse) {
                        boolean found = false;
                        for (WebElement option : select.getOptions()) {
                            if (option.getText().trim().equalsIgnoreCase(value.trim())) {
                                select.selectByVisibleText(option.getText());
                                found = true;
                                break;
                            }
                        }
                        if (!found) throw nse;
                    }
                    return;
                } catch (Exception e) {
                    attempts++;
                    if (attempts >= 3) throw new RuntimeException("Failed to select option: " + value, e);
                    try { Thread.sleep(300); } catch (InterruptedException ignored) {}
                }
            }
        }
    }

    public void navigateToEmployeePage() {
        safeClick(employeesLink);
    }

    public void clickAddEmployee() {
        safeClick(addEmployeeButton);
    }

    private boolean isElementPresent(By locator) {
        try {
            return driver.findElements(locator).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public void fillEmployeeForm(String name, String email, String phone, String department, String designation, String gender, String salary) {
        if (name != null) safeType(nameInput, name);
        if (email != null) safeType(emailInput, email);
        if (phone != null) safeType(phoneInput, phone);
        if (department != null) safeSelect(departmentSelect, department);
        if (designation != null) safeType(designationInput, designation);
        if (gender != null && isElementPresent(genderSelect)) {
            safeSelect(genderSelect, gender);
        }
        if (salary != null) safeType(salaryInput, salary);
    }

    public void clickSave() {
        safeClick(saveButton);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(saveButton));
    }

    public void searchEmployee(String query) {
        safeType(searchBox, query);
    }

    public void clearSearch() {
        safeType(searchBox, "");
    }

    private By getRowByEmail(String email) {
        return By.xpath("//table/tbody/tr[td[1]//p[text()='" + email + "']]");
    }

    public boolean isEmployeeInList(String email) {
        try {
            WebElement row = wait.until(ExpectedConditions.visibilityOfElementLocated(getRowByEmail(email)));
            return row.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmployeeIdByEmail(String email) {
        By idLocator = By.xpath("//table/tbody/tr[td[1]//p[text()='" + email + "']]/td[2]");
        return wait.until(ExpectedConditions.visibilityOfElementLocated(idLocator)).getText().trim();
    }

    public void clickViewEmployee(String email) {
        By viewButton = By.xpath("//table/tbody/tr[td[1]//p[text()='" + email + "']]//button[1]");
        safeClick(viewButton);
    }

    public void clickEditEmployee(String email) {
        By editButton = By.xpath("//table/tbody/tr[td[1]//p[text()='" + email + "']]//button[2]");
        safeClick(editButton);
    }

    public void clickDeleteEmployee(String email) {
        By deleteButton = By.xpath("//table/tbody/tr[td[1]//p[text()='" + email + "']]//button[3]");
        safeClick(deleteButton);
    }

    public void acceptAlert() {
        try {
            wait.until(ExpectedConditions.alertIsPresent()).accept();
        } catch (Exception ignored) {}
    }

    public void waitForEmployeeToDisappear(String email) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(getRowByEmail(email)));
    }

    public String getDetailName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(detailName)).getText();
    }

    public String getDetailDesignation() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(detailDesignation)).getText();
    }

    public String getDetailEmail() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(detailEmail)).getText();
    }

    public String getDetailDepartment() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(detailDepartment)).getText();
    }

    public String getDetailSalary() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(detailSalary)).getText();
    }

    public void clickBackToDirectory() {
        safeClick(backToDirectoryButton);
    }

    public void logout() {
        int attempts = 0;
        while (attempts < 3) {
            try {
                WebElement el = wait.until(ExpectedConditions.presenceOfElementLocated(logoutButton));
                scrollToElement(el);
                org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
                js.executeScript("arguments[0].click();", el);
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts >= 3) throw new RuntimeException("Logout failed", e);
                try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            }
        }
    }
}
