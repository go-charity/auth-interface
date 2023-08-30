import Login from "@/components/Login";
import React from "react";
import css from "@/styles/Login.module.scss";

const LoginPage = () => {
  return (
    <section className={css["login-page"]}>
      <Login />
    </section>
  );
};

export default LoginPage;
