// Core
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

//Service
import { CustomerService } from 'src/app/services/customer.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { ModalService } from 'src/app/services/modal.service';

// Constants and interfaces
import { Constants } from 'src/app/constants/Constants';
import { ICustomer, IPayloadFile, IPhone } from 'src/app/constants/Interface';
import { UPDATE_CUSTOMER, UPLOAD_CUSTOMER_PHOTO } from 'src/app/schemas/query-definitions/customer.query';
import { formatErrorBody } from 'src/app/utils/error.util';
import { LookupService } from 'src/app/services/lookup.service';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { FileService } from 'src/app/services/file.service';
import { DateAdapter } from '@angular/material/core';
import { getAge } from 'src/app/utils/date.util';

@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent implements OnInit, AfterViewInit {

  // Spinner
  public isLoading = false;

  // Save button enabled?
  public isSaveEnabled: boolean = false;
  public isIbanOk: boolean = true;
  public isSwiftOk: boolean = true;

  // Image file
  public image!: File;

  // Phone
  public phone: IPhone = { prefix: '', number: '' };

  // Form fields
  public id_type_idControl = new FormControl('', this.validateNotEmpty);
  public documentControl = new FormControl('', this.validateNotEmpty);
  public addressControl = new FormControl('', this.validateNotEmpty);
  public zipControl = new FormControl('', this.validateNotEmpty);
  public cityControl = new FormControl('', this.validateNotEmpty);
  public provinceControl = new FormControl('', this.validateNotEmpty);
  public country_idControl = new FormControl('', this.validateNotEmpty);
  public payment_method_idControl = new FormControl();
  public birth_dateControl = new FormControl<any>('', [ Validators.required, this.validateAge ]);
  public tutor_id_type_idControl = new FormControl('');
  public tutor_documentControl = new FormControl('');
  public tutor_nameControl = new FormControl('');
  public tutor_emailControl = new FormControl('');
  public tutor_phonesControl = new FormControl('');
  public ibanControl = new FormControl('');
  public swiftControl = new FormControl('');
  public same_accountControl = new FormControl('');
  public bank_accountControl = new FormControl('');
  public bank_holderControl = new FormControl('');
  public bank_nameControl = new FormControl('');
  public bank_addressControl = new FormControl('');
  public bank_cityControl = new FormControl('');
  public bank_country_idControl = new FormControl('');

  // Constructor
  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    public formBuilder: FormBuilder,
    private fileService: FileService,
    private apolloQueryApi: ApolloQueryApi,
    private dateAdapter: DateAdapter<any>,
    private axiosApi: AxiosApi,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private modalService: ModalService
  ) { }

  // On init
  ngOnInit() {
    // Lang
    this.changeLang();
    
    // Birth date
    if (this.customerService.customer.birth_date) {
      const date = new Date(this.customerService.customer.birth_date + 'T23:59:00');
      this.birth_dateControl.setValue(date);
    }

    // Phone
    const regex = /(\+\w+)\s(.+)/; 
    const matches = this.customerService.customer.phones.match(regex);
    if (matches && matches.length === 3) {
      this.phone.prefix = matches[1];
      this.phone.number = matches[2];
    } else {
      this.phone.number = this.customerService.customer.phones;
    }
  }

  ngAfterViewInit(){
    this.enableSave();
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

  // Return the payment method type name of current customer
  get paymentMethod(): string {
    if (this.isSpanish)
      return this.lookupService.paymentMethods.find((elem) => elem.id === this.customer.payment_method_id)?.name || '';
    return this.lookupService.paymentMethods.find((elem) => elem.id === this.customer.payment_method_id)?.name_en || '';
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
      return this.lookupService.countries.find((elem) => elem.id === this.customer.country_origin_id)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.country_origin_id)?.name_en || '';
  }

  // Return origin country of current customer
  get bank_country(): string {
    if (this.isSpanish)
      return this.lookupService.countries.find((elem) => elem.id === this.customer.bank_country_id)?.name || '';
    return this.lookupService.countries.find((elem) => elem.id === this.customer.bank_country_id)?.name_en || '';
  }

  // Return formated birth_date of current customer
  get birthDate(): string | null {
    const date = this.birth_dateControl.value;
    if (date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate;
    }
    return null;
  }

  get age() {
    return getAge(this.customer.birth_date);
  }

  /**
   * Methods
   */

  changeLang() {
    if (this.customer.appLang === 'es') {
      this.translate.use(this.customer.appLang || Constants.SPANISH.id);
      this.dateAdapter.setLocale(Constants.SPANISH.locale);
    } else {
      this.translate.use(this.customer.appLang || Constants.ENGLISH.id);
      this.dateAdapter.setLocale(Constants.ENGLISH.locale);
    }
    this.enableSave();
  }

  validateNotEmpty(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string') {
      if (value.trim().length === 0) {
        return { required: true };
      }
    } else if (typeof value === 'object' && value !== null) {
      if (Object.keys(value).length === 0) {
        return { required: true };
      }
    } else if (value === null || value === undefined) {
      return { required: true };
    }
    return null;
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    const age = getAge(control.value)
    if (age < 16) {
      return { 'under16': true };
    }
    return null;
  }

  // Validate Bank data filled
  validateBankData(control: any) {
    control.setErrors(null);
    if ((control.value || "") === "") {
      control.setErrors({ 'field_required': true });
      return;
    }
  }

  // Validate Swift
  async validateSwift() {
    // Swift not filled
    this.isSwiftOk = false;
    this.validateBankData(this.swiftControl);
    if (!this.customer.swift) {
      this.enableSave();
      return;
    }

    // Validate Swift
    this.isSwiftOk = await this.axiosApi.validateSWIFT(this.customer.swift).then((res: any) => {
      if (!res || res.data == "ko") {
        this.swiftControl.setErrors({ 'swift_wrong': true });
        return false;
      }
      return true;
    });

    // Enable save
    this.enableSave();
  }

  async validateIBAN() {
    // IBAN not required
    this.isIbanOk = true;
    this.validateBankData(this.ibanControl);
    if (this.customer.payment_method_id != 2) {
      this.enableSave();
      return;
    }

    // IBAN not filled
    this.isIbanOk = false;
    if (!this.customer.iban) {
      this.enableSave();
      return;
    }

    // Validate IBAN
    this.isIbanOk = await this.axiosApi.validateIBAN(this.customer.iban).then((res: any) => {
      if (!res || res.data.startsWith("!!!")) {
        this.ibanControl.setErrors({ 'iban_mandatory': true });
        return false;
      }
      return true;
    });

    // Enable save
    this.enableSave();
  }
  
  enableSave() {
    this.customer.changed = true;
    this.isSaveEnabled = this.validate();
  }

  // Validate
  validate() {
    // Validate bank data
    if (this.isIbanOk) this.validateBankData(this.ibanControl)
    if (this.isSwiftOk) this.validateBankData(this.swiftControl)
    this.validateBankData(this.bank_accountControl);
    this.validateBankData(this.bank_holderControl);
    this.validateBankData(this.bank_nameControl);
    this.validateBankData(this.bank_addressControl);
    this.validateBankData(this.bank_cityControl);
    this.validateBankData(this.bank_country_idControl);

    // Check and show errors
    this.id_type_idControl.markAsTouched();
    this.documentControl.markAsTouched();
    this.addressControl.markAsTouched();
    this.zipControl.markAsTouched();
    this.cityControl.markAsTouched();
    this.provinceControl.markAsTouched();
    this.country_idControl.markAsTouched();
    this.birth_dateControl.markAsTouched();
    this.payment_method_idControl.markAsTouched();
    this.tutor_id_type_idControl.markAllAsTouched();
    this.tutor_documentControl.markAllAsTouched();
    this.tutor_nameControl.markAllAsTouched();
    this.tutor_emailControl.markAllAsTouched();
    this.tutor_phonesControl.markAllAsTouched();
    this.ibanControl.markAllAsTouched();
    this.swiftControl.markAllAsTouched();
    this.bank_accountControl.markAllAsTouched();
    this.bank_holderControl.markAllAsTouched();
    this.bank_nameControl.markAllAsTouched();
    this.bank_addressControl.markAllAsTouched();
    this.bank_cityControl.markAllAsTouched();
    this.bank_country_idControl.markAllAsTouched();

    // Under 16
    if (this.birth_dateControl.errors) {
      return false;
    }

    // Mandatory fields
    if (!this.customer.id_type_id ||
        !this.customer.document ||
        !this.customer.address ||
        !this.customer.zip ||
        !this.customer.city ||
        !this.customer.country_id ||
        !this.customer.birth_date)
      return false;

    // Bank fields
    if (!this.isIbanOk || !this.isSwiftOk)
      return false;

    // Mandatory bank fields
    if (!this.customer.bank_account ||
        !this.customer.bank_holder ||
        !this.customer.bank_name ||
        !this.customer.bank_address ||
        !this.customer.bank_city ||
        !this.customer.bank_country_id)
      return false;

    // Minor
    if (getAge(this.customer.birth_date) < 18 && (
        !this.customer.tutor_id_type_id ||
        !this.customer.tutor_document ||
        !this.customer.tutor_name ||
        !this.customer.tutor_email ||
        !this.customer.tutor_phones
      ))
      return false;
      
    // Ok
    return true;
  }

  // Update customer
  async save() {
    // Enabled?
    if (!this.isSaveEnabled)
      return;

    // Set age
    this.customerService.customer.birth_date = this.datePipe.transform(this.birth_dateControl.value, 'yyyy-MM-dd');

    // Set phone
    this.customerService.customer.phones= this.phone.prefix + ' ' + this.phone.number;

    // Validate
    if (!this.validate()) {
      this.modalService.openModal({title: 'Error', message: 'errors.missing_fields', type: 'ok' });
      return;
    }

    // Variables to update
    const variables: any = { ...this.customerService.customer, };  
    delete variables.formControl

    // Call Graphql API
    this.isLoading = true;
    this.apolloQueryApi.setData(UPDATE_CUSTOMER, variables).subscribe({

      next: (res) => {
        const val = res.data;
        this.isLoading = false;
        if (val && val.update && val.update.length) {
          this.customerService.setCustomerVisibility();
          this.isSaveEnabled = false;
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok' });
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
    //if (this.customer && this.customer.photo)
    //  this.customer.photo.thumbnail = data;

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
        this.apolloQueryApi.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe({

          next: (res: any) => {
            const val = res.data;
            this.isLoading = false;
            if (val.data && val.data.length && val.data[0]) {
              const photo = val.data[0].photo;
              this.customer.photo = photo;
            } else {
              this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok' });
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
