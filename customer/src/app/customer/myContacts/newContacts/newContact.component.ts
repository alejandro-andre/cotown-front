import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// Services
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

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
  public email: string = '';
  public phone: string = '';
  public emailFormControl = new FormControl(
   '',
    [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
    ]
  );
  public nameFormControl = new FormControl('', [ Validators.required ]);
  public contactTypeFormControl = new FormControl('', [ Validators.required ]);
  public isLoading = false;

  constructor(
    public customerService: CustomerService,
    private contactTypeService: ContactTypeService,
    private apollo: ApolloQueryApi,
    private location: Location,
    private modalService: ModalService
  ) {}

  get contactTypes(): BasicResponse[] {
    return this.contactTypeService.contacts;
  }

  get isDisabled (): boolean {
    return(
      this.contactType === null ||
      this.name === '' ||
      (this.email === '' && this.phone === '') ||
      !this.emailFormControl.valid ||
      !this.nameFormControl.valid ||
      !this.contactTypeFormControl.valid
    );
  }

  get isElemntsDisabled () : boolean {
    return this.contactType === null || !this.contactType;
  }

  save() {
    this.isLoading = true;
    const variables: ContactVariables = {
      name: this.name,
      id: this.customerService.customer.id,
      cid: this.contactType,
      email: this.email,
      phone: this.phone
    };

    this.apollo.setData(SET_NEW_CONTACT, variables).subscribe((ev) => {
      const value = ev.data;
      if (value && value.data && value.data.id) {
        const varToSend = {
          customerId: this.customerService.customer.id
        };

        this.apollo.getData(GET_CONTACTS_BY_CUSTOMERID, varToSend).subscribe((res) => {
          if(res.data && res.data.contacts) {
            this.isLoading = false;
            this.customerService.setContacts(res.data.contacts);
            this.location.back();
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
