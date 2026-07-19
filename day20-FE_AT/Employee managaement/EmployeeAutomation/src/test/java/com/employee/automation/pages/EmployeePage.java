package com.employee.automation.pages;

import com.employee.automation.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

/**
 * EmployeePage — Page Object for the Employee Directory and Add/Edit Modal.
 * URL: /employees
 * Uses unique IDs added to the React components for reliable automation.
 */
public class EmployeePage extends BasePage {

    // ===================================================================
    //  Navigation
    // ===================================================================
    private final By employeesNavLink    = By.xpath("//a[contains(@href,'/employees')]");
    private final By logoutButton        = By.cssSelector("button[title='Logout']");

    // ===================================================================
    //  Directory Page
    // ===================================================================
    private final By addEmployeeButton   = By.id("btn-add-employee");
    private final By searchBox           = By.id("employee-search");
    private final By employeeTable       = By.id("employee-table");
    private final By employeeTableBody   = By.id("employee-table-body");
    private final By employeeTotalCount  = By.id("employee-total-count");
    private final By filteredCount       = By.id("employee-filtered-count");
    private final By noResultsRow        = By.id("no-results-row");
    private final By paginationControls  = By.id("pagination-controls");
    private final By prevPageBtn         = By.id("btn-prev-page");
    private final By nextPageBtn         = By.id("btn-next-page");
    private final By paginationInfo      = By.id("pagination-info");

    // ===================================================================
    //  Modal Form
    // ===================================================================
    private final By modalOverlay        = By.id("modal-overlay");
    private final By employeeModal       = By.id("employee-modal");
    private final By modalTitle          = By.id("modal-title");
    private final By nameInput           = By.id("input-name");
    private final By emailInput          = By.id("input-email");
    private final By phoneInput          = By.id("input-phone");
    private final By genderSelect        = By.id("input-gender");
    private final By departmentSelect    = By.id("input-department");
    private final By designationInput    = By.id("input-designation");
    private final By salaryInput         = By.id("input-salary");
    private final By joiningDateInput    = By.id("input-joining-date");
    private final By employmentType      = By.id("input-employment-type");
    private final By statusSelect        = By.id("input-status");
    private final By addressInput        = By.id("input-address");
    private final By submitButton        = By.id("btn-submit-employee");
    private final By cancelButton        = By.id("btn-cancel");
    private final By closeModalButton    = By.id("btn-close-modal");
    private final By validationErrors    = By.cssSelector(".validation-error");

    // ===================================================================
    //  Employee Details Page
    // ===================================================================
    private final By detailName          = By.id("detail-name");
    private final By detailDesignation   = By.id("detail-designation");
    private final By detailEmail         = By.cssSelector("#detail-email, [id='detail-email']");
    private final By detailDepartment    = By.cssSelector("#detail-department, [id='detail-department']");
    private final By detailSalary        = By.cssSelector("#detail-salary, [id='detail-salary']");
    private final By detailPhone         = By.cssSelector("#detail-phone, [id='detail-phone']");
    private final By detailGender        = By.cssSelector("#detail-gender, [id='detail-gender']");
    private final By detailStatus        = By.id("detail-status-badge");
    private final By backToDirectoryBtn  = By.id("btn-back-to-directory");

    public EmployeePage(WebDriver driver) {
        super(driver);
    }

    // ===================================================================
    //  Navigation Actions
    // ===================================================================

    public void navigateToEmployeePage() {
        click(employeesNavLink);
        wait.until(ExpectedConditions.visibilityOfElementLocated(addEmployeeButton));
        log.info("EmployeePage: Navigated to /employees");
    }

    public void logout() {
        jsClick(logoutButton);
        log.info("EmployeePage: Logged out.");
    }

    // ===================================================================
    //  Add / Edit Employee
    // ===================================================================

    public void clickAddEmployee() {
        click(addEmployeeButton);
        wait.until(ExpectedConditions.visibilityOfElementLocated(employeeModal));
        log.info("EmployeePage: Add Employee modal opened.");
    }

    public void fillEmployeeForm(String name, String email, String phone,
                                  String department, String designation,
                                  String gender, String salary, String joiningDate) {
        if (name        != null) type(nameInput,        name);
        if (email       != null) type(emailInput,       email);
        if (phone       != null) type(phoneInput,       phone);
        if (department  != null) selectByVisibleText(departmentSelect, department);
        if (designation != null) type(designationInput, designation);
        if (gender      != null) selectByVisibleText(genderSelect,     gender);
        if (salary      != null) type(salaryInput,      salary);
        if (joiningDate != null) type(joiningDateInput, joiningDate);
        log.info("EmployeePage: Employee form filled — name={}, email={}", name, email);
    }

    /**
     * Overload for backwards compatibility (no joiningDate).
     */
    public void fillEmployeeForm(String name, String email, String phone,
                                  String department, String designation,
                                  String gender, String salary) {
        fillEmployeeForm(name, email, phone, department, designation, gender, salary, null);
    }

    public void clickSave() {
        click(submitButton);
        // Wait for modal to close (form submitted successfully)
        try { wait.until(ExpectedConditions.invisibilityOfElementLocated(employeeModal)); }
        catch (Exception ignored) {}
        log.info("EmployeePage: Save/Submit clicked.");
    }

    public void clickCancel() {
        click(cancelButton);
        log.info("EmployeePage: Cancel clicked.");
    }

    public void closeModal() {
        click(closeModalButton);
        log.info("EmployeePage: Modal closed.");
    }

    // ===================================================================
    //  Search & Sort
    // ===================================================================

    public void searchEmployee(String query) {
        type(searchBox, query);
        sleep(600); // wait for filtered results to render
        log.info("EmployeePage: Searched for '{}'", query);
    }

