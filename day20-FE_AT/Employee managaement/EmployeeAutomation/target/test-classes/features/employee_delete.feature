# ===========================================================
# Feature: Delete Employee
# Covers: Delete UI + API before/after verification
# ===========================================================

@EmployeeModule @DeleteEmployee
Feature: Delete Employee

  Background:
    Given I am logged in as admin
    And I navigate to the Employee page

  @DeleteEmployee @smoke
  Scenario: Delete Employee and verify removed from UI
    Given I record the current employee count via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    Then the employee should appear in the list
    When I click delete for the last added employee
    And I confirm the delete action
    Then the employee should no longer appear in the list

  @DeleteEmployee @API
  Scenario: Delete Employee and verify removal via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click delete for the last added employee
    And I confirm the delete action
    Then the API should confirm the employee is deleted

  @DeleteEmployee @API
  Scenario: Delete Employee and verify count decreases via API
    Given I record the current employee count via API
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click delete for the last added employee
    And I confirm the delete action
    Then the employee count should decrease by one

  @DeleteEmployee
  Scenario: Verify Employee Deleted Successfully confirmation
    When I click Add Employee button
    And I fill the employee form with valid data
    And I submit the employee form
    When I click delete for the last added employee
    And I confirm the delete action
    Then the employee should no longer appear in the list
    And the API should confirm the employee is deleted
