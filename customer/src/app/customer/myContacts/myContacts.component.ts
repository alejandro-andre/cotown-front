import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { Contact, TableObject } from 'src/app/constants/Interface';
import { DELETE_CONTACT, GET_CONTACTS_BY_CUSTOMERID } from 'src/app/schemas/query-definitions/contact.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './myContacts.component.html',
  styleUrls: ['./myContacts.component.scss']
})

export class MyContactsComponent {
  public DELETE = Constants.DELETE;
  constructor(
    public customerService: CustomerService,
    private router: Router,
    private apollo: ApoloQueryApi
  ) {}

  public tableFormat: TableObject[] = [
    {
      header: Constants.CONTACT_NAME,
      property: Constants.PROPERTY_NAME,
      name: Constants.name
    },
    {
      header: Constants.CONTACT_EMAIL,
      property: Constants.PROPERTY_EMAIL,
      name: Constants.EMAIL
    },
    {
      header: Constants.CONTACT_PHONE,
      property: Constants.PROPERTY_PHONE,
      name: Constants.PHONE
    },
    {
      header: Constants.DELETE,
      property: Constants.DELETE,
      name: Constants.DELETE
    }
  ];

  get contacts(): Contact[] {
    return this.customerService.customer.contacts;
  }

  get displayedColumns (): string[] {
    return this.tableFormat.map((elem) => elem.header);
  }

  goToAdd(): void {
    this.router.navigate(['customer/cantacts/new']);
  }

  deleteContact(event: Contact): void {
    const variables = {
      id: event.id,
      customer_id: this.customerService.customer.id,
    };

    this.apollo.setData(DELETE_CONTACT, variables).subscribe((response) => {
      const value = response.data;
      if (value && value.data &&  value.data.length && value.data[0].id === event.id) {
        this.customerService.removeContactById(event.id);
      }
    });
  }
}
