import { BasicResponse } from "../constants/Interface";

export class schoolOrCompany {
  schoolOrCompanies: BasicResponse[] = [];

  constructor(data: BasicResponse[] = [] as BasicResponse[]) {
    this.schoolOrCompanies = data;
  }
};
