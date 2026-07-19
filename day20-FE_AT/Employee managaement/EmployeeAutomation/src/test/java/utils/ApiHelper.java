package utils;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import java.util.HashMap;
import java.util.Map;

public class ApiHelper {
    private static String token;

    static {
        RestAssured.baseURI = ConfigReader.getProperty("apiBaseUrl");
    }

    /**
     * Authenticates with the backend API and retrieves the JWT token.
     */
    public static synchronized String getAuthToken() {
        if (token == null) {
            Map<String, String> credentials = new HashMap<>();
            credentials.put("email", ConfigReader.getProperty("adminEmail"));
            credentials.put("password", ConfigReader.getProperty("adminPassword"));

            Response response = RestAssured.given()
                    .contentType(ContentType.JSON)
                    .body(credentials)
                    .post("/auth/login");

            if (response.getStatusCode() == 200) {
                token = response.jsonPath().getString("data.token");
            } else {
                throw new RuntimeException("API authentication failed: " + response.getBody().asString());
            }
        }
        return token;
    }

    /**
     * Fetches all employees using the GET API.
     */
    public static Response getAllEmployees() {
        String authToken = getAuthToken();
        return RestAssured.given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .get("/employees");
    }

    /**
     * Fetches a specific employee by their database ID using the GET API.
     */
    public static Response getEmployeeById(int id) {
        String authToken = getAuthToken();
        return RestAssured.given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .get("/employees/" + id);
    }
}