    public void clearSearch() {
        type(searchBox, "");
        sleep(400);
        log.info("EmployeePage: Search cleared.");
    }

    public void clickSortColumn(String columnId) {
        // columnId: "name", "department", "salary"
        click(By.id("sort-" + columnId));
        sleep(300);
        log.info("EmployeePage: Sorted by '{}'", columnId);
    }

    // ===================================================================
    //  Row-Level Actions (by email)
    // ===================================================================

    private By rowByEmail(String email) {
        return By.xpath("//tr[@data-email='" + email + "']");
    }

    public boolean isEmployeeInList(String email) {
        try {
            WebElement row = wait.until(ExpectedConditions.visibilityOfElementLocated(rowByEmail(email)));
            return row.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isEmployeeAbsent(String email) {
        return wait.until(ExpectedConditions.invisibilityOfElementLocated(rowByEmail(email)));
    }

    public String getEmployeeIdByEmail(String email) {
        return getText(By.xpath("//tr[@data-email='" + email + "']//td[contains(@class,'employee-id')]"));
    }

    public String getEmployeeNameByEmail(String email) {
        return getText(By.xpath("//tr[@data-email='" + email + "']//p[contains(@class,'employee-name')]"));
    }

    public void clickViewEmployee(String email) {
        // View button: data-email row, first action button
        String xpath = "//tr[@data-email='" + email + "']//button[@title='View Details']";
        click(By.xpath(xpath));
        log.info("EmployeePage: View clicked for '{}'", email);
    }

    public void clickEditEmployee(String email) {
        String xpath = "//tr[@data-email='" + email + "']//button[@title='Edit Employee']";
        click(By.xpath(xpath));
        wait.until(ExpectedConditions.visibilityOfElementLocated(employeeModal));
        log.info("EmployeePage: Edit modal opened for '{}'", email);
    }

    public void clickDeleteEmployee(String email) {
        String xpath = "//tr[@data-email='" + email + "']//button[@title='Delete Employee']";
        click(By.xpath(xpath));
        log.info("EmployeePage: Delete clicked for '{}'", email);
    }

    public void acceptDeleteConfirmation() {
        acceptAlert();
    }

    // ===================================================================
    //  Employee Detail Page
    // ===================================================================

    public void clickViewEmployeeAndWait(String email) {
        clickViewEmployee(email);
        wait.until(ExpectedConditions.visibilityOfElementLocated(detailName));
    }

    public String getDetailName()        { return getText(detailName); }
    public String getDetailDesignation() { return getText(detailDesignation); }
    public String getDetailStatus()      { return getText(detailStatus); }
    public String getDetailPhone()       { return isPresent(detailPhone)       ? getText(detailPhone)       : ""; }
    public String getDetailGender()      { return isPresent(detailGender)      ? getText(detailGender)      : ""; }
    public String getDetailDepartment()  { return isPresent(detailDepartment)  ? getText(detailDepartment)  : ""; }
    public String getDetailSalary()      { return isPresent(detailSalary)      ? getText(detailSalary)      : ""; }
    public String getDetailEmail()       { return isPresent(detailEmail)       ? getText(detailEmail)       : ""; }

    public void clickBackToDirectory() {
        click(backToDirectoryBtn);
        wait.until(ExpectedConditions.visibilityOfElementLocated(addEmployeeButton));
        log.info("EmployeePage: Navigated back to directory.");
    }

    // ===================================================================
    //  Counts & Pagination
    // ===================================================================

    public int getTotalEmployeeCount() {
        try { return Integer.parseInt(getText(employeeTotalCount).trim()); }
        catch (Exception e) { return -1; }
    }

    public int getTableRowCount() {
        return countElements(By.cssSelector("#employee-table-body .employee-row"));
    }

    public boolean isPaginationVisible() {
        return isPresent(paginationControls) && isDisplayed(paginationControls);
    }

    public void clickNextPage() {
        click(nextPageBtn);
        sleep(400);
    }

    public void clickPrevPage() {
        click(prevPageBtn);
        sleep(400);
    }

    public void clickPageNumber(int page) {
        click(By.id("btn-page-" + page));
        sleep(400);
    }

    public boolean isNoResultsRowVisible() {
        return isPresent(noResultsRow) && isDisplayed(noResultsRow);
    }

    // ===================================================================
    //  Validation Messages
    // ===================================================================

    public int getValidationErrorCount() {
        return countElements(validationErrors);
    }

    public boolean hasValidationErrors() {
        return getValidationErrorCount() > 0;
    }

    public List<String> getAllValidationMessages() {
        return findAll(validationErrors).stream()
                .map(el -> el.getText().trim())
                .filter(t -> !t.isEmpty())
                .toList();
    }

    public boolean isModalOpen() {
        return isPresent(employeeModal) && isDisplayed(employeeModal);
    }

    public String getModalTitle() {
        return isPresent(modalTitle) ? getText(modalTitle) : "";
    }

    // ===================================================================
    //  Department Dropdown
    // ===================================================================

    public List<String> getDepartmentOptions() {
        waitForVisible(departmentSelect);
        return findAll(By.cssSelector("#input-department option"))
                .stream()
                .map(el -> el.getText().trim())
                .filter(t -> !t.isEmpty() && !t.equalsIgnoreCase("Select Department"))
                .toList();
    }

    // ===================================================================
    //  Gender Dropdown
    // ===================================================================

    public List<String> getGenderOptions() {
        waitForVisible(genderSelect);
        return findAll(By.cssSelector("#input-gender option"))
                .stream()
                .map(el -> el.getText().trim())
                .filter(t -> !t.isEmpty() && !t.equalsIgnoreCase("Select Gender"))
                .toList();
    }
}
