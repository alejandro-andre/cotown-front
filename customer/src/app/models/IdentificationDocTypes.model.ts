import { BasicInterface } from "./interfaces";

export class IdentificationDocTypes {
  types: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.types = data;
  }
};
