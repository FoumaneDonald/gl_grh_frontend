Feature: Protected Routes

  Scenario: Unauthenticated user visits dashboard
    Given I am not logged in
    When I visit "/"
    Then I should be redirected to "/login"

  Scenario: Unauthenticated user visits employees page
    Given I am not logged in
    When I visit "/employees"
    Then I should be redirected to "/login"

  Scenario: EMPLOYE role visits employees page
    Given I am logged in as "EMPLOYE"
    When I visit "/employees"
    Then I should be redirected to "/unauthorized"

  Scenario: SUPER_ADMIN visits employees page
    Given I am logged in as "SUPER_ADMIN"
    When I visit "/employees"
    Then I should see the page content "M1 — Employees"

  Scenario: COMPTABLE visits payroll page
    Given I am logged in as "COMPTABLE"
    When I visit "/payroll"
    Then I should see the page content "M3 — Payroll"

  Scenario: COMPTABLE visits employees page
    Given I am logged in as "COMPTABLE"
    When I visit "/employees"
    Then I should be redirected to "/unauthorized"