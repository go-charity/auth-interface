"use client";
import React, { useEffect, useState } from "react";
import css from "@/styles/OTP.module.scss";
import logo from "@/assets/images/logo.png";
import otpIcon from "@/assets/images/otp-icon-light.png";
import {
  Alert,
  Button,
  Slide,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import { useInput } from "use-manage-form";
import { useRouter } from "next/navigation";
import { OTPConfigType } from "@/types";
import useAjaxRequest from "use-ajax-request";
import { authBackendInstance } from "@/utils/interceptors";
import { useTimer } from "use-timer";

const OTP = () => {
  const orphanage_dashboard =
    process.env.NEXT_PUBLIC_ORPHANAGE_ACCOUNT_CLIENT_DOMAIN;
  const {
    value: OTPValue,
    onChange: onOTPChange,
    onBlur: onOTPBlur,
  } = useInput<string>({
    validateFunction: (value) => value?.length === 6,
    defaultValue: "",
  });
  const [emailToValidate, setEmailToValidate] = useState("");
  const [otpMode, setOtpMode] = useState<
    ("login" | "registeration" | "changePassword") | undefined
  >();
  const [showCreeatedOTPSnackBar, setShowCreatedOTPSnackBar] = useState(false);
  const [showValidatedOTPSnackBar, setShowValidatedOTPSnackBar] =
    useState(false);

  const { time, start, reset, status } = useTimer({
    timerType: "DECREMENTAL",
    initialTime: 300,
    endTime: 0,
  });
  const router = useRouter();

  const sendOTPToServerBody = {
    email: emailToValidate,
  };
  const verifyOTPOnServerRequestBody = {
    email: emailToValidate,
    otp: OTPValue,
  };

  const {
    sendRequest: sendOTPToServer,
    loading: creatingOTP,
    data: createdOTP,
  } = useAjaxRequest<string>({
    instance: authBackendInstance,
    options: {
      url: `/v1/otp/create`,
      method: "POST",
      headers: { mode: "login" },
      data: sendOTPToServerBody,
    },
  });

  const {
    sendRequest: verifyOTPOnServer,
    loading: verifyingOTP,
    data: verifiedOTP,
    error: errorVerifyingOTP,
  } = useAjaxRequest<{
    access_token: string;
    refresh_token: string;
    user_id: string;
  }>({
    instance: authBackendInstance,
    options: {
      url: `/v1/otp/verify`,
      method: "POST",
      headers: { mode: "login" },
      data: verifyOTPOnServerRequestBody,
    },
  });

  const sendOTP = async () => {
    if (!creatingOTP && status === "STOPPED")
      await sendOTPToServer(
        (res) => {
          if (res?.status === 201) {
            setShowCreatedOTPSnackBar(true);
            reset();
            start();
          }
        },
        (err) => {
          setShowCreatedOTPSnackBar(true);
        }
      );
  };
  const verifyOTP = async () => {
    verifyOTPOnServerRequestBody.otp = window.btoa(OTPValue as string);
    await verifyOTPOnServer((res) => {
      if (otpMode === "login" || otpMode === "registeration")
        router.replace(
          orphanage_dashboard
            ? `${orphanage_dashboard}/${res.data.user_id}`
            : "/"
        );
      //TODO: Implement algorithm for if mode was set to 'changePassword'
    });
    setShowValidatedOTPSnackBar(true);
  };

  const closeCreatedOTPSnackBar = (_: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;

    setShowCreatedOTPSnackBar(false);
  };
  const closeValidatedOTPSnackBar = (_: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;

    setShowValidatedOTPSnackBar(false);
  };

  useEffect(() => {
    const otpConfig = sessionStorage.getItem("otpConfig");
    if (
      !otpConfig ||
      !(
        JSON.parse(window.atob(otpConfig)).email &&
        JSON.parse(window.atob(otpConfig)).mode
      )
    ) {
      alert("Invalid configuration!");
      return router.replace("/");
    }

    const parsedOTPConfig: OTPConfigType = JSON.parse(window.atob(otpConfig));

    setEmailToValidate(parsedOTPConfig.email);
    setOtpMode(parsedOTPConfig.mode);

    // Send the token for the first time
    sendOTPToServerBody.email = parsedOTPConfig.email;
    sendOTP();
  }, []);

  return (
    <div className={css["otp-section"]}>
      <div className={css.left}>
        <a
          href={`${process.env.NEXT_PUBLIC_GOCHARITY_DOMAIN}`}
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
          <Button
            variant="contained"
            onClick={verifyOTP}
            disabled={verifyingOTP}
          >
            {verifyingOTP ? "Verifying..." : "Verify"}
          </Button>
        </form>
        <span>
          {status === "STOPPED" ? (
            <>
              Didn't get the code?{" "}
              {creatingOTP ? (
                "sending your OTP..."
              ) : (
                <a onClick={sendOTP}>Resend it</a>
              )}
            </>
          ) : (
            `You will be able to resend your OTP in the next ${time} seconds`
          )}
        </span>
      </div>
      <Snackbar
        open={showCreeatedOTPSnackBar}
        autoHideDuration={6000}
        onClose={closeCreatedOTPSnackBar}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={closeCreatedOTPSnackBar as any}
          severity={createdOTP ? "success" : "error"}
        >
          {createdOTP
            ? `OTP sent to '${emailToValidate}' successfully`
            : "Something went wrong, please try again"}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showValidatedOTPSnackBar}
        autoHideDuration={6000}
        onClose={closeValidatedOTPSnackBar}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={closeValidatedOTPSnackBar as any}
          severity={verifiedOTP ? "success" : "error"}
        >
          {verifiedOTP
            ? `Email address verified successfully`
            : typeof errorVerifyingOTP === "object" &&
              errorVerifyingOTP?.response?.status === 400
            ? "Invalid OTP"
            : "Something went wrong, please try again"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OTP;
