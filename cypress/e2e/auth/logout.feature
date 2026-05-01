Feature: Logout

  Scenario: Authenticated user clicks logout
    Given I am logged in as "SUPER_ADMIN"
    And I am on the dashboard
    When I click the logout button
    Then I should be redirected to "/login"

  Scenario: After logout visiting dashboard redirects to login
    Given I am logged in as "SUPER_ADMIN"
    And I am on the dashboard
    When I click the logout button
    And I visit "/"
    Then I should be redirected to "/login"