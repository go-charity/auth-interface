export type CustomerTypeType = "orphanage" | "donor" | undefined;

export type SignupDetailsType = {
  customertype: CustomerTypeType;
  emailAddress: string | undefined;
  password: string | undefined;
  governmentIssuedID?: string;
};

export type SignupSectionNames = "customerType" | "signupForm";

export type SignupSectionBasePropsType = {
  updateCurrentSection: React.Dispatch<
    React.SetStateAction<SignupSectionNames>
  >;
  updateSignUpDetails: React.Dispatch<React.SetStateAction<SignupDetailsType>>;
  signupDetails: SignupDetailsType;
  updateCurrentSectionValidateStatus: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export type OTPConfigType = {
  email: string;
  mode: "login" | "registeration" | "changePassword";
};
