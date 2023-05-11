import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// Services
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { CustomerService } from 'src/app/services/customer.service';

// Interface
import { BasicResponse, ContactVariables } from 'src/app/constants/Interface';

// Queries
import { GET_CONTACTS_BY_CUSTOMERID, SET_NEW_CONTACT } from 'src/app/schemas/query-definitions/contact.query';

@Component({
  selector: 'app-contact-new',
  templateUrl: './newContact.component.html',
  styleUrls: ['./newContact.component.scss']
})

export class NewContactComponent {
  public contactType!: number;
  public name: string = '';
  public surName: string = '';
  public email: string = '';
  public phone: string = '';
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
  ]);

  constructor(
    public customerService: CustomerService,
    private contactTypeService: ContactTypeService,
    private apollo: ApoloQueryApi,
    private location: Location
  ) {}

  get contactTypes(): BasicResponse[] {
    return this.contactTypeService.contacts;
  }

  get isDisabled (): boolean {
    return this.contactType === null || this.name === '' || (this.email === '' && this.phone === '');
  }

  save() {
    const name = this.surName.length > 0 ? `${this.name} ${this.surName}` : this.name;
    const variables: ContactVariables = {
      name,
      id: this.customerService.customer.id,
      cid: this.contactType,
      email: this.email,
      phone: this.phone
    };

    this.apollo.setData(SET_NEW_CONTACT, variables).subscribe((ev) => {
      const varToSend = {
        customerId: this.customerService.customer.id
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
