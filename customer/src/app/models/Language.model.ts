import { BasicInterface } from "./interfaces";

export class Languages {
  languages: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.languages = data;
  }
};
