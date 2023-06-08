// Core
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
import { formatDate } from 'src/app/utils/date.util';

@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent{
  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private apolloApi: ApolloQueryApi,
    private axiosApi: AxiosApi,
    private translate: TranslateService,
    private modalService: ModalService
  ) {}

  public saveEnabled: boolean = false;
  public image!: File;
  public isLoading = false;

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
    const date = this.customer.formControl.value;
    if (date !== null) {
      return formatDate(date);
    }
    return null;
  }

  // Return if the button is or not disabled
  get isButtonDisabled(): boolean {
    return !this.saveEnabled;
  }

  /**
   * Methods
   */

  enableSave() {
    this.saveEnabled = true;
  }

  changeLang() {
    this.translate.use(this.customer.appLang);
    this.enableSave();
  }

  validateDoc() {
    this.enableSave();
  }

  save() {

    this.isLoading = true;

    const variables: any = {
      ...this.customerService.customer,
      birthDate: this.birthDate
    };

    console.log(variables);
    
    delete variables.formControl

    this.apolloApi.setData(UPDATE_CUSTOMER, variables).subscribe(
      (res) => {
        const val = res.data;
        if (val && val.update && val.update.length) {
          this.customerService.setVisibility();
          this.isLoading = false;
          this.saveEnabled = false;
        } else {
          this.isLoading = false;
          this.modalService.openModal({
            title: 'Error',
            message: 'unknownError'
          });
        }
      }, 
      (err) => {
        const bodyToSend = formatErrorBody(err, this.customer.appLang);
        this.isLoading = false;
        this.modalService.openModal(bodyToSend);
      }
    )
  }

  upload(event: any) {

    this.isLoading = true;

    const fileInfo = event.target.files[0]
    const payload:PayloadFile = {
      file: event.target.files[0],
      id: this.customer.id,
    }

    this.axiosApi.uploadImage(payload).then((res) => {
      const reader = new FileReader();
      const id = this.customer.id;

      reader.onloadend = () => {
        const imageAsB64 = reader.result;
        const oid = res.data;
        const variables = {
          id,
          bill: {
            name: fileInfo.name,
            oid: oid,
            type: fileInfo.type,
            thumbnail: imageAsB64
          }
        };

        this.apolloApi.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe(
          (res: any) => {
            const val = res.data;
            if (val.data && val.data.length && val.data[0]) {
              const photo = val.data[0].photo;
              this.customer.photo = photo;
            } else {
              this.isLoading = false;
              this.modalService.openModal({
                title: 'Error',
                message: 'unknownError'
              });
            }
            this.isLoading = false;
          }, 
          (err) => {
            const bodyToSend = formatErrorBody(err, this.customer.appLang);
            this.isLoading = false;
            this.modalService.openModal(bodyToSend);
          }
        )
      }
      reader.readAsDataURL(fileInfo);
    })
  }
}
