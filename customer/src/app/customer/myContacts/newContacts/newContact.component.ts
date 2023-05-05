import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicResponse } from 'src/app/constants/Interface';
import { SET_NEW_CONTACT } from 'src/app/schemas/query-definitions/contact.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { CustomerService } from 'src/app/services/customer.service';

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
    private router: Router,
  ) {}

  public contactType: number | null = null;
  public name: string = '';
  public surName: string = '';
  public email: string = '';
  public phone: string = '';

  get contactTypes(): BasicResponse[] {
    return this.contactTypeService.contacts;
  }

  changed() {
    console.log(' HERE AT THE CONTACT')
  }

  get isDisabled (): boolean {
    return this.contactType === null || this.name === '' || (this.email === '' && this.phone === '');
  }

  save() {
    const variables:{
      id: number,
      cid: number | null,
      name: string,
      email: string | undefined,
      phone: string | undefined
    } = {
      id: 916,
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
      console.log('subscription on apollo: ', ev);
    })
  }
}
