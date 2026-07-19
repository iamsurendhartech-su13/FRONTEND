# ===========================================================
# Feature: Login
# Covers: Valid Login, Invalid Login, Empty Fields
# ===========================================================

@Login
Feature: Login to Employee Management System

  Background:
    Given I am on the login page

  @Login @ValidLogin @smoke
  Scenario: Valid Login with correct credentials
    When I enter email "admin@admin.com" and password "admin123"
    Then I should be on the dashboard

  @Login @InvalidLogin
  Scenario: Invalid Login with wrong password
    When I enter email "admin@admin.com" and password "wrongpassword"
    Then I should see a login error message
    And I should remain on the login page

  @Login @InvalidLogin
  Scenario: Invalid Login with wrong email
    When I enter email "wrong@email.com" and password "admin123"
    Then I should see a login error message
    And I should remain on the login page

  @Login @EmptyFields
  Scenario: Login with empty credentials
    When I submit empty credentials
    Then I should remain on the login page

  @Login @EmptyFields
  Scenario: Login with empty password
    When I enter only the email "admin@admin.com"
    Then I should remain on the login page
