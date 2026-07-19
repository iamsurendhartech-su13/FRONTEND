package tests;

import base.BaseTest;
import pages.LoginPage;
import pages.EmployeePage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class EmployeeModuleTest extends BaseTest {

    @Test(description = "Verify the complete Employee Module lifecycle")
    public void testEmployeeModuleLifecycle() {
        testNode = extent.createTest("Employee Module Lifecycle Test", "Verify login, navigation, CRUD operations, and logout.");

        LoginPage loginPage = new LoginPage(getDriver());
        EmployeePage employeePage = new EmployeePage(getDriver());

        // Step 1 & 2: Launch and navigate
        log.info("Navigating to URL: " + config.getProperty("baseUrl"));
        getDriver().get(config.getProperty("baseUrl"));
        testNode.info("Navigated to Base URL.");

        // Step 3: Login using valid credentials
        log.info("Logging in with email: " + config.getProperty("adminEmail"));
        loginPage.login(config.getProperty("adminEmail"), config.getProperty("adminPassword"));
        testNode.info("Login submitted.");

        // Step 4: Navigate to Employee Module
        log.info("Navigating to Employee Page...");
        employeePage.navigateToEmployeePage();
        testNode.info("Navigated to Employee Module.");

        // Step 5: Add one employee with sample data
        // Email is made unique per run using a timestamp so re-runs never hit a duplicate constraint.
        String name = config.getProperty("empName");
        String baseEmail = config.getProperty("empEmail");
        String email = baseEmail.replace("@", "_" + System.currentTimeMillis() + "@");
        String phone = config.getProperty("empPhone");
        String dept = config.getProperty("empDept");
        String designation = config.getProperty("empDesignation");
        String gender = config.getProperty("empGender");
        String salary = config.getProperty("empSalary");
        log.info("Generated unique employee email for this run: " + email);

        log.info("Adding new employee: " + name);
        employeePage.clickAddEmployee();
        employeePage.fillEmployeeForm(name, email, phone, dept, designation, gender, salary);
        employeePage.clickSave();
        testNode.info("Employee details form filled and saved.");

        // Step 6: Verify employee is added successfully
        log.info("Verifying employee presence in list...");
        Assert.assertTrue(employeePage.isEmployeeInList(email), "Newly added employee is not in the directory.");
        testNode.info("Employee verified in the directory.");

        // Step 7: Search the employee using Employee ID
        String empId = employeePage.getEmployeeIdByEmail(email);
        log.info("Extracted generated Employee ID: " + empId);
        testNode.info("Extracted Employee ID: " + empId);

        log.info("Searching employee by ID: " + empId);
        employeePage.searchEmployee(empId);
        testNode.info("Search executed.");

        // Step 8: Verify search result
        Assert.assertTrue(employeePage.isEmployeeInList(email), "Employee search result is invalid.");
        testNode.info("Search result verified.");

        // Step 9: Edit the employee name to "Automation Employee"
        String updatedName = "Automation Employee";
        log.info("Editing employee name to: " + updatedName);
        employeePage.clickEditEmployee(email);
        employeePage.fillEmployeeForm(updatedName, null, null, null, null, null, null);
        employeePage.clickSave();
        testNode.info("Employee name updated and changes saved.");

        // Step 10: Verify the update is successful
        log.info("Verifying details of updated employee...");
        employeePage.clearSearch();
        employeePage.searchEmployee(updatedName);
        employeePage.clickViewEmployee(email);

        Assert.assertEquals(employeePage.getDetailName(), updatedName, "Employee name was not updated correctly.");
        Assert.assertEquals(employeePage.getDetailEmail(), email, "Employee email mismatch on detail view.");
        Assert.assertTrue(employeePage.getDetailDepartment().contains(dept), "Employee department mismatch on detail view.");
        testNode.info("Employee edit verification complete.");

        // Go back to directory
        employeePage.clickBackToDirectory();

        // NOTE: Delete steps are intentionally DISABLED.
        // The employee added during automation will persist in the database
        // and remain visible via GET http://localhost:5000/api/employees in Postman.
        // To re-enable cleanup, uncomment the block below.
        /*
        // Step 11: Delete the employee
        log.info("Deleting employee...");
        employeePage.clearSearch();
        employeePage.searchEmployee(updatedName);
        employeePage.clickDeleteEmployee(email);
        employeePage.acceptAlert();
        employeePage.waitForEmployeeToDisappear(email);
        testNode.info("Employee deleted and alert accepted.");

        // Step 12: Verify employee is removed successfully
        log.info("Verifying employee removal...");
        employeePage.clearSearch();
        employeePage.searchEmployee(updatedName);
        Assert.assertFalse(employeePage.isEmployeeInList(email), "Employee was not removed successfully.");
        testNode.info("Employee removal verified.");
        */

        // Step 13: Logout
        log.info("Logging out from application...");
        employeePage.logout();
        testNode.info("Logout complete.");
    }
}
