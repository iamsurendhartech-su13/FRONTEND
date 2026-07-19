package com.employee.automation.stepdefinitions;

import com.employee.automation.hooks.Hooks;
import com.employee.automation.pages.EmployeePage;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.utilities.ApiUtility;
import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.ExcelUtility;
import io.cucumber.java.en.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.openqa.selenium.WebDriver;

import java.util.List;
import java.util.Map;

/**
 * EmployeeSteps — Cucumber step definitions for all Employee module feature files.
 * Covers: Add, Edit, Delete, Search, Validation, Pagination, API Verification.
 */
public class EmployeeSteps {

    private static final Logger log = LogManager.getLogger(EmployeeSteps.class);
    private final ConfigReader config = ConfigReader.getInstance();

    private EmployeePage employeePage;
    private LoginPage    loginPage;

    // State shared across steps in same scenario
    private String currentEmail;
    private String currentName;
    private int    preActionCount;

    private WebDriver getDriver() { return Hooks.getDriver(); }

    private void ensureLoggedIn() {
        if (loginPage == null) loginPage = new LoginPage(getDriver());
        if (employeePage == null) employeePage = new EmployeePage(getDriver());

        String url = getDriver().getCurrentUrl();
        if (url == null || url.contains("/login") || url.equals("data:,")) {
            getDriver().get(config.getBaseUrl() + "/login");
            loginPage.login(config.getAdminEmail(), config.getAdminPassword());
        }
    }

    // ===================================================================
    //  Given — Setup Steps
    // ===================================================================

    @Given("I am logged in as admin")
    public void iAmLoggedInAsAdmin() {
        loginPage    = new LoginPage(getDriver());
        employeePage = new EmployeePage(getDriver());
        getDriver().get(config.getBaseUrl() + "/login");
        loginPage.login(config.getAdminEmail(), config.getAdminPassword());
        log.info("EmployeeSteps: Logged in as admin.");
        Hooks.getTest().info("Logged in as admin: " + config.getAdminEmail());
    }

    @Given("I navigate to the Employee page")
    public void iNavigateToTheEmployeePage() {
        ensureLoggedIn();
        employeePage.navigateToEmployeePage();
        log.info("EmployeeSteps: Navigated to Employee page.");
        Hooks.getTest().info("Navigated to /employees");
    }

    @Given("I record the current employee count via API")
    public void iRecordCurrentEmployeeCountViaApi() {
        preActionCount = ApiUtility.getEmployeeCount();
        log.info("EmployeeSteps: Pre-action API count = {}", preActionCount);
        Hooks.getTest().info("Pre-action employee count (API): " + preActionCount);
    }

    // ===================================================================
    //  When — Add Employee
    // ===================================================================

    @When("I click Add Employee button")
    public void iClickAddEmployeeButton() {
        employeePage.clickAddEmployee();
        Hooks.getTest().info("Add Employee button clicked.");
    }

    @When("I fill the employee form with valid data")
    public void iFillTheEmployeeFormWithValidData() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        currentName  = "AutoEmp_" + timestamp;
        currentEmail = "auto_" + timestamp + "@test.com";

