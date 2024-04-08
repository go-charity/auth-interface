"use client";
import React, { FC, useEffect, useState } from "react";
import css from "@/styles/Register.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Slide,
  SnackbarCloseReason,
  Autocomplete,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";
import { useForm, useInput } from "use-manage-form";
import {
  CountryCode2AutoCompleteType,
  CountryCodeAutoCompleteType,
  CustomerTypeType,
  SignupDetailsType,
  SignupSectionBasePropsType,
  SignupSectionNames,
} from "@/types";
import { SignUpSectionClass } from "@/utils/utils";
import { useRouter } from "next/navigation";
import useAjaxRequest from "use-ajax-request";
import { authBackendInstance } from "@/utils/interceptors";
import { country_codes, country_codes2 } from "@/utils/data.json";

const CustomerTypeSection: FC<SignupSectionBasePropsType> = ({
  signupDetails,
  updateSignUpDetails,
  updateCurrentSectionValidateStatus,
}) => {
  const [activeCustomerType, setActiveCustomerType] =
    useState<CustomerTypeType>(undefined);

  const onTypeChange = (type: CustomerTypeType) => {
    setActiveCustomerType(type);
    updateSignUpDetails((prevDetails) => ({
      ...prevDetails,
      customertype: type,
    }));
    updateCurrentSectionValidateStatus(true);
  };

  useEffect(() => {
    setActiveCustomerType(signupDetails.customertype);
  }, []);

  return (
    <>
      <div className={css["customer-type-section"]}>
        <h2>Choose a sign up method</h2>
        <div className={css.customer_type_container}>
          <div
            className={`${css.customer_type} ${
              activeCustomerType === "donor" ? css.active : undefined
            }`}
            onClick={() => onTypeChange("donor")}
            data-cy="donor_signup"
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <span>Sign up as a donor</span>
          </div>
          <div
            className={`${css.customer_type} ${
              activeCustomerType === "orphanage" ? css.active : undefined
            }`}
            onClick={() => onTypeChange("orphanage")}
            data-cy="orphanage_signup"
          >
            <i className="fa-solid fa-hands-holding-child"></i>{" "}
            <span>Sign up as an orphanage</span>
          </div>
        </div>
      </div>
    </>
  );
};

