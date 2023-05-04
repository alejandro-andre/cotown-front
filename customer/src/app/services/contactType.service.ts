import { Injectable } from '@angular/core';

import { ContactType } from '../models/ContactsType.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class ContactTypeService {
  public contactTypeModel = new ContactType();

  constructor() {}

  setContactTypesData(data: BasicResponse []) {
    this.contactTypeModel.contacts = data;
  }

  get contacts(): BasicResponse[] {
    return this.contactTypeModel.contacts || [];
  }
}