Feature: Register

  Background:
    Given I am on the register page

  @successRegister
  Scenario: Successful registration with valid data
    When I fill the registration form with name "New User" email "newuser@grh.com" and password "password123"
    And I submit the register form
    Then I should be redirected to the dashboard

  @failRegister
  Scenario: Register with already existing email
    When I fill the registration form with name "Super Admin" email "super.admin@email.com" and password "password123"
    And I submit the register form
    Then I should see an error message "Email already exists"

  Scenario: Register with mismatched passwords
    When I enter registration name "Test" email "test@grh.com" password "password123" and confirm "different123"
    And I submit the register form
    Then I should see a field error "Passwords do not match"

  Scenario: Register with password too short
    When I fill the registration form with name "Test" email "test@grh.com" and password "abc"
    And I submit the register form
    Then I should see a field error "Password must be at least 6 characters"

  Scenario: Register with empty fields
    When I submit the register form
    Then I should see a field error "Full name must be at least 2 characters"

  Scenario: Already authenticated user visits register page
    Given I am logged in as "SUPER_ADMIN"
    When I visit "/register"
    Then I should be redirected to the dashboard