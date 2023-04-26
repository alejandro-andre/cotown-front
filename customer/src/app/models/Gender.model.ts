import { BasicInterface } from "./interfaces";

export class Gender {
  genders: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.genders = data;
  }
};
