import { config } from "dotenv";
config();

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByaW5jZSBPbnVrd2lsaSIsImlhdCI6MTUxNjIzOTAyMn0.VDAS_tMGDZj_6IlRfWvcQtG8gOV4wHHtqHsmt7VAKP8";
const refresh_token = "c867a10e-3051-4440-b3c1-979457c4b538";

describe("Test cases responsible for the Login endpoint and it's components", () => {
  it("Should validate sign-up link", () => {
    cy.visit("/login");

    // Get the sign up link and click it
    cy.getByDataCyAttribute("sign_up_link").contains("Sign up").as("signup");
    cy.get("@signup").click();

    // Should redirect to the register page
    cy.location("pathname").should("eq", "/register");
  });

  it("Should validate the login form input fields", () => {
    cy.visit("/login");

    cy.contains("Login").should("exist");
    cy.get("form").as("loginForm");

    cy.getByPlaceholder("Enter your email").as("emailInput");

    // Don't type anything into the email input
    // cy.getByDataCyAttribute("email_error").should("exist");
    // // cy.get("@emailInput").focus();
    // cy.get("@emailInput").type("onukwilip");
    // cy.get("@emailInput").parent().click();
    // cy.get("@loginForm").click({ force: true });
    cy.blurMUIInput("@emailInput", "@loginForm");
    // cy.contains("Email input must be a valid email address");

    // Type in an invalid email address into the email input
    cy.get("@emailInput").type("onukwilip");
    // cy.getByDataCyAttribute("email_error").should("exist");
    cy.contains("Email input must be a valid email address");

    // Type in an invalid email address into the email input
    cy.get("@emailInput").clear().type("onukwilip@gmail");
    // cy.getByDataCyAttribute("email_error").should("exist");
    cy.contains("Email input must be a valid email address");

    // Type in a valid email address into the email input
    cy.get("@emailInput").clear().type("onukwilip@gmail.com");
    // cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );

    cy.getByPlaceholder("Enter your password").as("@password");

    // Don't type anything into the password input
    cy.get("@password").focus().blur();
    cy.getByDataCyAttribute("password_error").should("exist");
    cy.contains("Password input should not be empty");

    // Type in a valid character into the password input
    cy.get("@password").type("onukwilip12+_");
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.contains("Password input should not be empty").should("not.exist");
  });

  it("Should validate the form submission, submit successfully and validate if the user is authenticated", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/login`, {
      statusCode: 200,
      data: {
        message: "User logged in successfully",
      },
      headers: {
        "Set-Cookie": `access_token=${access_token}; refresh_token=${refresh_token}`,
      },
    }).as("sendRequest");

    cy.visit("/login");

    cy.getByPlaceholder("Enter your email").as("email");
    cy.getByPlaceholder("Enter your password").as("password");

    // Get the submission button
    cy.get("form")
      .findByDataCyAttribute("submit")
      .contains("Login")
      .as("loginBtn");

    // Submit the form without entering any input
    cy.get("@loginBtn").click();

    // Email input should display an error
    cy.getByDataCyAttribute("email_error").should("exist");
    cy.contains("Email input must be a valid email address");

    // Password input should display an error
    cy.getByDataCyAttribute("password_error").should("exist");
    cy.contains("Password input should not be empty");

    // Type into the email and password fields
    cy.get("@email").type("onukwilip@gmail.com");
    cy.get("@password").type("onukwilip12+_");

    // Email input should NOT display an error
    cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );

    // Password input should NOT display an error
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.contains("Password input should not be empty").should("not.exist");

    // Submit the validated form
    cy.get("@loginBtn").click();

    // Verify if the endpoint was called
    cy.wait("@sendRequest").then((res) => {
      expect(res.response?.statusCode).to.eq(200);
    });

    // Form inputs should be reset
    cy.get("@email").should("have.value", "");
    cy.get("@password").should("have.value", "");

    // Check if auth cookie values exist
    cy.getCookie("access_token").should("have.property", "value", access_token);
    cy.getCookie("refresh_token").should(
      "have.property",
      "value",
      refresh_token
    );
  });

  it("Should validate the output message when a user is not validated", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/login`, {
      statusCode: 401,
      data: {
        message: "Invalid username or password",
      },
    }).as("sendRequest");

    cy.visit("/login");

    cy.getByPlaceholder("Enter your email").as("email");
    cy.getByPlaceholder("Enter your password").as("password");

    // Get the submission button
    cy.get("form")
      .findByDataCyAttribute("submit")
      .contains("Login")
      .as("loginBtn");

    cy.get("@email").type("onukwilip@gmail.com");
    cy.get("@password").type("onukwilip12+_");

    // Submit the validated form
    cy.get("@loginBtn").click();

    // Verify if the endpoint was called
    cy.wait("@sendRequest").then((res) => {
      expect(res.response?.statusCode).to.eq(401);
    });

    // Should display error message
    cy.get("form").contains("Invalid username or password");

    // Form inputs should retain their values
    cy.get("@email").should("have.value", "onukwilip@gmail.com");
    cy.get("@password").should("have.value", "onukwilip12+_");
  });

  it("Should validate the output message if there is a server error", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/login`, {
      statusCode: 500,
      data: {
        message: "Something occurred",
      },
    }).as("sendRequest");

    cy.visit("/login");

    cy.getByPlaceholder("Enter your email").as("email");
    cy.getByPlaceholder("Enter your password").as("password");

    // Get the submission button
    cy.get("form")
      .findByDataCyAttribute("submit")
      .contains("Login")
      .as("loginBtn");

    cy.get("@email").type("onukwilip@gmail.com");
    cy.get("@password").type("onukwilip12+_");

    // Submit the validated form
    cy.get("@loginBtn").click();

    // Verify if the endpoint was called
    cy.wait("@sendRequest").then((res) => {
      expect(res.response?.statusCode).to.eq(500);
    });

    // Should display error message
    cy.get("form").contains("Something occurred. Please try again");

    // Form inputs should retain their values
    cy.get("@email").should("have.value", "onukwilip@gmail.com");
    cy.get("@password").should("have.value", "onukwilip12+_");
  });
});
