import { Location } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { CustomerService } from 'src/app/services/customer.service';

// Interface
import { BasicResponse } from 'src/app/constants/Interface';

// Queries
import { GET_CONTACTS_BY_CUSTOMERID, SET_NEW_CONTACT } from 'src/app/schemas/query-definitions/contact.query';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact-new',
  templateUrl: './newContact.component.html',
  styleUrls: ['./newContact.component.scss']
})

export class NewContactComponent {
  constructor(
    public customerService: CustomerService,
    private contactTypeService: ContactTypeService,
    private apollo: ApoloQueryApi,
    private location: Location
  ) {}

  public contactType: number | null = null;
  public name: string = '';
  public surName: string = '';
  public email: string = '';
  public phone: string = '';

  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
  ]);

  get contactTypes(): BasicResponse[] {
    return this.contactTypeService.contacts;
  }

  get isDisabled (): boolean {
    return this.contactType === null || this.name === '' || (this.email === '' && this.phone === '');
  }

  save() {
    const id =916;
    const variables:{
      id: number,
      cid: number | null,
      name: string,
      email: string | undefined,
      phone: string | undefined
    } = {
      id,
      cid: this.contactType,
      name: this.name,
      email: this.email,
      phone: this.phone
    };

    if(this.email === '') {
      delete variables.email
    }

    if(this.phone === '') {
      delete variables.phone
    }

    this.apollo.setData(SET_NEW_CONTACT, variables).subscribe((ev) => {
      const varToSend = {
        customerId: id
      };

      this.apollo.getData(GET_CONTACTS_BY_CUSTOMERID, varToSend).subscribe((res) => {
        if(res.data && res.data.contacts) {
          this.customerService.setContacts(res.data.contacts);
          this.location.back();
        }
      });
    });
  }
}
