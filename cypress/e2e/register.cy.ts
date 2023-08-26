describe("Tests responsible for the register/sign-up endpoint", () => {
  it("Should validate login link", () => {
    cy.visit("/register");

    // Get the sign up link and click it
    cy.getByDataCyAttribute("sign_in_link").contains("sign in").as("signin");
    cy.get("@signin").click();

    // Should redirect to the register page
    cy.location("pathname").should("eq", "/login");
  });
  it("Should validate sign-up options", () => {
    cy.visit("/register");

    // Get the 'sign in as a donor', 'sign in as an orphanage' options and the 'next' button
    cy.getByDataCyAttribute("donor_signup").as("donor_signup");
    cy.getByDataCyAttribute("orphanage_signup").as("orphanage_signup");
    cy.getByDataCyAttribute("next_process").as("next_process");

    // The button that takes the user to the previous section should NOT exist
    cy.getByDataCyAttribute("previous_process").should("not.exist");

    // Validate if the sign-up options contain valid information
    cy.get("@donor_signup").should("contain", "Sign up as a donor");
    cy.get("@orphanage_signup").should("contain", "Sign up as an orphanage");

    // Both options to sign up as either a donor or orphanages should NOT be active/selected
    cy.get("@donor_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);
    cy.get("@orphanage_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);

    // The button to proceed should be disabled if no option was selected
    cy.get("@next_process").should("be.disabled");

    // Click on the 'sign up as a donor' option
    cy.get("@donor_signup").click();

    // Option to sign up as a donor should be active/selected, while the option to sign-up as an orphanage should NOT
    cy.get("@donor_signup")
      .should("have.attr", "class")
      .and("match", /active/);
    cy.get("@orphanage_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);

    // The button to proceed to the next stage should NOT be disabled after a sign-up option is selected, and it should be clickable
    cy.get("@next_process").should("not.be.disabled");
    cy.get("@next_process").click();

    // After the user chooses to sign-up as a donor and proceeds, he/she should view the procedure to sign-up as a donor, the two options to sign up as either a donor or an orphanage should not be in the DOM
    cy.contains("You are signing up as a donor");
    cy.getByDataCyAttribute("donor_signup").should("not.exist");
    cy.getByDataCyAttribute("orphanage_signup").should("not.exist");

    // The button that takes the user to the previous section should exist and be clickable
    cy.getByDataCyAttribute("previous_process").as("previous_process");
    cy.get("@previous_process").should("exist");
    cy.get("@previous_process").click();

    // After the button that takes the user to the previous section is clicked, it shouldn't be visible to the User
    cy.getByDataCyAttribute("previous_process").should("not.exist");

    // The options to sign up should still persist their state. I.e. The 'sign up as a donor' option should still be selected, while the 'sign up as an orphanage' should NOT be selected
    cy.get("@donor_signup")
      .should("have.attr", "class")
      .and("match", /active/);
    cy.get("@orphanage_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);

    // Click on the 'sign up as an orphanage' option
    cy.get("@orphanage_signup").click();

    // Option to sign up as an orphanage should be active/selected, while the option to sign-up as an donor should NOT
    cy.get("@orphanage_signup")
      .should("have.attr", "class")
      .and("match", /active/);
    cy.get("@donor_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);

    // The button to proceed to the next stage should NOT be disabled after a sign-up option is selected, and it should be clickable
    cy.get("@next_process").should("not.be.disabled");
    cy.get("@next_process").click();

    // After the user chooses to sign-up as an orphanage and proceeds, he/she should view the procedure to sign-up as an orphanage, the two options to sign up as either a donor or an orphanage should not be in the DOM
    cy.contains("You are signing up as an orphanage");
    cy.getByDataCyAttribute("donor_signup").should("not.exist");
    cy.getByDataCyAttribute("orphanage_signup").should("not.exist");

    // The button that takes the user to the previous section should exist and be clickable
    cy.getByDataCyAttribute("previous_process").as("previous_process");
    cy.get("@previous_process").should("exist");
    cy.get("@previous_process").click();

    // After the button that takes the user to the previous section is clicked, it shouldn't be visible to the User
    cy.getByDataCyAttribute("previous_process").should("not.exist");

    // The options to sign up should still persist their state. I.e. The 'sign up as an orphanage' option should still be selected, while the 'sign up as a donor' should NOT be selected
    cy.get("@orphanage_signup")
      .should("have.attr", "class")
      .and("match", /active/);
    cy.get("@donor_signup")
      .should("have.attr", "class")
      .and("not.match", /active/);
  });
  it("Should validate the orphanage sign up process form inputs on blur", () => {
    cy.visit("/register");

    // Get the 'sign in as an orphanage' options and the 'next' button, and click on them
    cy.getByDataCyAttribute("orphanage_signup").as("orphanage_signup").click();
    cy.getByDataCyAttribute("next_process").as("next_process").click();

    // Verify we are in the section to sign up as an orphanage
    cy.contains("You are signing up as an orphanage");

    // Should validate each input field, they should all return error on an invalid input
    cy.getByPlaceholder("Enter government issued ID").as("governmentID").blur();
    cy.getByDataCyAttribute("id_error");
    cy.contains("Government ID input must not be empty");

    cy.getByPlaceholder("Enter email address").as("email").blur();
    cy.getByDataCyAttribute("email_error");
    cy.contains("Email input must be a valid email address");

    cy.getByPlaceholder("Enter password").as("password").blur();
    cy.getByDataCyAttribute("password_error");
    cy.contains("Password input must not be empty");

    cy.getByPlaceholder("Confirm entered password")
      .as("confirmPassword")
      .blur();
    cy.getByDataCyAttribute("confirm_password_error");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Confirm passhowd input should return error if it's value isn't same as that of password
    cy.get("@password").type("examp12");
    cy.get("@confirmPassword").type("12htO");
    cy.getByDataCyAttribute("confirm_password_error");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Should validate each input field, they should NOT return error on a valid input
    cy.get("@governmentID").type("82hGny%5Ttg");
    cy.getByDataCyAttribute("id_error").should("not.exist");
    cy.contains("Government ID input must not be empty").should("not.exist");

    cy.get("@email").type("onukwilip@gmail.com");
    cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );

    cy.get("@password").type("onukwilip12+_");
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.contains("Password input must not be empty").should("not.exist");

    cy.get("@confirmPassword").type("onukwilip12+_");
    cy.getByDataCyAttribute("confirm_password_error").should("not.exist");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    ).should("not.exist");
  });
  it("Should validate the orphanage sign up process, and form inputs on submission", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 201,
      data: {
        message: "User created successfully",
      },
    });
    cy.visit("/register");

    // Get the 'sign in as an orphanage' options and the 'next' button, and click on them
    cy.getByDataCyAttribute("orphanage_signup").as("orphanage_signup").click();
    cy.getByDataCyAttribute("next_process").as("next_process").click();

    // Verify we are in the section to sign up as an orphanage
    cy.contains("You are signing up as an orphanage");

    // Click the submit button
    cy.getByDataCyAttribute("submit").contains("Next").as("submit").click();

    // Should display input errors
    cy.getByDataCyAttribute("id_error");
    cy.getByDataCyAttribute("email_error");
    cy.getByDataCyAttribute("password_error");
    cy.getByDataCyAttribute("confirm_password_error");

    // Should display input error message
    cy.contains("Government ID input must not be empty");
    cy.contains("Email input must be a valid email address");
    cy.contains("Password input must not be empty");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Type valid parameters into the input fields
    cy.getByPlaceholder("Enter government issued ID")
      .as("governmentID")
      .type("kk0uy7g1bHi8AS");
    cy.getByPlaceholder("Enter email address")
      .as("email")
      .type("onukwilip@gmail.com");
    cy.getByPlaceholder("Enter password").as("password").type("1234567");
    cy.getByPlaceholder("Confirm entered password")
      .as("confirmPassword")
      .type("1234567");

    // Should NOT display input errors
    cy.getByDataCyAttribute("id_error").should("not.exist");
    cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.getByDataCyAttribute("confirm_password_error").should("not.exist");

    // Should NOT display input error message
    cy.contains("Government ID input must not be empty").should("not.exist");
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );
    cy.contains("Password input must not be empty").should("not.exist");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    ).should("not.exist");

    // Submit the form again
    cy.get("@submit").click();
  });
  it("Should validate the output message based on success response code during the orphanage registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 201,
      data: {
        message: "User created successfully",
      },
    });

    // Submit the form
    cy.submitOrphanageSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains(
      "Your account have been successfully created, now proceed to verify your email address"
    );

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the output message based on user exists error response code during the orphanage registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 400,
      data: {
        message: "User already exists",
      },
    });

    // Submit the form
    cy.submitOrphanageSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains("User already exists");

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the output message based on server error response code during the orphanage registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 500,
      data: {
        message: "Something occurres, please try again...",
      },
    });

    // Submit the form
    cy.submitOrphanageSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains("Something occured please try again");

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the donor sign up process form inputs on blur", () => {
    cy.visit("/register");

    // Get the 'sign in as an donor' options and the 'next' button, and click on them
    cy.getByDataCyAttribute("donor_signup").as("donor_signup").click();
    cy.getByDataCyAttribute("next_process").as("next_process").click();

    // Verify we are in the section to sign up as an orphanage
    cy.contains("You are signing up as a donor");

    // Should validate each input field, they should all return error on an invalid input
    cy.getByPlaceholder("Enter email address").as("email").blur();
    cy.getByDataCyAttribute("email_error");
    cy.contains("Email input must be a valid email address");

    cy.getByPlaceholder("Enter password").as("password").blur();
    cy.getByDataCyAttribute("password_error");
    cy.contains("Password input must not be empty");

    cy.getByPlaceholder("Confirm entered password")
      .as("confirmPassword")
      .blur();
    cy.getByDataCyAttribute("confirm_password_error");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Confirm passhowd input should return error if it's value isn't same as that of password
    cy.get("@password").type("examp12");
    cy.get("@confirmPassword").type("12htO");
    cy.getByDataCyAttribute("confirm_password_error");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Should validate each input field, they should NOT return error on a valid input
    cy.get("@email").type("onukwilip@gmail.com");
    cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );

    cy.get("@password").type("onukwilip12+_");
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.contains("Password input must not be empty").should("not.exist");

    cy.get("@confirmPassword").type("onukwilip12+_");
    cy.getByDataCyAttribute("confirm_password_error").should("not.exist");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    ).should("not.exist");
  });
  it("Should validate the donor sign up process, and form inputs on submission", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 201,
      data: {
        message: "User created successfully",
      },
    });
    cy.visit("/register");

    // Get the 'sign in as an donor' option and the 'next' button, and click on them
    cy.getByDataCyAttribute("donor_signup").as("donor_signup").click();
    cy.getByDataCyAttribute("next_process").as("next_process").click();

    // Verify we are in the section to sign up as an orphanage
    cy.contains("You are signing up as a donor");

    // Click the submit button
    cy.getByDataCyAttribute("submit").contains("Next").as("submit").click();

    // Should display input errors
    cy.getByDataCyAttribute("email_error");
    cy.getByDataCyAttribute("password_error");
    cy.getByDataCyAttribute("confirm_password_error");

    // Should display input error message
    cy.contains("Email input must be a valid email address");
    cy.contains("Password input must not be empty");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    );

    // Type valid parameters into the input fields
    cy.getByPlaceholder("Enter email address")
      .as("email")
      .type("onukwilip@gmail.com");
    cy.getByPlaceholder("Enter password").as("password").type("1234567");
    cy.getByPlaceholder("Confirm entered password")
      .as("confirmPassword")
      .type("1234567");

    // Should NOT display input errors
    cy.getByDataCyAttribute("email_error").should("not.exist");
    cy.getByDataCyAttribute("password_error").should("not.exist");
    cy.getByDataCyAttribute("confirm_password_error").should("not.exist");

    // Should NOT display input error message
    cy.contains("Email input must be a valid email address").should(
      "not.exist"
    );
    cy.contains("Password input must not be empty").should("not.exist");
    cy.contains(
      "Confirm password input must not be empty, and must be same as password"
    ).should("not.exist");

    // Submit the form again
    cy.get("@submit").click();

    // Should contain success message
    cy.contains(
      "Your account have been successfully created, now proceed to verify your email address"
    );

    // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the output message based on success response code during the donor registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 201,
      data: {
        message: "User created successfully",
      },
    });

    // Submit the form
    cy.submitDonorSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains(
      "Your account have been successfully created, now proceed to verify your email address"
    );

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the output message based on user exists error response code during the donor registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 400,
      data: {
        message: "User already exists",
      },
    });

    // Submit the form
    cy.submitDonorSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains("User already exists");

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
  it("Should validate the output message based on server error response code during the donor registeration process", () => {
    cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/register`, {
      statusCode: 500,
      data: {
        message: "Something occurres, please try again...",
      },
    });

    // Submit the form
    cy.submitDonorSignUpForm();

    // Should display success message and redirect if response code is successful
    // // Should contain success message
    cy.contains("Something occured please try again");

    // // Should redirect to OTP verification page
    cy.location("pathname").should("eq", "/otp");
  });
});
