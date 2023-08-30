"use client";
import React, { FC, useEffect, useState } from "react";
import css from "@/styles/Register.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { TextField, Checkbox, Button } from "@mui/material";
import Link from "next/link";
import { useInput } from "use-manage-form";
import {
  CustomerTypeType,
  SignupDetailsType,
  SignupSectionBasePropsType,
  SignupSectionNames,
} from "@/types";
import { SignUpSectionClass } from "@/utils/utils";

const CustomerTypeSection: FC<SignupSectionBasePropsType> = ({
  signupDetails,
  updateCurrentSection,
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
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <span>Sign up as a donor</span>
          </div>
          <div
            className={`${css.customer_type} ${
              activeCustomerType === "orphanage" ? css.active : undefined
            }`}
            onClick={() => onTypeChange("orphanage")}
          >
            <i className="fa-solid fa-hands-holding-child"></i>{" "}
            <span>Sign up as an orphanage</span>
          </div>
        </div>
      </div>
    </>
  );
};

const Register = () => {
  const [signUpDetails, setSignUpDetails] = useState<SignupDetailsType>({
    customertype: undefined,
    emailAddress: undefined,
    password: undefined,
    governmentIssuedID: undefined,
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
    new SignUpSectionClass("signupForm", "signup form", <></>),
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
            <Button variant="outlined" onClick={prevSection}>
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
