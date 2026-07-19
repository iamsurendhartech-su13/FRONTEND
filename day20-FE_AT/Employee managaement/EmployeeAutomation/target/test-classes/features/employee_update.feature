# ===========================================================
# Feature: Update Employee
# Covers: Edit name, API verification before/after update
# ===========================================================

@EmployeeModule @UpdateEmployee
Feature: Update Employee

  Background:
    Given I am logged in as admin
    And I navigate to the Employee page

  @UpdateEmployee @smoke
  Scenario: Edit Employee name and verify update in UI
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the employee should appear in the list
    When I click edit for the last added employee
    And I update the name to "Updated Automation Employee"
    And I submit the employee form
    Then the employee should be updated in the list

  @UpdateEmployee @API
  Scenario: Edit Employee and verify updated name via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click edit for the last added employee
    And I update the name to "API Verified Update"
    And I submit the employee form
    Then the API should reflect the updated employee details

  @UpdateEmployee @smoke
  Scenario: Edit Employee designation and verify
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click edit for the last added employee
    And I update the designation to "Senior Engineer"
    And I submit the employee form
    Then the employee should be updated in the list

  @UpdateEmployee
  Scenario: Verify Employee Updated Successfully message
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click edit for the last added employee
    And I update the name to "Verified Update Employee"
    And I submit the employee form
    Then the modal should close
    And the employee should be updated in the list
