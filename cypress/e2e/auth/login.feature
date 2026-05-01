Feature: Login

  Background:
    Given I am on the login page

  @successLogin
  Scenario: Successful login with valid credentials
    When I enter email "super.admin@email.com" and password "123456"
    And I submit the login form
    Then I should be redirected to the dashboard

  @failLogin
  Scenario: Login with wrong password
    When I enter email "super.admin@email.com" and password "wrongpassword"
    And I submit the login form
    Then I should see an error message "Invalid email or password"

  @failLogin
  Scenario: Login with non-existent email
    When I enter email "nobody@grh.com" and password "password123"
    And I submit the login form
    Then I should see an error message "Invalid email or password"

  Scenario: Login with empty email
    When I enter email "" and password "password123"
    And I submit the login form
    Then I should see a field error "Invalid email address"

  Scenario: Login with empty password
    When I enter email "super.admin@email.com" and password ""
    And I submit the login form
    Then I should see a field error "Password is required"

  Scenario: Login with invalid email format
    When I enter email "notanemail" and password "password123"
    And I submit the login form
    Then I should see a field error "Invalid email address"

  Scenario: Already authenticated user visits login page
    Given I am logged in as "SUPER_ADMIN"
    When I visit "/login"
    Then I should be redirected to the dashboard