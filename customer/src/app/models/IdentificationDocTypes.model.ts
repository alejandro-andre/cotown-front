import { BasicResponse } from "../constants/Interface";

export class IdentificationDocTypes {
  types: BasicResponse[] = [];

  constructor(data: BasicResponse[] = [] as BasicResponse []) {
    this.types = data;
  }
};