const SignUpForm: FC<SignupSectionBasePropsType> = ({
  signupDetails,
  updateSignUpDetails,
}) => {
  const router = useRouter();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    value: governmentID,
    isValid: governmentIDisValid,
    inputIsInValid: governmentIDInputIsInvalid,
    onChange: onGovernmentIDChange,
    onBlur: onGovernmentIDBlur,
    reset: resetGovernmentID,
  } = useInput<string>({
    validateFunction: (value) => (value ? true : false && value?.trim() != ""),
    defaultValue: "",
  });

  const {
    value: fullname,
    isValid: fullnameisValid,
    inputIsInValid: fullnameInputIsInvalid,
    onChange: onFullnameChange,
    onBlur: onFullnameBlur,
    reset: resetFullname,
  } = useInput<string>({
    validateFunction: (value) => (value ? value?.trim() != "" : false),
    defaultValue: "",
  });

  const {
    value: phoneNumber,
    isValid: phoneNumberisValid,
    inputIsInValid: phoneNumberInputIsInvalid,
    onChange: onPhoneNumberChange,
    onBlur: onPhoneNumberBlur,
    reset: resetPhoneNumber,
  } = useInput<string>({
    validateFunction: (value) => (value ? value[0] !== "0" : false),
    defaultValue: "",
  });

  const {
    value: countryCode,
    isValid: countryCodeisValid,
    inputIsInValid: countryCodeInputIsInvalid,
    onChange: onCountryCodeChange,
    onBlur: onCountryCodeBlur,
    reset: resetCountryCode,
  } = useInput<string>({
    validateFunction: (value) => (value ? value?.trim() !== "" : false),
    defaultValue: "",
  });

  const {
    value: tagline,
    onChange: onTaglineChange,
    onBlur: onTaglineBlur,
  } = useInput<string>({
    validateFunction: (_) => true,
    defaultValue: "",
  });

  const {
    value: email,
    isValid: emailisValid,
    inputIsInValid: emailInputIsInvalid,
    onChange: onEmailChange,
    onBlur: onEmailBlur,
    reset: resetEmail,
  } = useInput<string>({
    validateFunction: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as any),
    defaultValue: "",
  });

  const {
    value: password,
    isValid: passwordisValid,
    inputIsInValid: passwordInputIsInvalid,
    onChange: onPasswordChange,
    onBlur: onPasswordBlur,
    reset: resetPassword,
  } = useInput<string>({
    validateFunction: (value) =>
      value?.trim() != "" &&
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,100}$/.test(
        value as any
      ),
    defaultValue: "",
  });

  const {
    value: confirmPassword,
    isValid: confirmPasswordisValid,
    inputIsInValid: confirmPasswordInputIsInvalid,
    onChange: onConfirmPasswordChange,
    onBlur: onConfirmPasswordBlur,
    reset: resetConfirmPassword,
  } = useInput<string>({
    validateFunction: (value) => value?.trim() != "" && value === password,
    defaultValue: "",
  });

  const onInputChange = (
    value: string,
    changeHandler: Function,
    property:
      | "emailAddress"
      | "password"
      | "governmentIssuedID"
      | "confirmPassword"
  ) => {
    changeHandler(value);

    if (Object.hasOwn(signupDetails, property))
      updateSignUpDetails((prevValues) => ({
        ...prevValues,
        [property]: value,
      }));
  };

  const onMetadataInputChange = (
    value: string,
    changeHandler: Function,
    property: "fullname" | "phone_number" | "tagline" | "countryCode"
  ) => {
    changeHandler(value);

    if (Object.hasOwn(signupDetails.metadata, property))
      updateSignUpDetails((prevValues) => ({
        ...prevValues,
        metadata: {
          ...prevValues.metadata,
          [property]: value,
        },
      }));
  };

  const { formIsValid, executeBlurHandlers, reset } = useForm({
    blurHandlers: [
      onEmailBlur,
      onGovernmentIDBlur,
      onPasswordBlur,
      onConfirmPasswordBlur,
      onFullnameBlur,
      onPhoneNumberBlur,
      onCountryCodeBlur,
    ],
    resetHandlers: [
      resetGovernmentID,
      resetEmail,
      resetPassword,
      resetConfirmPassword,
      resetFullname,
      resetPhoneNumber,
      resetCountryCode,
    ],
    validateOptions: () =>
      (signupDetails.customertype === "orphanage"
        ? governmentIDisValid
        : true) &&
      emailisValid &&
      passwordisValid &&
      confirmPasswordisValid &&
      fullnameisValid &&
      countryCodeisValid &&
      phoneNumberisValid,
  });

  const {
    sendRequest: registerUser,
    loading,
    error,
    data,
  } = useAjaxRequest<{
    otp_access_token: string;
  }>({
    instance: authBackendInstance,
    options: {
      url: `/v1/register`,
      method: "POST",
      data: {
        email: email,
        password: window.btoa(password as string),
        government_ID: governmentID || "",
        user_type: signupDetails.customertype,
        metadata: {
          fullname: fullname,
          phone_number: `${countryCode}${phoneNumber}`,
          tagline: tagline,
        },
      },
    },
  });

  const closeSnackBar = (_: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;

    setShowSnackBar(false);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!formIsValid) {
      console.log("Invalid");
      return executeBlurHandlers();
    }

    await registerUser(
      (res) => {
        if (res?.status === 201) {
          // Display the popup info
          setShowSnackBar(true);

          window.sessionStorage.setItem(
            "otpConfig",
            window.btoa(
              JSON.stringify({
                email: email,
                mode: "registeration",
              })
            )
          );
          // Reset the form values
          reset();
          // redirect to the OTP page
          router.replace("/otp");
        }
      },
      (err) => {
        // Display the popup info
        setShowSnackBar(true);
      }
    );
  };

  useEffect(() => {
    onGovernmentIDChange(signupDetails.governmentIssuedID);
    onEmailChange(signupDetails.emailAddress);
    onPasswordChange(signupDetails.password);
    onFullnameChange(signupDetails.metadata.fullname);
    onPhoneNumberChange(signupDetails.metadata.phone_number);
    onTaglineChange(signupDetails.metadata.tagline);
    onCountryCodeChange(signupDetails.metadata.countryCode);
  }, []);

  return (
    <>
      <form
        action=""
        className={css.signup_form_section}
        onSubmit={submitHandler}
      >
        <h2>
          You are signing up as{" "}
          {signupDetails.customertype === "orphanage"
            ? "an Orphanage"
            : "a Donor"}
        </h2>
        {signupDetails.customertype === "orphanage" && (
          <TextField
            id="governmentID"
            name="governmentID"
            label="Government issued ID *"
            placeholder="Enter your government issued ID"
            variant="filled"
            type="text"
            inputProps={{ style: { color: "#8a113c" } }}
            InputLabelProps={{ style: { color: "#8a113c" } }}
            error={governmentIDInputIsInvalid}
            helperText={
              governmentIDInputIsInvalid && "ID input should not be empty"
            }
            data-cy={"governmentID"}
            value={governmentID}
            onChange={(e) =>
              onInputChange(
                e.target.value,
                onGovernmentIDChange,
                "governmentIssuedID"
              )
            }
            onBlur={onGovernmentIDBlur as any}
          />
        )}

        <TextField
          id="email"
          name="email"
          label="Email *"
          placeholder="Enter your email"
          variant="filled"
          type="email"
          inputProps={{ style: { color: "#8a113c" } }}
          InputLabelProps={{ style: { color: "#8a113c" } }}
          error={emailInputIsInvalid}
          helperText={
            emailInputIsInvalid && "Email input must be a valid email address"
          }
          data-cy={"email"}
          value={email}
          onChange={(e) =>
            onInputChange(e.target.value, onEmailChange, "emailAddress")
          }
          onBlur={onEmailBlur as any}
        />
        <TextField
          id="fullname"
          name="name"
          label="Name *"
          placeholder={
            signupDetails.customertype === "donor"
              ? "Enter your name"
              : "Enter the name of the orphanage"
          }
          variant="filled"
          type="text"
          inputProps={{ style: { color: "#8a113c" } }}
          InputLabelProps={{ style: { color: "#8a113c" } }}
          error={fullnameInputIsInvalid}
          helperText={fullnameInputIsInvalid && "Name input must not be empty"}
          data-cy={"fullname"}
          value={fullname}
          onChange={(e) =>
            onMetadataInputChange(e.target.value, onFullnameChange, "fullname")
          }
          onBlur={onFullnameBlur as any}
        />

        <div className={css.phone_number_container}>
          <Autocomplete
            disablePortal
            id="country-codes"
            value={countryCode as any}
            onChange={(_, data) =>
              onMetadataInputChange(
                data?.code,
                onCountryCodeChange,
                "countryCode"
              )
            }
            options={country_codes2}
            className={css.auto_complete}
            onBlur={onCountryCodeBlur as any}
            renderOption={(params, data) => (
              <li {...params}>
                {data.label}&nbsp;{data.code}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Code"
                name="country-code"
                variant="filled"
                error={countryCodeInputIsInvalid}
                helperText={
                  countryCodeInputIsInvalid &&
                  "Please enter a valid country code"
                }
              />
            )}
          />
          <TextField
            id="phone_number"
            name="phone_number"
            label="Phone number *"
            placeholder="Enter your phone number"
            variant="filled"
            type="tel"
            className={css.input}
            inputProps={{ style: { color: "#8a113c" } }}
            InputLabelProps={{ style: { color: "#8a113c" } }}
            error={phoneNumberInputIsInvalid}
            helperText={
              phoneNumberInputIsInvalid &&
              "Phone number input must not be empty, must not begin with '0'"
            }
            data-cy={"phone_number"}
            value={phoneNumber}
            onChange={(e) =>
              onMetadataInputChange(
                e.target.value,
                onPhoneNumberChange,
                "phone_number"
              )
            }
            onBlur={onPhoneNumberBlur as any}
          />
        </div>

        {signupDetails.customertype === "orphanage" && (
          <TextField
            id="tagline"
            name="tagline"
            label="Tagline"
            placeholder={"Enter the tagline of the orphanage"}
            variant="filled"
            type="text"
            inputProps={{ style: { color: "#8a113c" } }}
            InputLabelProps={{ style: { color: "#8a113c" } }}
            data-cy={"tagline"}
            value={tagline}
            onChange={(e) =>
              onMetadataInputChange(e.target.value, onTaglineChange, "tagline")
            }
            onBlur={onTaglineBlur as any}
          />
        )}

        {/* <TextField
          id="password"
          name="password"
          label="Password *"
          placeholder="Enter your password"
          variant="filled"
          type="password"
          inputProps={{ style: { color: "#8a113c" } }}
          InputLabelProps={{ style: { color: "#8a113c" } }}
          error={passwordInputIsInvalid}
          helperText={
            passwordInputIsInvalid &&
            "Password input should contain at least one uppercase letter, lowercase letter, number, special character, and must be at least 8 characters, but less than 100 characters"
          }
          data-cy={"password"}
          value={password}
          onChange={(e) =>
            onInputChange(e.target.value, onPasswordChange, "password")
          }
          onBlur={onPasswordBlur as any}
        /> */}

        <FormControl variant="filled">
          <InputLabel htmlFor="password" style={{ color: "#8a113c" }}>
            Password *
          </InputLabel>
          <FilledInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            inputProps={{ style: { color: "#8a113c" } }}
            error={passwordInputIsInvalid}
            data-cy={"password"}
            value={password}
            onChange={(e) =>
              onInputChange(e.target.value, onPasswordChange, "password")
            }
            onBlur={onPasswordBlur as any}
            endAdornment={
              <InputAdornment position="end">
                <i
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </InputAdornment>
            }
          />
          {passwordInputIsInvalid && (
            <FormHelperText style={{ color: "red" }}>
              Password input should contain at least one uppercase letter,
              lowercase letter, number, special character, and must be at least
              8 characters, but less than 100 characters
            </FormHelperText>
          )}
        </FormControl>

        {/* <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password *"
          placeholder="Re-enter your password"
          variant="filled"
          type="password"
          inputProps={{ style: { color: "#8a113c" } }}
          InputLabelProps={{ style: { color: "#8a113c" } }}
          error={confirmPasswordInputIsInvalid}
          helperText={
            confirmPasswordInputIsInvalid &&
            "Confirm password input should not be empty and must match password"
          }
          data-cy={"confirmPassword"}
          value={confirmPassword}
          onChange={(e) =>
            onInputChange(
              e.target.value,
              onConfirmPasswordChange,
              "confirmPassword"
            )
          }
          onBlur={onConfirmPasswordBlur as any}
        /> */}

        <FormControl variant="filled">
          <InputLabel htmlFor="password" style={{ color: "#8a113c" }}>
            Confirm password *
          </InputLabel>
          <FilledInput
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            placeholder="Re-enter your password"
            inputProps={{ style: { color: "#8a113c" } }}
            error={confirmPasswordInputIsInvalid}
            data-cy={"confirmPassword"}
            value={confirmPassword}
            onChange={(e) =>
              onInputChange(
                e.target.value,
                onConfirmPasswordChange,
                "confirmPassword"
              )
            }
            onBlur={onConfirmPasswordBlur as any}
            endAdornment={
              <InputAdornment position="end">
                <i
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                  className={`fa-solid ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </InputAdornment>
            }
          />
          {confirmPasswordInputIsInvalid && (
            <FormHelperText style={{ color: "red" }}>
              Confirm password input should not be empty and must match password
            </FormHelperText>
          )}
        </FormControl>

        <div className={css.action}>
          <Button variant="outlined" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Continue"}
          </Button>
        </div>
      </form>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={closeSnackBar as any}
          severity={data ? "success" : "error"}
        >
          {data
            ? "User created in successfully"
            : typeof error === "object" && error?.response?.status === 409
            ? `User already exists!`
            : "Something went wrong, please try again"}
        </Alert>
      </Snackbar>
    </>
  );
};

const Register = () => {
  const [signUpDetails, setSignUpDetails] = useState<SignupDetailsType>({
    customertype: undefined,
    emailAddress: undefined,
    password: undefined,
    governmentIssuedID: undefined,
    metadata: {
      fullname: undefined,
      phone_number: undefined,
      tagline: undefined,
      countryCode: undefined,
    },
  });
  const [currentSection, setCurrentSection] =
    useState<SignupSectionNames>("customerType");
  const [currentSectionValidateStatus, setCurrentSectionValidateStatus] =
    useState(false);

  const sections: SignUpSectionClass<any>[] = [
    new SignUpSectionClass<any>(
      "customerType",
      "customer type",
      (
        <>
          <CustomerTypeSection
            signupDetails={signUpDetails}
            updateCurrentSection={setCurrentSection}
            updateSignUpDetails={setSignUpDetails}
            updateCurrentSectionValidateStatus={setCurrentSectionValidateStatus}
          />
        </>
      )
    ),
    new SignUpSectionClass(
      "signupForm",
      "signup form",
      (
        <>
          <SignUpForm
            signupDetails={signUpDetails}
            updateCurrentSection={setCurrentSection}
            updateCurrentSectionValidateStatus={setCurrentSectionValidateStatus}
            updateSignUpDetails={setSignUpDetails}
          />
        </>
      )
    ),
  ];

  const getCurrentSection = () => {
    const activeSection = sections.find(
      (section) => section.sectionName === currentSection
    );
    if (activeSection) return activeSection;
    return sections[0];
  };

  const nextSection = () => {
    const currentSectionIndex = sections.findIndex(
      (section) => section.sectionName === currentSection
    );

    if (currentSectionIndex === sections.length - 1) return;

    setCurrentSection(sections[currentSectionIndex + 1].sectionName);
    setCurrentSectionValidateStatus(false);
  };

  const prevSection = () => {
    const currentSectionIndex = sections.findIndex(
      (section) => section.sectionName === currentSection
    );

    if (currentSectionIndex === 0) return;

    setCurrentSection(sections[currentSectionIndex - 1].sectionName);
    setCurrentSectionValidateStatus(true);
  };

  return (
    <div className={css["register-section"]}>
      <div className={css.left}>
        <span className={css.badge}>JOIN US</span>
        <span>Join Us in Transforming Lives!</span>
        <span>
          Join us today, and let's rewrite the story of orphanages in Nigeria,
          one donation, one connection, and one transformed life at a time.
        </span>
      </div>
      <div className={css.right}>
        <div className={css.logo_container}>
          <Image width={70} height={70} src={logo} alt="logo" />
          <span>Register</span>
        </div>
        <div className={css["sections-container"]}>
          {getCurrentSection().Component}
        </div>
        <div className={css.actions}>
          {sections.findIndex(
            (section) => currentSection === section.sectionName
          ) > 0 && (
            <Button
              variant="outlined"
              onClick={prevSection}
              data-cy="previous_process"
            >
              Previous
            </Button>
          )}
          {sections.findIndex(
            (section) => currentSection === section.sectionName
          ) <
            sections.length - 1 && (
            <Button
              disabled={!currentSectionValidateStatus}
              variant="outlined"
              onClick={nextSection}
              data-cy="next_process"
            >
              Next
            </Button>
          )}
        </div>
        <div className={css.link_container}>
          <span className={css.sign_in_container}>
            Already have an account?{" "}
            <Link href="/login" data-cy="sign_in_link">
              Sign in
            </Link>
          </span>
        </div>
      </div>
      <div className={css.bg}></div>
    </div>
  );
};

export default Register;
