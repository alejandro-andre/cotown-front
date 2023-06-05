import { BasicResponse } from "../constants/Interface";

export class ContactType {
  contacts: BasicResponse[] = [];
  constructor(data: BasicResponse[] = [] as BasicResponse []) {
    this.contacts = data;
  }
};
