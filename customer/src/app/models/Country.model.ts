import { BasicResponse } from "../constants/Interface";

export class Country {
  countries: BasicResponse[] = [];

  constructor(data: BasicResponse[] = [] as BasicResponse []) {
    this.countries = data;
  }
};
