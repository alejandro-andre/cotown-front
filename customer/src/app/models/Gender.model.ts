import { BasicResponse } from "../constants/Interface";

export class Gender {
  genders: BasicResponse[] = [];

  constructor(data: BasicResponse[] = [] as BasicResponse []) {
    this.genders = data;
  }
};
