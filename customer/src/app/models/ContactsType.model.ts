import { BasicInterface } from "./interfaces";

export class ContactType {
  contacts: BasicInterface[] = [];

  constructor(data: BasicInterface[] = [] as BasicInterface []) {
    this.contacts = data;
  }
};
