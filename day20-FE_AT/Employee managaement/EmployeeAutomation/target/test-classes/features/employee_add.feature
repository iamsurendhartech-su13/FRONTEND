# ===========================================================
# Feature: Add Employee
# Covers: Add Employee (UI), API Verification, Count, Data-Driven
# ===========================================================

@EmployeeModule @AddEmployee
Feature: Add Employee

  Background:
    Given I am logged in as admin
    And I navigate to the Employee page

  @AddEmployee @smoke
  Scenario: Add Employee with valid data and verify in UI
    Given I record the current employee count via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the modal should close
    And the employee should appear in the list

  @AddEmployee @API
  Scenario: Add Employee and verify via GET API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the API should confirm the employee exists

  @AddEmployee @API
  Scenario: Add Employee and verify employee count increases via API
    Given I record the current employee count via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the employee count should increase by one

  @AddEmployee @API
  Scenario: Verify GET employees API returns status 200
    Then the GET employees API should return status 200

  @AddEmployee @API
  Scenario: Verify GET employees API response time is acceptable
    Then the GET employees API response time should be acceptable

  @AddEmployee @smoke
  Scenario: Add Employee with specific form data
    When I click Add Employee button
    And I fill the employee form with data:
      | name        | John Test Smith               |
      | email       | john.test.{ts}@company.com    |
      | phone       | 9876543210                    |
      | department  | IT                            |
      | designation | Software Engineer             |
      | gender      | Male                          |
      | salary      | 75000                         |
      | joiningDate | 2024-03-01                    |
    And I submit the employee form
    Then the modal should close
    And the employee should appear in the list

  @AddEmployee @DataDriven
  Scenario: Add multiple employees from Excel data
    When I add employees from Excel file
    Then the employee count label should be correct

  @AddEmployee @Verified
  Scenario: Verify employee added successfully toast and UI refresh
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the employee should appear in the list
    And the API should confirm the employee exists
