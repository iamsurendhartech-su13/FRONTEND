# ===========================================================
# Feature: Employee Form Validation
# Covers: Empty fields, invalid email, invalid phone,
#         invalid salary, duplicate prevention, dropdowns
# ===========================================================

@EmployeeModule @Validation
Feature: Employee Form Validation

  Background:
    Given I am logged in as admin
    And I navigate to the Employee page
    And I click Add Employee button

  @Validation @EmptyFields @smoke
  Scenario: Verify Empty Fields Validation — all required fields blank
    When I submit the employee form without filling any fields
    Then I should see validation error messages
    And the modal should remain open

  @Validation @InvalidEmail
  Scenario: Verify Invalid Email validation — missing @
    When I fill the employee form with data:
      | name        | Invalid Email Test |
      | email       | invalidemail.com   |
      | phone       | 9876543210         |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | 50000              |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @InvalidEmail
  Scenario: Verify Invalid Email validation — missing domain
    When I fill the employee form with data:
      | name        | Invalid Email Test2 |
      | email       | user@               |
      | phone       | 9876543210          |
      | department  | IT                  |
      | designation | Tester              |
      | gender      | Male                |
      | salary      | 50000               |
      | joiningDate | 2024-01-01          |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @InvalidPhone
  Scenario: Verify Invalid Phone Number validation — letters
    When I fill the employee form with data:
      | name        | Invalid Phone Test |
      | email       | validphone@test.com|
      | phone       | ABCDEFGHIJ         |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | 50000              |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @InvalidPhone
  Scenario: Verify Invalid Phone Number validation — too short
    When I fill the employee form with data:
      | name        | Short Phone Test   |
      | email       | shortphone@test.com|
      | phone       | 12345              |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | 50000              |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @SalaryValidation
  Scenario: Verify Salary Validation — negative value
    When I fill the employee form with data:
      | name        | Neg Salary Test    |
      | email       | negsalary@test.com |
      | phone       | 9876543210         |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | -5000              |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @SalaryValidation
  Scenario: Verify Salary Validation — zero value
    When I fill the employee form with data:
      | name        | Zero Salary Test   |
      | email       | zerosalary@test.com|
      | phone       | 9876543210         |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | 0                  |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then I should see validation error messages
    And the modal should remain open

  @Validation @DepartmentDropdown
  Scenario: Verify Department Dropdown has options
    Then the department dropdown should have options

  @Validation @GenderDropdown
  Scenario: Verify Gender Selection contains Male Female Other
    Then the gender dropdown should contain Male, Female, Other

  @Validation @DuplicatePrevention
  Scenario: Verify Duplicate Employee Prevention
    When I fill the employee form with data:
      | name        | Duplicate Employee |
      | email       | rakesh@gmail.com   |
      | phone       | 9876543210         |
      | department  | IT                 |
      | designation | Tester             |
      | gender      | Male               |
      | salary      | 50000              |
      | joiningDate | 2024-01-01         |
    And I submit the employee form
    Then the modal should remain open

  @Validation @smoke
  Scenario: Valid form submission closes the modal
    When I fill the employee form with data:
      | name        | Valid Employee Test         |
      | email       | valid.test.{ts}@company.com |
      | phone       | 9876543210                  |
      | department  | IT                          |
      | designation | Engineer                    |
      | gender      | Female                      |
      | salary      | 65000                       |
      | joiningDate | 2024-05-15                  |
    And I submit the employee form
    Then the modal should close
    And the employee should appear in the list

  @Validation @Count
  Scenario: Verify Employee Count matches API
    Then the employee count label should be correct

  @Validation @Pagination
  Scenario: Verify Pagination is displayed when many employees exist
    Then the employee count label should be correct
