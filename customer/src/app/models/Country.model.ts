import { BasicInterface } from "./interfaces";

export class Country {
  countries: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.countries = data;
  }
};
