import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { Contact, TableObject } from 'src/app/constants/Interface';
import { DELETE_CONTACT } from 'src/app/schemas/query-definitions/contact.query';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

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
    private apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {}

  public isLoading = false;
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
    this.router.navigate(['/cantacts/new']);
  }

  deleteContact(event: Contact): void {
    this.isLoading = true;
    const variables = {
      id: event.id,
      customer_id: this.customerService.customer.id,
    };

    this.apollo.setData(DELETE_CONTACT, variables).subscribe((response) => {
      const value = response.data;
      if (value && value.data &&  value.data.length && value.data[0].id === event.id) {
        this.isLoading = false;
        this.customerService.removeContactById(event.id);
      } else {
        this.isLoading = false;
        const body = {
          title: 'Error',
          message: 'uknownError'
        };

        this.modalService.openModal(body);
      }
    }, err => {
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
      this.isLoading = false;
      this.modalService.openModal(bodyToSend);
    });
  }
}
