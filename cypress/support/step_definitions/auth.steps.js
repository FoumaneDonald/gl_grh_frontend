import {
  Given,
  When,
  Then,
  Before,
} from "@badeball/cypress-cucumber-preprocessor";

// ─── BEFORE HOOKS (set up mocks before page loads) ───────────────────────────

Before({ tags: "@successLogin" }, () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: auth.loginSuccess,
    }).as("login");
    cy.intercept("GET", "**/users/me", {
      statusCode: 200,
      body: auth.userSuperAdmin,
    }).as("getMe");
  });
});

Before({ tags: "@failLogin" }, () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: auth.loginError,
    }).as("login");
  });
});

Before({ tags: "@successRegister" }, () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/signup", {
      statusCode: 200,
      body: auth.loginSuccess,
    }).as("register");
    cy.intercept("GET", "**/users/me", {
      statusCode: 200,
      body: auth.userSuperAdmin,
    }).as("getMe");
  });
});

Before({ tags: "@failRegister" }, () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/signup", {
      statusCode: 409,
      body: auth.registerError,
    }).as("register");
  });
});

// ─── GIVEN ───────────────────────────────────────────────────────────────────

Given("I am on the login page", () => {
  cy.intercept("GET", "**/users/me", { statusCode: 401 }).as("getMe");
  cy.visit("/login");
});

Given("I am on the register page", () => {
  cy.intercept("GET", "**/users/me", { statusCode: 401 }).as("getMe");
  cy.visit("/register");
});

Given("I am on the dashboard", () => {
  cy.visit("/");
});

Given("I am not logged in", () => {
  localStorage.removeItem("grh-auth");
  cy.intercept("GET", "**/users/me", { statusCode: 401 }).as("getMe");
});

Given("I am logged in as {string}", (role) => {
  cy.loginAs(role);
});

// ─── WHEN ─────────────────────────────────────────────────────────────────────

When("I enter email {string} and password {string}", (email, password) => {
  if (email) cy.get("#email").clear().type(email);
  if (password) cy.get("#password").clear().type(password);
});

// No default mock here — mocks are set up by Before hooks or scenario context
When("I submit the login form", () => {
  cy.get("button[type=submit]").click();
});

When(
  "I fill the registration form with name {string} email {string} and password {string}",
  (name, email, password) => {
    cy.get("#fullName").clear().type(name);
    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type(password);
    cy.get("#confirmPassword").clear().type(password);
  },
);

When(
  "I enter registration name {string} email {string} password {string} and confirm {string}",
  (name, email, password, confirm) => {
    cy.get("#fullName").clear().type(name);
    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type(password);
    cy.get("#confirmPassword").clear().type(confirm);
  },
);

When("I submit the register form", () => {
  cy.get("button[type=submit]").click();
});

When("I visit {string}", (path) => {
  cy.visit(path);
});

When("I click the logout button", () => {
  cy.get("button[title=Logout]").click();
});

// ─── THEN ─────────────────────────────────────────────────────────────────────

Then("I should be redirected to the dashboard", () => {
  cy.url().should("eq", Cypress.config().baseUrl + "/");
});

Then("I should be redirected to {string}", (path) => {
  cy.url().should("include", path);
});

Then("I should see an error message {string}", (message) => {
  cy.contains(message).should("be.visible");
});

Then("I should see a field error {string}", (message) => {
  cy.contains(message).should("be.visible");
});

Then("I should see the page content {string}", (content) => {
  cy.contains(content).should("be.visible");
});
