import { BasicResponse } from "../constants/Interface";

export class Languages {
  languages: BasicResponse[] = [];

  constructor(data: BasicResponse[] = [] as BasicResponse []) {
    this.languages = data;
  }
};
