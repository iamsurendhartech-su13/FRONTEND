# ===========================================================
# Feature: Search Employee
# Covers: Search by name, email, ID; clear search; no results
# ===========================================================

@EmployeeModule @SearchEmployee
Feature: Search Employee

  Background:
    Given I am logged in as admin
    And I navigate to the Employee page

  @SearchEmployee @smoke
  Scenario: Search Employee by name
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I search for the added employee by name
    Then the employee should appear in search results

  @SearchEmployee @smoke
  Scenario: Search Employee by email
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I search for the added employee by email
    Then the employee should appear in search results

  @SearchEmployee
  Scenario: Search Employee by ID
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I search for the added employee by email
    Then the employee should appear in search results

  @SearchEmployee
  Scenario: Search with a non-existent term shows no results
    When I search for "ZZZ_NONEXISTENT_EMPLOYEE_9999"
    Then no employee should be displayed

  @SearchEmployee
  Scenario: Clear search restores all employees
    When I search for "ZZZ_NONEXISTENT_EMPLOYEE_9999"
    Then no employee should be displayed
    When I clear the search
    Then the employee count label should be correct

  @SearchEmployee
  Scenario: Verify Employee Details on detail page
    When I click Add Employee button
    And I fill the employee form with data:
      | name        | Detail Verify Employee        |
      | email       | detail.verify.{ts}@test.com   |
      | phone       | 9876543210                    |
      | department  | IT                            |
      | designation | QA Engineer                   |
      | gender      | Male                          |
      | salary      | 60000                         |
      | joiningDate | 2024-06-01                    |
    And I submit the employee form
    Then I view the employee details
    And the details should show the correct name "Detail Verify Employee"
    And the details should show the correct department "IT"
