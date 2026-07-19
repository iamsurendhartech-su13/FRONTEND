package tests;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import io.restassured.response.Response;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.*;
import pages.AddEmployeePage;
import pages.LoginPage;
import utils.ApiHelper;
import utils.ConfigReader;
import utils.DriverFactory;
import utils.ScreenshotUtil;

import java.io.File;
import java.util.List;
import java.util.Map;

public class AddEmployeeTest {
    private static ExtentReports extent;
    private ExtentTest test;
    private WebDriver driver;

    @BeforeSuite
    public void setupSuite() {
        File reportsDir = new File("reports");
        if (!reportsDir.exists()) {
            reportsDir.mkdirs();
        }
        ExtentSparkReporter sparkReporter = new ExtentSparkReporter("reports/ExtentReport.html");
        sparkReporter.config().setTheme(Theme.STANDARD);
        sparkReporter.config().setDocumentTitle("Add Employee Test Report");
        sparkReporter.config().setReportName("Add Employee Module Validation");

        extent = new ExtentReports();
        extent.attachReporter(sparkReporter);
        extent.setSystemInfo("Host Name", "Localhost");
        extent.setSystemInfo("Environment", "QA");
        extent.setSystemInfo("User Name", "Automation Engineer");
    }

    @BeforeMethod
    public void setupDriver() {
        driver = DriverFactory.createDriver();
        driver.manage().window().maximize();
    }

    @Test(description = "Verify that a new employee can be added successfully via UI and matches in the database via REST API")
    public void testAddEmployee() {
        test = extent.createTest("Test Add Employee - UI & API Verification");
        
        try {
            // 1. Open the Employee Management System
            String baseUrl = ConfigReader.getProperty("baseUrl");
            test.log(Status.INFO, "Opening Employee Management System: " + baseUrl);
            driver.get(baseUrl);

            // Login first to access the dashboard and employees page
            LoginPage loginPage = new LoginPage(driver);
            String adminEmail = ConfigReader.getProperty("adminEmail");
            String adminPassword = ConfigReader.getProperty("adminPassword");
            test.log(Status.INFO, "Logging in with admin credentials: " + adminEmail);
            loginPage.login(adminEmail, adminPassword);

            // 2. Navigate to the Employee page
            AddEmployeePage addEmployeePage = new AddEmployeePage(driver);
            test.log(Status.INFO, "Navigating to Employee page");
            addEmployeePage.navigateToEmployeePage();

            // 3. Click "Add Employee"
            test.log(Status.INFO, "Clicking 'Add Employee' button");
            addEmployeePage.clickAddEmployee();

            // 4. Enter valid employee details
            String uniqueEmail = "auto_emp_" + System.currentTimeMillis() + "@example.com";
            String empName = "Auto Test Employee";
            String empPhone = "9876543210";
            String empDept = "electronic "; // Using the seeded default department name
            String empDesig = "QA Automation Lead";
            String empSalary = "85000";
            String empGender = "Male";

            test.log(Status.INFO, "Entering employee details: Name=" + empName + ", Email=" + uniqueEmail);
            addEmployeePage.fillEmployeeForm(empName, uniqueEmail, empPhone, empDept, empDesig, empSalary, empGender);

            // 5. Click the Save button
            test.log(Status.INFO, "Clicking Save button");
            addEmployeePage.clickSave();

            // 6. Verify the success message
            test.log(Status.INFO, "Verifying success message toast");
            boolean isToastDisplayed = addEmployeePage.isSuccessMessageDisplayed();
            String toastText = addEmployeePage.getSuccessMessageText();
            test.log(Status.INFO, "Toast message captured: '" + toastText + "'");
            Assert.assertTrue(isToastDisplayed, "Success message toast was not displayed.");
            Assert.assertTrue(toastText.contains("Employee Added Successfully") || toastText.contains("success"), 
                "Toast text mismatch. Expected success text but got: " + toastText);

            // Retrieve the auto-generated Employee ID from the UI table
            String generatedEmpId = addEmployeePage.getEmployeeIdByEmail(uniqueEmail);
            test.log(Status.INFO, "Auto-generated Employee ID retrieved from UI: " + generatedEmpId);

            // 7. Call the GET Employee API using Rest Assured
            test.log(Status.INFO, "Calling GET /employees API using Rest Assured");
            Response response = ApiHelper.getAllEmployees();

            // 8. Validate GET API results
            test.log(Status.INFO, "Validating REST API response properties");
            
            // HTTP Status Code = 200
            int statusCode = response.getStatusCode();
            test.log(Status.INFO, "HTTP Status Code received: " + statusCode);
            Assert.assertEquals(statusCode, 200, "API response status code is not 200.");

            // Find the employee in the response data list
            List<Map<String, Object>> employeeList = response.jsonPath().getList("data");
            Map<String, Object> targetEmployee = null;
            for (Map<String, Object> emp : employeeList) {
                if (uniqueEmail.equalsIgnoreCase((String) emp.get("email"))) {
                    targetEmployee = emp;
                    break;
                }
            }

            Assert.assertNotNull(targetEmployee, "Employee with email " + uniqueEmail + " was not found in REST API response.");

            // Validate fields match: Employee ID, Name, Email, Department
            String apiEmpId = (String) targetEmployee.get("employeeId");
            String apiName = (String) targetEmployee.get("name");
            String apiEmail = (String) targetEmployee.get("email");
            String apiDept = (String) targetEmployee.get("department");

            test.log(Status.INFO, "API Data: ID=" + apiEmpId + ", Name=" + apiName + ", Email=" + apiEmail + ", Department=" + apiDept);
            
            Assert.assertEquals(apiEmpId, generatedEmpId, "Employee ID mismatch in database.");
            Assert.assertEquals(apiName, empName, "Employee name mismatch in database.");
            Assert.assertEquals(apiEmail, uniqueEmail, "Employee email mismatch in database.");
            Assert.assertEquals(apiDept, empDept, "Employee department mismatch in database.");

            test.log(Status.PASS, "Employee successfully saved and verified via GET REST API.");

        } catch (Throwable t) {
            test.log(Status.FAIL, "Test failed: " + t.getMessage());
            if (driver != null) {
                String screenshotPath = ScreenshotUtil.captureScreenshot(driver, "AddEmployeeFailure");
                test.addScreenCaptureFromPath(screenshotPath, "Failure Screenshot");
            }
            throw t;
        }
    }

    @AfterMethod
    public void teardownDriver(ITestResult result) {
        if (driver != null) {
            driver.quit();
        }
    }

    @AfterSuite
    public void tearDownSuite() {
        if (extent != null) {
            extent.flush();
        }
    }
}
