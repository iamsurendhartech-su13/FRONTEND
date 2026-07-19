package com.employee.automation.utilities;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;

import java.util.List;
import java.util.Map;

/**
 * ApiUtility — RestAssured-based API validation utility.
 * Used to validate backend state before and after UI actions (Part 5).
 * Base URL: http://localhost:5000/api
 */
public class ApiUtility {

    private static final Logger log = LogManager.getLogger(ApiUtility.class);
    private static final String BASE_URL;
    private static final long MAX_RESPONSE_TIME_MS = 5000;

    static {
        BASE_URL = ConfigReader.getInstance().getApiBaseUrl();
        RestAssured.baseURI = BASE_URL;
        log.info("ApiUtility initialized with base URL: {}", BASE_URL);
    }

    private ApiUtility() {}

    // ===================================================================
    //  GET /employees
    // ===================================================================

    /**
     * GET all employees. Asserts status 200.
     */
    public static Response getEmployees() {
        log.info("API GET: {}/employees", BASE_URL);
        Response response = RestAssured
                .given()
                    .contentType(ContentType.JSON)
                    .log().method()
                .when()
                    .get("/employees")
                .then()
                    .log().status()
                    .extract().response();

        validateStatusCode(response, 200);
        validateResponseTime(response);
        return response;
    }

    // ===================================================================
    //  GET /employees/{id}
    // ===================================================================

    /**
     * GET employee by ID. Asserts status 200.
     */
    public static Response getEmployeeById(int id) {
        log.info("API GET: {}/employees/{}", BASE_URL, id);
        Response response = RestAssured
                .given()
                    .contentType(ContentType.JSON)
                .when()
                    .get("/employees/" + id)
                .then()
                    .log().status()
                    .extract().response();

        validateStatusCode(response, 200);
        return response;
    }

    // ===================================================================
    //  Existence Checks
    // ===================================================================

    /**
     * Verifies that an employee with the given email exists via API.
     * Asserts and logs result.
     */
    public static void verifyEmployeeExistsByEmail(String email) {
        log.info("API Verify: Employee with email '{}' should exist.", email);
        Response response = getEmployees();
        List<Map<String, Object>> employees = response.jsonPath().getList("$");
        boolean found = employees.stream()
                .anyMatch(emp -> email.equalsIgnoreCase(String.valueOf(emp.get("email"))));
        Assert.assertTrue(found, "API Verification FAILED: Employee with email '" + email + "' NOT found in GET /employees.");
        log.info("API Verify: Employee '{}' confirmed to exist.", email);
    }

    /**
     * Verifies that an employee with the given email does NOT exist via API.
     */
    public static void verifyEmployeeNotExistsByEmail(String email) {
        log.info("API Verify: Employee with email '{}' should NOT exist.", email);
        Response response = getEmployees();
        List<Map<String, Object>> employees = response.jsonPath().getList("$");
        boolean found = employees.stream()
                .anyMatch(emp -> email.equalsIgnoreCase(String.valueOf(emp.get("email"))));
        Assert.assertFalse(found, "API Verification FAILED: Employee with email '" + email + "' should be deleted but was found.");
        log.info("API Verify: Confirmed employee '{}' does NOT exist.", email);
    }

    /**
     * Finds employee by email and returns the full data map.
     * Returns null if not found.
     */
    public static Map<String, Object> findEmployeeByEmail(String email) {
        Response response = getEmployees();
        List<Map<String, Object>> employees = response.jsonPath().getList("$");
        return employees.stream()
                .filter(emp -> email.equalsIgnoreCase(String.valueOf(emp.get("email"))))
                .findFirst()
                .orElse(null);
    }

    // ===================================================================
    //  Employee Count
    // ===================================================================

    /**
     * Returns current employee count from the API.
     */
    public static int getEmployeeCount() {
        Response response = getEmployees();
        List<Object> employees = response.jsonPath().getList("$");
        int count = employees != null ? employees.size() : 0;
        log.info("API: Current employee count = {}", count);
        return count;
    }

    // ===================================================================
    //  Validation Helpers
    // ===================================================================

    /**
     * Validates HTTP status code. Asserts equality.
     */
    public static void validateStatusCode(Response response, int expected) {
        int actual = response.statusCode();
        Assert.assertEquals(actual, expected,
                "API Status Code Mismatch. Expected: " + expected + " | Actual: " + actual);
        log.info("API Status Code: {} (expected {})", actual, expected);
    }

    /**
     * Validates response time is within acceptable threshold.
     */
    public static void validateResponseTime(Response response) {
        long time = response.time();
        Assert.assertTrue(time < MAX_RESPONSE_TIME_MS,
                "API Response time too slow: " + time + "ms (threshold: " + MAX_RESPONSE_TIME_MS + "ms)");
        log.info("API Response Time: {}ms", time);
    }

    /**
     * Validates that a JSON field in the response body has the expected value.
     */
    public static void validateJsonField(Response response, String jsonPath, Object expectedValue) {
        Object actual = response.jsonPath().get(jsonPath);
        Assert.assertEquals(actual, expectedValue,
                "JSON Field Mismatch at path '" + jsonPath + "'. Expected: " + expectedValue + " | Actual: " + actual);
        log.info("API Field '{}' = '{}' ✓", jsonPath, actual);
    }

    /**
     * Verifies that employee data was updated correctly.
     *
     * @param email     Employee's email (used to find in list)
     * @param fieldName JSON field name to check
     * @param expected  Expected field value
     */
    public static void verifyEmployeeField(String email, String fieldName, String expected) {
        Map<String, Object> emp = findEmployeeByEmail(email);
        Assert.assertNotNull(emp, "API: Employee with email '" + email + "' not found.");
        String actual = String.valueOf(emp.get(fieldName));
        Assert.assertEquals(actual, expected,
                "API Field Mismatch for field '" + fieldName + "'. Expected: '" + expected + "' | Actual: '" + actual + "'");
        log.info("API Verified field '{}' = '{}' for employee '{}'", fieldName, actual, email);
    }
}
