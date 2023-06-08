import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from 'src/app/constants/Interface';
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

  public isLoading = false;

  public displayedColumns: string[] = [
    "contact_type",
    "name",
    "email",
    "phones",
    "delete"
  ];

  constructor(
    public customerService: CustomerService,
    private router: Router,
    private apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {}

  get contacts(): Contact[] {
    return this.customerService.customer.contacts;
  }

  goToAdd(): void {
    this.router.navigate(['/cantacts/new']);
  }

  deleteContact(event: Contact): void {

    // Spinner
    this.isLoading = true;

    // GraphQL
    const variables = {
      id: event.id,
      customer_id: this.customerService.customer.id,
    };
    this.apollo.setData(DELETE_CONTACT, variables).subscribe({

      next: (res) => {
        const value = res.data;
        console.log(value, value.data, value.data[0].id === event.id);
        this.isLoading = false;
        if (value && value.data && value.data.length && value.data[0].id === event.id) {
          this.customerService.removeContactById(event.id);
        } else {
          this.modalService.openModal({title: 'Error',message: 'unknownError'});
        }
      }, 

      error: (err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
        this.modalService.openModal(bodyToSend);
      }
    });
  }
}
