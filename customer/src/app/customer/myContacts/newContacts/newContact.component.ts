// Common
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// Services
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { LookupService } from 'src/app/services/lookup.service';
import { formatErrorBody } from 'src/app/utils/error.util';

// Interface
import { IContact, IContactType } from 'src/app/constants/Interface';

// Queries
import { GET_CONTACTS_BY_CUSTOMERID, INSERT_CONTACT } from 'src/app/schemas/query-definitions/contact.query';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-contact-new',
  templateUrl: './newContact.component.html',
  styleUrls: ['./newContact.component.scss']
})

export class NewContactComponent {

  // Spinner
  public isLoading = false;

  public contact_type: IContactType = {
    id: 0,
    name: '',
    name_en: ''
  };
  public name: string = '';
  public email: string = '';
  public phone: string = '';

  // Form controls
  public emailFormControl = new FormControl(
   '',
    [
      Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
    ]
  );
  public nameFormControl = new FormControl('', [ Validators.required ]);
  public contactTypeFormControl = new FormControl('', [ Validators.required ]);

  // Constructor
  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private apollo: ApolloQueryApi,
    private location: Location,
    private modalService: ModalService
  ) {}

  get isSaveEnabled (): boolean {
    return !(
      this.contact_type === null ||
      this.name === '' ||
      (this.email === '' && this.phone === '') ||
      !this.emailFormControl.valid ||
      !this.nameFormControl.valid ||
      !this.contactTypeFormControl.valid
    );
  }

  getName(type:IContactType): string {
    if (this.customerService.customer.appLang !== Constants.SPANISH.id)
      return type.name_en || type.name;
    return type.name;
  }

  save() {

    // GraphQL API
    const variables = {
      id: this.customerService.customer.id,
      name: this.name,
      contact_type: this.contact_type,
      email: this.email.length > 0 ? this.email : undefined,
      phone: this.phone
    };
    this.isLoading = true;
    this.apollo.setData(INSERT_CONTACT, variables).subscribe({

      next: (res) => {

        const value = res.data;
        if (value && value.data && value.data.id) {

          // Update contacts
          const varToSend = {
            customerId: this.customerService.customer.id
          };
          this.apollo.getData(GET_CONTACTS_BY_CUSTOMERID, varToSend).subscribe({

            next: (res) => {
              this.isLoading = false;
              const value = res.data;
              if(value && value.data) {
                this.customerService.setContacts(value.data);
                this.location.back();
              } else {
                this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok'});
              }
            }, 

            error: (err) => {
              this.isLoading = false;
              const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
              this.modalService.openModal(bodyToSend);
            }

          })

        } else {
          this.isLoading = false;
          this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok' });
        }

      },

      error: err => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }

    });
  }
}
