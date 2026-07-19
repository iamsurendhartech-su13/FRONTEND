package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class AddEmployeePage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By employeesLink = By.xpath("//a[contains(@href, '/employees')]");
    private final By addEmployeeButton = By.id("btn-add-employee");
    private final By nameInput = By.id("input-name");
    private final By emailInput = By.id("input-email");
    private final By phoneInput = By.id("input-phone");
    private final By genderSelect = By.id("input-gender");
    private final By departmentSelect = By.id("input-department");
    private final By designationInput = By.id("input-designation");
    private final By salaryInput = By.id("input-salary");
    private final By joiningDateInput = By.id("input-joining-date");
    private final By saveButton = By.id("btn-submit-employee");
    
    // Toast Success Message
    private final By toastMessage = By.xpath("//div[contains(@class, 'Toastify__toast--success') and (contains(., 'Employee') or contains(., 'Added'))]");

    public AddEmployeePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    private void scrollToElement(WebElement element) {
        try {
            ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", element);
        } catch (Exception ignored) {}
    }

    public void navigateToEmployeePage() {
        WebElement empLink = wait.until(ExpectedConditions.elementToBeClickable(employeesLink));
        scrollToElement(empLink);
        empLink.click();
    }

    public void clickAddEmployee() {
        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(addEmployeeButton));
        scrollToElement(addBtn);
        addBtn.click();
    }

    public void fillEmployeeForm(String name, String email, String phone, String department, String designation, String salary, String gender) {
        // Name
        WebElement nameEl = wait.until(ExpectedConditions.visibilityOfElementLocated(nameInput));
        scrollToElement(nameEl);
        nameEl.clear();
        nameEl.sendKeys(name);

        // Email
        WebElement emailEl = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInput));
        scrollToElement(emailEl);
        emailEl.clear();
        emailEl.sendKeys(email);

        // Phone
        WebElement phoneEl = wait.until(ExpectedConditions.visibilityOfElementLocated(phoneInput));
        scrollToElement(phoneEl);
        phoneEl.clear();
        phoneEl.sendKeys(phone);

        // Gender
        WebElement genderEl = wait.until(ExpectedConditions.visibilityOfElementLocated(genderSelect));
        scrollToElement(genderEl);
        Select genderSel = new Select(genderEl);
        genderSel.selectByVisibleText(gender);

        // Department
        WebElement deptEl = wait.until(ExpectedConditions.visibilityOfElementLocated(departmentSelect));
        scrollToElement(deptEl);
        Select deptSel = new Select(deptEl);
        deptSel.selectByVisibleText(department);

        // Designation
        WebElement desigEl = wait.until(ExpectedConditions.visibilityOfElementLocated(designationInput));
        scrollToElement(desigEl);
        desigEl.clear();
        desigEl.sendKeys(designation);

        // Salary
        WebElement salaryEl = wait.until(ExpectedConditions.visibilityOfElementLocated(salaryInput));
        scrollToElement(salaryEl);
        salaryEl.clear();
        salaryEl.sendKeys(salary);

        // Set a default Joining Date to bypass validation if required by UI
        if (driver.findElements(joiningDateInput).size() > 0) {
            WebElement dateEl = driver.findElement(joiningDateInput);
            scrollToElement(dateEl);
            dateEl.sendKeys("15-08-2024");
        }
    }

    public void clickSave() {
        WebElement saveBtn = wait.until(ExpectedConditions.elementToBeClickable(saveButton));
        scrollToElement(saveBtn);
        saveBtn.click();
    }

    public boolean isSuccessMessageDisplayed() {
        try {
            WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(toastMessage));
            return toast.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getSuccessMessageText() {
        try {
            WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(toastMessage));
            return toast.getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getEmployeeIdByEmail(String email) {
        By idLocator = By.xpath("//tr[@data-email='" + email + "']//td[contains(@class,'employee-id')]");
        WebElement idEl = wait.until(ExpectedConditions.visibilityOfElementLocated(idLocator));
        return idEl.getText().trim();
    }
}
