import { Injectable } from '@angular/core';
import { BasicInterface } from '../models/interfaces';
import { ContactType } from '../models/ContactsType.model';

@Injectable({
  providedIn: 'root'
})

export class ContactTypeService {
  public contactTypeModel = new ContactType();

  constructor() {}

  setContactTypesData(data: BasicInterface []) {
    this.contactTypeModel.contacts = data;
  }

  get contacts(): BasicInterface[] {
    return this.contactTypeModel.contacts || [];
  }
}