import Register from "@/components/Register";
import React from "react";
import css from "@/styles/Register.module.scss";

const RegisterPage = () => {
  return (
    <section className={css["register-page"]}>
      <Register />
    </section>
  );
};

export default RegisterPage;
