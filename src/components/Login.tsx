"use client";
import React, { useState } from "react";
import css from "@/styles/Login.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { TextField, Checkbox, Button } from "@mui/material";
import Link from "next/link";
import { useInput } from "use-manage-form";

const Login = () => {
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
        <form className={css.form}>
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
            data-cy={emailInputIsInvalid ? "email_error" : "email"}
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
            data-cy={emailInputIsInvalid ? "password_error" : "password"}
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

          <Button
            variant="contained"
            sx={{
              color: "#ffffff",
              background: "#fe6e8b",
              "&:hover": {
                background: "#ffa2b3",
              },
            }}
          >
            Login
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
