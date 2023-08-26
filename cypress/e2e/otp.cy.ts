describe("Test cases responsible for handling the OTP page", () => {
  it("Should redirect user to login page if the OTP session is empty", () => {
    cy.visit("/otp");
    // Ensure the redirect functionality works as expected
    cy.location("pathname").should("eq", "/login");
  });

  describe("Test cases, for if there is a valid OTP session in the browser session storage", () => {
    beforeEach(() => {
      cy.visit("/register").then((window) => {
        window.sessionStorage.setItem(
          "otpConfig",
          window.btoa(
            JSON.stringify({
              email: "onukwilip@gmail.com",
            })
          )
        );
      });
    });

    it("Should contain all the necessary UI", () => {
      cy.visit("/otp");

      cy.contains("Verify the OTP sent to onukwilip@gmail.com").should("exist");
      cy.getByPlaceholder("Enter OTP").should("exist");

      cy.getByDataCyAttribute("verify_otp").contains("Verify").should("exist");
    });

    it("Should validate OTP input, submit button and form submission", () => {
      cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/otp`, {
        statusCode: 200,
      }).as("otpReqest");

      cy.visit("/otp");

      cy.getByDataCyAttribute("verify_otp")
        .contains("Verify")
        .as("verify")
        .should("be.disabled");

      cy.getByPlaceholder("Enter OTP").as("otpInput").blur();
      cy.contains("OTP input must NOT be empty");
      cy.getByDataCyAttribute("otp_error");

      cy.get("@otpInput").type("345901");
      cy.contains("OTP input must NOT be empty").should("not.exist");
      cy.getByDataCyAttribute("otp_error").should("not.exist");
      cy.get("@verify").should("not.be.disabled");
      cy.get("@verify").click();

      cy.wait("@otpReqest").then((res) => {
        expect(res.response?.statusCode).to.eq(200);
      });
    });

    it("Should display valid output if verify OTP response is 'Incorrect OTP'", () => {
      cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/otp`, {
        statusCode: 400,
        data: {
          message: "The OTP provided is incorrect",
        },
      }).as("otpReqest");

      cy.visit("/otp");

      cy.submitOTPForm();

      cy.wait("@otpReqest").then((res) => {
        expect(res.response?.statusCode).to.eq(400);
      });

      cy.contains("Incorrect OTP");
    });

    it("Should display valid output if verify OTP response is 'Server error'", () => {
      cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/otp`, {
        statusCode: 500,
        data: {
          message: "Something occurred",
        },
      }).as("otpReqest");

      cy.visit("/otp");

      cy.submitOTPForm();

      cy.wait("@otpReqest").then((res) => {
        expect(res.response?.statusCode).to.eq(500);
      });

      cy.contains("Something occured. Please try again");
    });

    it("Should display valid output if verify OTP response is successfull after REGISTERATION", () => {
      cy.visit("/register").then((window) => {
        window.sessionStorage.setItem(
          "otpConfig",
          window.btoa(
            JSON.stringify({
              email: "onukwilip@gmail.com",
              mode: "registeration",
            })
          )
        );
      });

      cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/otp`, {
        statusCode: 200,
        data: {
          message: "User email authenticated",
        },
      }).as("otpReqest");

      cy.visit("/otp");

      cy.submitOTPForm();

      cy.wait("@otpReqest").then((res) => {
        expect(res.response?.statusCode).to.eq(200);
      });

      cy.contains(
        "Your email address has beem verified, you can proceed to log in"
      );
      cy.location("pathname").should("eq", "/login");
    });

    it("Should display valid output if verify OTP response is successfull after LOGIN", () => {
      cy.visit("/login").then((window) => {
        window.sessionStorage.setItem(
          "otpConfig",
          window.btoa(
            JSON.stringify({
              email: "onukwilip@gmail.com",
              mode: "login",
            })
          )
        );
      });

      cy.intercept("POST", `${process.env.AUTH_BACKEND_HOST}/v1/otp`, {
        statusCode: 200,
        data: {
          message: "User email authenticated",
        },
      }).as("otpReqest");

      cy.visit("/otp");

      cy.submitOTPForm();

      cy.wait("@otpReqest").then((res) => {
        expect(res.response?.statusCode).to.eq(200);
      });

      cy.contains(
        "Your email address has beem verified, you can proceed to log in"
      );
      cy.location("pathname").should("eq", "/account");
    });
  });
});
