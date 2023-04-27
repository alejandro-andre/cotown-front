import { BasicInterface } from "./interfaces";

export class schoolOrCompany {
  schoolOrCompanies: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.schoolOrCompanies = data;
  }
};
