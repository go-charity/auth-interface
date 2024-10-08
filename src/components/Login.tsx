"use client";
import React, { useState } from "react";
import css from "@/styles/Login.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import {
  TextField,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  Slide,
} from "@mui/material";
import Link from "next/link";
import { useForm, useInput } from "use-manage-form";
import useAjaxRequest from "use-ajax-request";
import { useRouter } from "next/navigation";
import { authBackendInstance } from "@/utils/interceptors";

const Login = () => {
  const router = useRouter();
  const orphanage_dashboard =
    process.env.NEXT_PUBLIC_ORPHANAGE_ACCOUNT_CLIENT_DOMAIN;
  const [showSnackBar, setShowSnackBar] = useState(false);
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
    validateFunction: (value) => (value ? true : false && value?.trim() != ""),
    defaultValue: "",
  });

  const loginUserRequestBody = { email: email, password: password };

  const {
    sendRequest: loginUser,
    loading,
    error,
    data,
  } = useAjaxRequest<{
    access_token: string;
    refresh_token: string;
    user_id: string;
  }>({
    instance: authBackendInstance,
    options: {
      url: `/v1/login`,
      method: "POST",
      data: loginUserRequestBody,
    },
  } as any);

  const { formIsValid, executeBlurHandlers, reset } = useForm({
    blurHandlers: [onEmailBlur, onPasswordBlur],
    resetHandlers: [resetEmail, resetPassword],
    validateOptions: () => emailisValid && passwordisValid,
  });

  const closeSnackBar = (_: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;

    setShowSnackBar(false);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!formIsValid) return executeBlurHandlers();

    loginUserRequestBody.password = window.btoa(password as string);
    await loginUser(
      (res) => {
        if (res?.status === 200) {
          setShowSnackBar(true);
          reset();
          router.replace(
            orphanage_dashboard
              ? `${orphanage_dashboard}/orphanage/${res.data.user_id}`
              : "/"
          );
        }
      },
      (err) => {
        setShowSnackBar(true);
        window.sessionStorage.setItem(
          "otpConfig",
          window.btoa(
            JSON.stringify({
              email: email,
              mode: "login",
            })
          )
        );
        if (err?.response?.status === 403) router.push("/otp");
      }
    );
  };

  return (
    <div className={css["login-section"]}>
      <div className={css.left}>
        <span className={css.badge}>WELCOME BACK</span>
        <span>GIVING A HELPING HAND TO THOSE WHO NEED IT!</span>
        <span>
          Our commitment goes beyond fundraising; we exist to amplify the voices
          of less privileged children, particularly those in orphanages.
        </span>
      </div>
      <div className={css.right}>
        <div className={css.logo_container}>
          <Image width={70} height={70} src={logo} alt="logo" />
          <span>Login</span>
        </div>
        <form className={css.form} onSubmit={submitHandler}>
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
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={onEmailBlur as any}
          />
          <TextField
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
              passwordInputIsInvalid && "Password input should not be empty"
            }
            data-cy={"password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={onPasswordBlur as any}
          />
          <label htmlFor="remember">
            <Checkbox
              id="remember"
              defaultChecked
              sx={{
                color: "#fe6e8b",
                "&.Mui-checked": {
                  color: "#fe6e8b",
                },
              }}
            />
            <span>Remember me</span>
          </label>
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
                ? "User signed in successfully"
                : typeof error === "object" && error?.response?.status === 403
                ? "Please activate your account!"
                : typeof error === "object" && error?.response?.status === 401
                ? "Invalid username or password"
                : "Something went wrong, please try again"}
            </Alert>
          </Snackbar>
          <Button
            variant="contained"
            disabled={loading}
            type="submit"
            data-cy="submit"
            sx={{
              color: "#ffffff",
              background: "#fe6e8b",
              "&:hover": {
                background: "#ffa2b3",
              },
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <div className={css.actions}>
          <a className={css.forgot_password}>Forgot password?</a>
          <span className={css.sign_up_container}>
            Dont have an account?{" "}
            <Link href="/register" data-cy="sign_up_link">
              Sign up
            </Link>
          </span>
        </div>
      </div>
      <div className={css.bg}></div>
    </div>
  );
};

export default Login;
