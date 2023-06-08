// Core
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

//Service
import { CustomerService } from 'src/app/services/customer.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { ModalService } from 'src/app/services/modal.service';

// Constants and interfaces
import { Constants } from 'src/app/constants/Constants';
import { PayloadFile } from 'src/app/constants/Interface';
import { Customer } from 'src/app/models/Customer.model';
import { UPDATE_CUSTOMER, UPLOAD_CUSTOMER_PHOTO } from 'src/app/schemas/query-definitions/customer.query';
import { formatErrorBody } from 'src/app/utils/error.util';
import { LookupService } from 'src/app/services/lookup.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent implements OnInit {

  // Spinner
  public isLoading = false;

  // Save bbutton enabled?
  public isSaveEnabled: boolean = false;

  // Birth date control
  public birthDateControl = new FormControl();
  
  // Image file
  public image!: File;

  // Constructor
  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private apolloApi: ApolloQueryApi,
    private axiosApi: AxiosApi,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private modalService: ModalService
  ) {}

  // On init
  ngOnInit() {
    if (this.customerService.customer.birthDate) {
      const date = new Date(this.customerService.customer.birthDate)
      this.birthDateControl.setValue(date);
    }
  }

  /**
  * Getters
  */

  // Return the current customer
  get customer (): Customer {
    return this.customerService.customer;
  }

  // Check current language
  get isSpanish(): boolean {
    return this.customer.appLang === Constants.SPANISH.id
  }

  // Return array of sections with true or false value to set as readOnly or not
  get visibility():{ [key: string]: boolean } {
    return this.customerService.visibility;
  }

  // Return gender name of current customer
  get gender(): string {
    if (this.isSpanish)
      return this.lookupService.genders.find((elem) => elem.id === this.customer.genderId)?.name || '';
    return this.lookupService.genders.find((elem) => elem.id === this.customer.genderId)?.name_en || '';
  }

  // Return the country of the current customer
  get country(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.country)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.country)?.name_en || '';
  }

  // Return the documentation type name of current customer
  get idType(): string {
    if (this.isSpanish)
      return this.lookupService.idTypes.find((elem) => elem.id === this.customer.typeDoc)?.name || '';
    return this.lookupService.idTypes.find((elem) => elem.id === this.customer.typeDoc)?.name_en || '';
  }

  // Return nationality of current customer
  get nationality(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.nationality)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.nationality)?.name_en || '';
  }

  // Return language of current customer
  get language(): string {
    if (this.isSpanish)
      return this.lookupService.languages.find((elem) => elem.id === this.customer.languageId)?.name || '';
    return this.lookupService.languages.find((elem) => elem.id === this.customer.languageId)?.name_en || '';
  }

  // Return origin country of current customer
  get origin(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.originId)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.originId)?.name_en || '';
  }

  // Return school name of current customer
  get school(): string {
    return this.lookupService.schools.find((elem) => elem.id === this.customer.schoolOrCompany)?.name || '';
  }

  // Return formated birthdate of current customer
  get birthDate(): string | null {
    const date = this.birthDateControl.value;
    if (date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate;
    }
    return null;
  }

  /**
   * Methods
   */

  enableSave() {
    this.isSaveEnabled = true;
  }

  changeLang() {
    this.translate.use(this.customer.appLang);
    this.enableSave();
  }

  validateDoc() {
    this.enableSave();
  }

  // Update customer
  save() {

    // Spinner
    this.isLoading = true;

    // Adjust fields
    if (this.customerService.customer.document === '') {
      this.customerService.customer.document = null;
    }
    this.customerService.customer.birthDate = this.datePipe.transform(this.birthDateControl.value, 'yyyy-MM-dd');

    // Variables to update
    const variables: any = {
      ...this.customerService.customer,
    };  
    delete variables.formControl

    // Call Graphql API
    this.apolloApi.setData(UPDATE_CUSTOMER, variables).subscribe({

      next: (res) => {
        const val = res.data;
        this.isLoading = false;
        if (val && val.update && val.update.length) {
          this.customerService.setVisibility();
          this.isSaveEnabled = false;
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknownError'});
        }
      }, 

      error: (err) => {
        const bodyToSend = formatErrorBody(err, this.customer.appLang);
        this.isLoading = false;
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  upload(event: any) {

    // Spinner
    this.isLoading = true;

    // File info
    const id = this.customer.id;
    const reader = new FileReader();
    const fileInfo = event.target.files[0]
    const payload:PayloadFile = {
      file: event.target.files[0],
      id: this.customer.id,
    }

    // Upload image
    this.axiosApi.uploadImage(payload).then(

      (res) => {

        // Image read?
        reader.onloadend = () => {

          // Update record
          const oid = res.data;
          const imageAsB64 = reader.result;
          const variables = {
            id,
            bill: {
              name: fileInfo.name,
              oid: oid,
              type: fileInfo.type,
              thumbnail: imageAsB64
            }
          };
          this.apolloApi.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe({

            next: (res: any) => {
              const val = res.data;
              this.isLoading = false;
              if (val.data && val.data.length && val.data[0]) {
                const photo = val.data[0].photo;
                this.customer.photo = photo;
              } else {
                this.modalService.openModal({title: 'Error', message: 'unknownError'});
              }
            }, 

            error: (err) => {
              this.isLoading = false;
              const bodyToSend = formatErrorBody(err, this.customer.appLang);
              this.modalService.openModal(bodyToSend);
            }
          })
        }

        // Read image
        reader.readAsDataURL(fileInfo);

      })
  }
}
