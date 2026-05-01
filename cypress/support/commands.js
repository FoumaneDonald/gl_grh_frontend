import { useAuthStore } from "../../src/core/auth/authStore";

// Programmatic login — bypasses UI, sets store directly
// Used to set up state before testing protected routes
Cypress.Commands.add("loginAs", (role) => {
  const users = {
    SUPER_ADMIN: {
      token: "mock.jwt.token.superadmin",
      user: {
        id: 1,
        fullName: "Super Admin",
        email: "super.admin@email.com",
        role: { id: 1, name: "SUPER_ADMIN" },
      },
    },
    EMPLOYE: {
      token: "mock.jwt.token.employe",
      user: {
        id: 2,
        fullName: "Test Employe",
        email: "employe@grh.com",
        role: { id: 5, name: "EMPLOYE" },
      },
    },
    COMPTABLE: {
      token: "mock.jwt.token.comptable",
      user: {
        id: 3,
        fullName: "Test Comptable",
        email: "comptable@grh.com",
        role: { id: 6, name: "COMPTABLE" },
      },
    },
  };

  const { token, user } = users[role];

  // Set auth state in localStorage directly (Zustand persist key)
  localStorage.setItem(
    "grh-auth",
    JSON.stringify({
      state: { token, user, isAuthenticated: true },
      version: 0,
    }),
  );

  // Also intercept /users/me so AuthProvider validation passes
  cy.intercept("GET", "**/users/me", { statusCode: 200, body: user }).as(
    "getMe",
  );
});

// Intercept login API
Cypress.Commands.add("mockLoginSuccess", (userFixture) => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: auth.loginSuccess,
    }).as("login");
    cy.intercept("GET", "**/users/me", {
      statusCode: 200,
      body: auth[userFixture] || auth.userSuperAdmin,
    }).as("getMe");
  });
});

Cypress.Commands.add("mockLoginFailure", () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: auth.loginError,
    }).as("login");
  });
});

Cypress.Commands.add("mockRegisterSuccess", () => {
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

Cypress.Commands.add("mockRegisterFailure", () => {
  cy.fixture("auth").then((auth) => {
    cy.intercept("POST", "**/auth/signup", {
      statusCode: 409,
      body: auth.registerError,
    }).as("register");
  });
});
