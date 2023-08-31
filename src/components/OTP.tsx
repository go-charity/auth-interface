"use client";
import React, { useEffect, useState } from "react";
import css from "@/styles/OTP.module.scss";
import logo from "@/assets/images/logo.png";
import otpIcon from "@/assets/images/otp-icon-light.png";
import { Button, TextField } from "@mui/material";
import { useInput } from "use-manage-form";
import { useRouter } from "next/navigation";
import { OTPConfigType } from "@/types";

const OTP = () => {
  const {
    value: OTPValue,
    onChange: onOTPChange,
    onBlur: onOTPBlur,
  } = useInput<string>({
    validateFunction: (value) => value?.length === 6,
    defaultValue: "",
  });
  const [emailToValidate, setEmailToValidate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const otpConfig = sessionStorage.getItem("otpConfig");
    if (!otpConfig) {
      alert("Invalid configuration!");
      return router.replace("/");
    }

    const parsedOTPConfig: OTPConfigType = JSON.parse(
      window.atob(otpConfig || "")
    );

    setEmailToValidate(parsedOTPConfig.email);
  }, []);

  return (
    <div className={css["otp-section"]}>
      <div className={css.left}>
        <a
          href="https://go-charity.vercel.app"
          target="_blank"
          className={css.logo_container}
        >
          <img src={logo.src} alt="logo" className={css.logo} />
          <span className={css.name}>
            <span>GO</span>
            <span>Charity</span>
          </span>
        </a>
        <div className={css.content}>
          <span>We care about your account security.</span>
          <span>Get access to your Orders, Wishlist and Recommendations.</span>
        </div>
      </div>
      <div className={css.right}>
        <div className={css.content}>
          <span className={css.heading}>Validate OTP</span>
          <img src={otpIcon.src} alt="icon" />
          <span className={css.desc}>
            Please enter the OTP (one time password) to verify your account. A
            Code has been sent to {emailToValidate}
          </span>
        </div>
        <form>
          <TextField
            id="otp"
            name="otp"
            label="Enter your 6-digit code"
            placeholder="Enter your OTP sent to your account"
            variant="filled"
            type="number"
            inputProps={{ style: { color: "#8a113c" } }}
            InputLabelProps={{ style: { color: "#8a113c" } }}
            value={OTPValue}
            onChange={(e) => onOTPChange(e.target.value.slice(0, 6))}
            onBlur={onOTPBlur as any}
            className={css.input}
          />
          <Button variant="contained">Verify</Button>
        </form>
        <span>
          Didn't get the code? <a>Resend it</a>
        </span>
      </div>
    </div>
  );
};

export default OTP;