        employeePage.fillEmployeeForm(
                currentName,
                currentEmail,
                config.getEmployeePhone(),
                config.getEmployeeDept(),
                config.getEmployeeDesig(),
                config.getEmployeeGender(),
                config.getEmployeeSalary(),
                "2024-01-15"
        );
        log.info("EmployeeSteps: Form filled — name={}, email={}", currentName, currentEmail);
        Hooks.getTest().info("Form filled for: " + currentName + " / " + currentEmail);
    }

    @When("I fill the employee form with data:")
    public void iFillTheEmployeeFormWithData(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap();
        String timestamp = String.valueOf(System.currentTimeMillis());

        currentName  = data.getOrDefault("name",        "AutoEmployee_" + timestamp);
        currentEmail = data.getOrDefault("email",        "auto_" + timestamp + "@test.com")
                          .replace("{ts}", timestamp);

        employeePage.fillEmployeeForm(
                currentName,
                currentEmail,
                data.getOrDefault("phone",       config.getEmployeePhone()),
                data.getOrDefault("department",  config.getEmployeeDept()),
                data.getOrDefault("designation", config.getEmployeeDesig()),
                data.getOrDefault("gender",      config.getEmployeeGender()),
                data.getOrDefault("salary",      config.getEmployeeSalary()),
                data.getOrDefault("joiningDate", "2024-01-15")
        );
        Hooks.getTest().info("Form filled with table data. Email: " + currentEmail);
    }

    @When("I submit the employee form")
    public void iSubmitTheEmployeeForm() {
        employeePage.clickSave();
        Hooks.getTest().info("Employee form submitted.");
    }

    @When("I submit the employee form without filling any fields")
    public void iSubmitEmployeeFormEmpty() {
        employeePage.clickSave();
        Hooks.getTest().info("Empty form submitted to trigger validation.");
    }

    // ===================================================================
    //  When — Edit Employee
    // ===================================================================

    @When("I click edit for the employee {string}")
    public void iClickEditForEmployee(String email) {
        currentEmail = email;
        employeePage.clickEditEmployee(email);
        Hooks.getTest().info("Edit modal opened for: " + email);
    }

    @When("I click edit for the last added employee")
    public void iClickEditForLastAddedEmployee() {
        employeePage.clearSearch();
        employeePage.searchEmployee(currentEmail);
        employeePage.clickEditEmployee(currentEmail);
        Hooks.getTest().info("Edit modal opened for last added employee: " + currentEmail);
    }

    @When("I update the name to {string}")
    public void iUpdateTheNameTo(String newName) {
        currentName = newName;
        employeePage.fillEmployeeForm(newName, null, null, null, null, null, null);
        Hooks.getTest().info("Updated name to: " + newName);
    }

    @When("I update the designation to {string}")
    public void iUpdateTheDesignationTo(String newDesig) {
        employeePage.fillEmployeeForm(null, null, null, null, newDesig, null, null);
        Hooks.getTest().info("Updated designation to: " + newDesig);
    }

    // ===================================================================
    //  When — Delete Employee
    // ===================================================================

    @When("I click delete for the employee {string}")
    public void iClickDeleteForEmployee(String email) {
        currentEmail = email;
        employeePage.clickDeleteEmployee(email);
        Hooks.getTest().info("Delete clicked for: " + email);
    }

    @When("I click delete for the last added employee")
    public void iClickDeleteForLastAddedEmployee() {
        employeePage.clearSearch();
        employeePage.searchEmployee(currentEmail);
        employeePage.clickDeleteEmployee(currentEmail);
        Hooks.getTest().info("Delete clicked for: " + currentEmail);
    }

    @When("I confirm the delete action")
    public void iConfirmTheDeleteAction() {
        employeePage.acceptDeleteConfirmation();
        Hooks.getTest().info("Delete confirmation accepted.");
    }

    // ===================================================================
    //  When — Search
    // ===================================================================

    @When("I search for {string}")
    public void iSearchFor(String query) {
        employeePage.searchEmployee(query);
        Hooks.getTest().info("Searched for: " + query);
    }

    @When("I clear the search")
    public void iClearTheSearch() {
        employeePage.clearSearch();
        Hooks.getTest().info("Search cleared.");
    }

    @When("I search for the added employee by name")
    public void iSearchForAddedEmployeeByName() {
        employeePage.searchEmployee(currentName);
        Hooks.getTest().info("Searched for employee by name: " + currentName);
    }

    @When("I search for the added employee by email")
    public void iSearchForAddedEmployeeByEmail() {
        employeePage.searchEmployee(currentEmail);
        Hooks.getTest().info("Searched by email: " + currentEmail);
    }

    // ===================================================================
    //  When — Validation
    // ===================================================================

    @When("I enter an invalid email {string}")
    public void iEnterAnInvalidEmail(String email) {
        employeePage.fillEmployeeForm(null, email, null, null, null, null, null);
        Hooks.getTest().info("Invalid email entered: " + email);
    }

    @When("I enter an invalid phone {string}")
    public void iEnterAnInvalidPhone(String phone) {
        employeePage.fillEmployeeForm(null, null, phone, null, null, null, null);
        Hooks.getTest().info("Invalid phone entered: " + phone);
    }

    @When("I enter a negative salary {string}")
    public void iEnterANegativeSalary(String salary) {
        employeePage.fillEmployeeForm(null, null, null, null, null, null, salary);
        Hooks.getTest().info("Invalid salary entered: " + salary);
    }

    @When("I try to add a duplicate employee with email {string}")
    public void iTryToAddDuplicateEmployee(String email) {
        employeePage.clickAddEmployee();
        employeePage.fillEmployeeForm(
                "Duplicate Employee", email,
                config.getEmployeePhone(), config.getEmployeeDept(),
                config.getEmployeeDesig(), config.getEmployeeGender(),
                config.getEmployeeSalary(), "2024-01-15"
        );
        employeePage.clickSave();
        Hooks.getTest().info("Attempted duplicate add with email: " + email);
    }

    // ===================================================================
    //  When — Data Table (Data Driven)
    // ===================================================================

    @When("I add employees from Excel file")
    public void iAddEmployeesFromExcelFile() {
        String excelPath  = config.getExcelPath();
        String sheetName  = config.getExcelSheet();
        List<Map<String, String>> rows = ExcelUtility.readAllRows(excelPath, sheetName);

        Assert.assertFalse(rows.isEmpty(), "Excel file has no data rows.");
        Hooks.getTest().info("Read " + rows.size() + " rows from Excel: " + excelPath);

        for (Map<String, String> row : rows) {
            String timestamp = String.valueOf(System.currentTimeMillis());
            String email = row.getOrDefault("email", "auto_" + timestamp + "@test.com")
                             .replace("{ts}", timestamp);

            employeePage.clickAddEmployee();
            employeePage.fillEmployeeForm(
                    row.getOrDefault("name",        "Excel Employee"),
                    email,
                    row.getOrDefault("phone",       config.getEmployeePhone()),
                    row.getOrDefault("department",  config.getEmployeeDept()),
                    row.getOrDefault("designation", config.getEmployeeDesig()),
                    row.getOrDefault("gender",      config.getEmployeeGender()),
                    row.getOrDefault("salary",      config.getEmployeeSalary()),
                    row.getOrDefault("joiningDate", "2024-01-15")
            );
            employeePage.clickSave();
            Hooks.getTest().info("Added employee from Excel: " + email);
        }
    }

    // ===================================================================
    //  Then — Add Verifications
    // ===================================================================

    @Then("the employee should appear in the list")
    public void theEmployeeShouldAppearInTheList() {
        employeePage.clearSearch();
        Assert.assertTrue(employeePage.isEmployeeInList(currentEmail),
                "Employee '" + currentEmail + "' not found in directory after add.");
        Hooks.getTest().pass("Employee confirmed in directory: " + currentEmail);
    }

    @Then("the API should confirm the employee exists")
    public void theApiShouldConfirmEmployeeExists() {
        ApiUtility.verifyEmployeeExistsByEmail(currentEmail);
        Hooks.getTest().pass("API confirmed: employee '" + currentEmail + "' exists.");
    }

    @Then("the employee count should increase by one")
    public void theEmployeeCountShouldIncreaseByOne() {
        int newCount = ApiUtility.getEmployeeCount();
        Assert.assertEquals(newCount, preActionCount + 1,
                "Employee count did not increase. Was: " + preActionCount + ", Now: " + newCount);
        Hooks.getTest().pass("Employee count increased: " + preActionCount + " → " + newCount);
    }

    // ===================================================================
    //  Then — Edit Verifications
    // ===================================================================

    @Then("the employee should be updated in the list")
    public void theEmployeeShouldBeUpdatedInTheList() {
        employeePage.clearSearch();
        employeePage.searchEmployee(currentEmail);
        Assert.assertTrue(employeePage.isEmployeeInList(currentEmail),
                "Updated employee not found in directory.");
        String displayedName = employeePage.getEmployeeNameByEmail(currentEmail);
        Assert.assertEquals(displayedName, currentName,
                "Name not updated. Expected: '" + currentName + "' | Got: '" + displayedName + "'");
        Hooks.getTest().pass("Employee updated and verified in directory.");
    }

    @Then("the API should reflect the updated employee details")
    public void theApiShouldReflectUpdatedDetails() {
        ApiUtility.verifyEmployeeField(currentEmail, "name", currentName);
        Hooks.getTest().pass("API verified updated name for: " + currentEmail);
    }

    // ===================================================================
    //  Then — Delete Verifications
    // ===================================================================

    @Then("the employee should no longer appear in the list")
    public void theEmployeeShouldNoLongerAppearInList() {
        employeePage.clearSearch();
        employeePage.searchEmployee(currentEmail);
        Assert.assertTrue(employeePage.isNoResultsRowVisible() || !employeePage.isEmployeeInList(currentEmail),
                "Employee '" + currentEmail + "' still visible after delete.");
        Hooks.getTest().pass("Employee removed from directory: " + currentEmail);
    }

    @Then("the API should confirm the employee is deleted")
    public void theApiShouldConfirmEmployeeDeleted() {
        ApiUtility.verifyEmployeeNotExistsByEmail(currentEmail);
        Hooks.getTest().pass("API confirmed: employee '" + currentEmail + "' deleted.");
    }

    @Then("the employee count should decrease by one")
    public void theEmployeeCountShouldDecreaseByOne() {
        int newCount = ApiUtility.getEmployeeCount();
        Assert.assertEquals(newCount, preActionCount - 1,
                "Employee count did not decrease. Was: " + preActionCount + ", Now: " + newCount);
        Hooks.getTest().pass("Employee count decreased: " + preActionCount + " → " + newCount);
    }

    // ===================================================================
    //  Then — Search Verifications
    // ===================================================================

    @Then("the employee should appear in search results")
    public void theEmployeeShouldAppearInSearchResults() {
        Assert.assertTrue(employeePage.isEmployeeInList(currentEmail),
                "Employee not found in search results for: " + currentEmail);
        Hooks.getTest().pass("Search result verified for: " + currentEmail);
    }

    @Then("no employee should be displayed")
    public void noEmployeeShouldBeDisplayed() {
        Assert.assertTrue(employeePage.isNoResultsRowVisible(),
                "Expected no results but employees are still displayed.");
        Hooks.getTest().pass("No results confirmed for invalid search.");
    }

    @Then("the filtered count should be {int}")
    public void theFilteredCountShouldBe(int expected) {
        Assert.assertEquals(employeePage.getTableRowCount(), expected,
                "Table row count mismatch.");
        Hooks.getTest().pass("Filtered row count verified: " + expected);
    }

    // ===================================================================
    //  Then — Validation Verifications
    // ===================================================================

    @Then("I should see validation error messages")
    public void iShouldSeeValidationErrorMessages() {
        Assert.assertTrue(employeePage.hasValidationErrors(),
                "Expected validation errors but none were displayed.");
        List<String> errors = employeePage.getAllValidationMessages();
        Hooks.getTest().info("Validation messages: " + errors);
        Hooks.getTest().pass("Validation errors displayed: " + errors.size() + " messages.");
    }

    @Then("the modal should remain open")
    public void theModalShouldRemainOpen() {
        Assert.assertTrue(employeePage.isModalOpen(), "Modal closed unexpectedly after invalid submit.");
        Hooks.getTest().pass("Modal remains open as expected.");
    }

    @Then("the modal should close")
    public void theModalShouldClose() {
        Assert.assertFalse(employeePage.isModalOpen(), "Modal did not close after successful submit.");
        Hooks.getTest().pass("Modal closed after successful operation.");
    }

    // ===================================================================
    //  Then — Count & Pagination
    // ===================================================================

    @Then("the employee count label should be correct")
    public void theEmployeeCountLabelShouldBeCorrect() {
        int uiCount  = employeePage.getTotalEmployeeCount();
        int apiCount = ApiUtility.getEmployeeCount();
        Assert.assertEquals(uiCount, apiCount,
                "UI count (" + uiCount + ") does not match API count (" + apiCount + ").");
        Hooks.getTest().pass("Employee count matched UI ↔ API: " + uiCount);
    }

    @Then("pagination controls should be visible")
    public void paginationControlsShouldBeVisible() {
        Assert.assertTrue(employeePage.isPaginationVisible(),
                "Pagination controls not visible.");
        Hooks.getTest().pass("Pagination controls visible.");
    }

    @Then("I should be able to navigate to the next page")
    public void iShouldBeAbleToNavigateToNextPage() {
        int before = employeePage.getTableRowCount();
        employeePage.clickNextPage();
        int after = employeePage.getTableRowCount();
        Assert.assertTrue(after > 0, "Next page has no rows.");
        Hooks.getTest().pass("Next page navigated. Rows on page: " + after);
    }

    // ===================================================================
    //  Then — View Employee Details
    // ===================================================================

    @Then("I view the employee details")
    public void iViewTheEmployeeDetails() {
        employeePage.clearSearch();
        employeePage.searchEmployee(currentEmail);
        employeePage.clickViewEmployeeAndWait(currentEmail);
        Hooks.getTest().info("Viewing detail page for: " + currentEmail);
    }

    @Then("the details should show the correct name {string}")
    public void theDetailsShouldShowCorrectName(String expectedName) {
        String actual = employeePage.getDetailName();
        Assert.assertEquals(actual, expectedName,
                "Detail name mismatch. Expected: '" + expectedName + "' | Got: '" + actual + "'");
        Hooks.getTest().pass("Detail name verified: " + actual);
    }

    @Then("the details should show the correct department {string}")
    public void theDetailsShouldShowCorrectDepartment(String expectedDept) {
        Assert.assertTrue(employeePage.getDetailDepartment().contains(expectedDept),
                "Department not matching on detail page.");
        Hooks.getTest().pass("Detail department verified: " + expectedDept);
    }

    // ===================================================================
    //  Then — Dropdown Verifications
    // ===================================================================

    @Then("the department dropdown should have options")
    public void theDepartmentDropdownShouldHaveOptions() {
        employeePage.clickAddEmployee();
        List<String> options = employeePage.getDepartmentOptions();
        Assert.assertFalse(options.isEmpty(), "Department dropdown has no options.");
        Hooks.getTest().pass("Department options: " + options);
        employeePage.clickCancel();
    }

    @Then("the gender dropdown should contain Male, Female, Other")
    public void theGenderDropdownShouldContainOptions() {
        employeePage.clickAddEmployee();
        List<String> options = employeePage.getGenderOptions();
        Assert.assertTrue(options.contains("Male"),   "Gender dropdown missing 'Male'.");
        Assert.assertTrue(options.contains("Female"), "Gender dropdown missing 'Female'.");
        Assert.assertTrue(options.contains("Other"),  "Gender dropdown missing 'Other'.");
        Hooks.getTest().pass("Gender options verified: " + options);
        employeePage.clickCancel();
    }

    // ===================================================================
    //  Then — API Status
    // ===================================================================

    @Then("the GET employees API should return status {int}")
    public void theGetEmployeesApiShouldReturnStatus(int expectedStatus) {
        var response = ApiUtility.getEmployees();
        ApiUtility.validateStatusCode(response, expectedStatus);
        Hooks.getTest().pass("API GET /employees returned status: " + expectedStatus);
    }

    @Then("the GET employees API response time should be acceptable")
    public void theGetEmployeesApiResponseTimeShouldBeAcceptable() {
        var response = ApiUtility.getEmployees();
        ApiUtility.validateResponseTime(response);
        Hooks.getTest().pass("API response time is within acceptable limits.");
    }
}
