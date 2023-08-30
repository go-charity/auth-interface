import { SignupSectionNames } from "@/types";

export class SignUpSectionClass<T> {
  constructor(
    public sectionName: SignupSectionNames,
    public sectionDisplayName: string,
    public Component: React.ReactElement<T, any>
  ) {}
}
