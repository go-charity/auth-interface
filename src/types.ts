export type CustomerTypeType = "orphanage" | "donor" | undefined;

export type SignupDetailsType = {
  customertype: CustomerTypeType;
  emailAddress: string | undefined;
  password: string | undefined;
  governmentIssuedID?: string;
  metadata: {
    fullname: string | undefined;
    phone_number: string | undefined;
    tagline?: string;
    countryCode: string | undefined;
  };
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

export type CountryCodeAutoCompleteType = {
  country: string;
  label: string;
  iso: string;
};

export type CountryCode2AutoCompleteType = {
  label: string;
  code: string;
  iso: string;
};
