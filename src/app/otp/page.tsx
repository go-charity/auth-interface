import React from "react";
import css from "@/styles/OTP.module.scss";
import OTP from "@/components/OTP";

const OTPPage = () => {
  return (
    <section className={css["otp-page"]}>
      <OTP />
    </section>
  );
};

export default OTPPage;
