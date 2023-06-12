// Core
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core'; 

//Service
import { CustomerService } from 'src/app/services/customer.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { ModalService } from 'src/app/services/modal.service';

// Constants and interfaces
import { Constants } from 'src/app/constants/Constants';
import { ICustomer, IPayloadFile } from 'src/app/constants/Interface';
import { UPDATE_CUSTOMER, UPLOAD_CUSTOMER_PHOTO } from 'src/app/schemas/query-definitions/customer.query';
import { formatErrorBody } from 'src/app/utils/error.util';
import { LookupService } from 'src/app/services/lookup.service';
import { FormControl } from '@angular/forms';
import { FileService } from 'src/app/services/file.service';

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
    private fileService: FileService,
    private apolloApi: ApolloQueryApi,
    private dateAdapter: DateAdapter<any>,
    private axiosApi: AxiosApi,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private modalService: ModalService
  ) {}

  // On init
  ngOnInit() {
    this.changeLang();
    console.log(this.customerService.customer);
    if (this.customerService.customer.birth_date) {
      const date = new Date(this.customerService.customer.birth_date)
      this.birthDateControl.setValue(date);
    }
  }

  /**
  * Getters
  */

  // Return the current customer
  get customer (): ICustomer {
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
      return this.lookupService.genders.find((elem) => elem.id === this.customer.gender_id)?.name || '';
    return this.lookupService.genders.find((elem) => elem.id === this.customer.gender_id)?.name_en || '';
  }

  // Return tutor id type name of current customer
  get tutor_id_type(): string {
    if (this.isSpanish)
      return this.lookupService.idTypes.find((elem) => elem.id === this.customer.tutor_id_type_id)?.name || '';
    return this.lookupService.idTypes.find((elem) => elem.id === this.customer.tutor_id_type_id)?.name_en || '';
  }

  // Return the country of the current customer
  get country(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.country_id)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.country_id)?.name_en || '';
  }

  // Return the documentation type name of current customer
  get idType(): string {
    if (this.isSpanish)
      return this.lookupService.idTypes.find((elem) => elem.id === this.customer.id_type_id)?.name || '';
    return this.lookupService.idTypes.find((elem) => elem.id === this.customer.id_type_id)?.name_en || '';
  }

  // Return nationality of current customer
  get nationality(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.nationality_id)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.nationality_id)?.name_en || '';
  }

  // Return language of current customer
  get language(): string {
    if (this.isSpanish)
      return this.lookupService.languages.find((elem) => elem.id === this.customer.language_id)?.name || '';
    return this.lookupService.languages.find((elem) => elem.id === this.customer.language_id)?.name_en || '';
  }

  // Return origin country of current customer
  get origin(): string {
    if (this.isSpanish)
      return this.lookupService.languages.find((elem) => elem.id === this.customer.country_origin_id)?.name || '';
    return this.lookupService.languages.find((elem) => elem.id === this.customer.country_origin_id)?.name_en || '';
  }

  // Return school name of current customer
  get school(): string {
    return this.lookupService.schools.find((elem) => elem.id === this.customer.school_id)?.name || '';
  }

  // Return formated birth_date of current customer
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
    if (this.customer.appLang === 'es') {
      this.translate.use(this.customer.appLang || Constants.SPANISH.id);
      this.dateAdapter.setLocale(Constants.SPANISH.locale)
    } else {
      this.translate.use(this.customer.appLang || Constants.ENGLISH.id);
      this.dateAdapter.setLocale(Constants.ENGLISH.locale)
    }
    this.enableSave();
  }

  validateDoc() {
    this.enableSave();
  }

  // Update customer
  save() {

    // Adjust fields
    if (this.customerService.customer.document === '') {
      this.customerService.customer.document = null;
    }
    this.customerService.customer.birth_date = this.datePipe.transform(this.birthDateControl.value, 'yyyy-MM-dd');

    // Variables to update
    const variables: any = {
      ...this.customerService.customer,
    };  
    delete variables.formControl

    // Call Graphql API
    this.isLoading = true;
    this.apolloApi.setData(UPDATE_CUSTOMER, variables).subscribe({

      next: (res) => {
        const val = res.data;
        this.isLoading = false;
        if (val && val.update && val.update.length) {
          this.customerService.setvisibility();
          this.isSaveEnabled = false;
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknown_error'});
        }
      }, 

      error: (err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  async upload(event: any) {

    // Read file
    const file = event.target.files[0] 
    const data = await this.fileService.readFile(file);

    // Thumbnail
    const uint8Array = new Uint8Array(data);
    const array = Array.from(uint8Array);
    const base64String = btoa(array.map(byte => String.fromCharCode(byte)).join(''));
    const imageSrc = `data:${file.type};base64,${base64String}`;

    // Show file on screen
    if (this.customer && this.customer.photo)
      this.customer.photo.thumbnail = data;

    // Call API
    const payload: IPayloadFile = {
      id: this.customer.id,
      data: data,
      type: file.type,
    };

    // Upload image
    this.axiosApi.uploadImage(payload).then (
      (res) => {
        const variables = {
          id: this.customer.id,
          file: {
            oid: res.data,
            name: file.name,
            type: file.type,
            thumbnail: imageSrc
          }
        };
        console.log(UPLOAD_CUSTOMER_PHOTO);
        console.log(variables);
        this.apolloApi.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe({

          next: (res: any) => {
            const val = res.data;
            this.isLoading = false;
            if (val.data && val.data.length && val.data[0]) {
              const photo = val.data[0].photo;
              this.customer.photo = photo;
            } else {
              this.modalService.openModal({title: 'Error', message: 'unknown_error'});
            }
          }, 

          error: (err) => {
            this.isLoading = false;
            const bodyToSend = formatErrorBody(err, this.customer.appLang || 'es');
            this.modalService.openModal(bodyToSend);
          }
        })
      }
    )
  }
  
}
