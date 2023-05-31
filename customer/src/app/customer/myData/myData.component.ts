// Core
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

//Service
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { ModalService } from 'src/app/services/modal.service';

// Constants and interfaces
import { Constants } from 'src/app/constants/Constants';
import { BasicResponse, PayloadFile } from 'src/app/constants/Interface';
import { Customer } from 'src/app/models/Customer.model';
import { UPDATE_CUSTOMER, UPLOAD_CUSTOMER_PHOTO } from 'src/app/schemas/query-definitions/customer.query';
import { formatErrorBody } from 'src/app/utils/error.util';

@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent{
  constructor(
    public customerService: CustomerService,
    private genderService: GenderService,
    private countryService: CountryService,
    private languageService: LanguageService,
    private identificationTypesService: IdentificationDocTypesService,
    private schoolOrCompaniesService: schoolOrCompaniesService,
    private apolloApi: ApolloQueryApi,
    private translate: TranslateService,
    private axiosApi: AxiosApi,
    private modalService: ModalService
  ) {
  }

  public appLangs = Constants.ARRAY_OF_LANGUAGES;
  public saveActiveButton: boolean = false;
  public image!: File;
  public isLoading = false;

  public dniFormControl = new FormControl('', [
    Validators.pattern('\d{8}[a-z A-Z]/')
  ]);

  /**
  * Getters
  */

  // Return the current customer
  get customer (): Customer {
    return this.customerService.customer;
  }

  get isSpanish(): boolean {
    return this.customer.appLang === Constants.SPANISH.id
  }
  // Return types of documents
  get identificationTypes(): BasicResponse [] {
    return this.identificationTypesService.types;
  }

  // Return country list
  get countries(): BasicResponse [] {
    return this.countryService.countries;
  }

  // Return school list
  get schoolOrCompanies() :BasicResponse [] {
    return this.schoolOrCompaniesService.schoolOrCompanies;
  }

  // Return gender list
  get genders(): BasicResponse [] {
    return this.genderService.genders;
  }

  // Return language list
  get languages(): BasicResponse [] {
    return this.languageService.languages;
  }

  // Return gender name of current customer
  get gender(): string {
    return this.genders.find((elem) => elem.id === this.customer.genderId)?.name || '';
  }

  // Return array of sections with true or false value to set as readOnly or not
  get visibility():{ [key: string]: boolean } {
    return this.customerService.visibility;
  }

  // Return school name of current customer
  get schoolName(): string {
    return this.schoolOrCompanies.find((elem) => elem.id === this.customer.schoolOrCompany)?.name || '';
  }

  // Return the country of the current customer
  get country(): string {
    return this.countries.find(elem => elem.id === this.customer.country)?.name || '';
  }

  // Return the documentation type name of current customer
  get docType() :string {
    return this.identificationTypes.find((elem ) => elem.id === this.customer.typeDoc)?.name || '';
  }

  // Return nationality of current customer
  get nationality(): string {
    return this.countries.find(elem => elem.id === this.customer.nationality)?.name || '';
  }

  // Return language of current customer
  get language(): string {
    return this.languages.find((elem) => elem.id === this.customer.languageId)?.name || '';
  }

  // Return origin country of current customer
  get origin(): string {
    return this.countries.find((elem) => elem.id === this.customer.originId)?.name || '';
  }

  // Return formated birthdate of current customer
  get birthDate(): string | null {
    const date = this.customer.formControl.value;

    if (date !== null) {
      const year = date.getFullYear();
      const day = date.getDate();
      const month = date.getMonth() + 1;

      return `${year}-${month}-${day}`;
    }

    return null;
  }

  // Return if the button is or not disabled
  get isButtonDisabled(): boolean {
    return !this.saveActiveButton;
  }

  /**
   * Methods
   */

  activeButton() {
    this.saveActiveButton = true;
  }

  changeLang() {
    this.translate.use(this.customer.appLang);
    this.activeButton();
  }

  validateDoc() {
    this.activeButton();
  }

  save() {
    this.isLoading = true;
    const variables: any = {
      ...this.customerService.customer,
      birthDate: this.birthDate
    };

    delete variables.formControl

    this.apolloApi.setData(UPDATE_CUSTOMER, variables).subscribe(
      res => {
        const val = res.data;
        if (val && val.update && val.update.length) {
          this.customerService.setVisibility();
          this.isLoading = false;
          this.saveActiveButton = false;
        } else {
          // something wrong
          this.isLoading = false;
          const body = {
            title: 'Error',
            message: 'uknownError'
          };

          this.modalService.openModal(body);
        }
    }, (err) =>{
      // Apollo error !!
      const bodyToSend = formatErrorBody(err, this.customer.appLang);
      this.isLoading = false;
      this.modalService.openModal(bodyToSend);
    })
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

        this.apolloApi.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe((response: any) => {
          const val = response.data;
          if (val.data && val.data.length && val.data[0]) {
            const photo = val.data[0].photo;
            this.customer.photo = photo;
          } else {
            this.isLoading = false;
            const body = {
              title: 'Error',
              message: 'uknownError'
            };

            this.modalService.openModal(body);
          }

          this.isLoading = false;
        }, err => {
          const bodyToSend = formatErrorBody(err, this.customer.appLang);
          this.isLoading = false;
          this.modalService.openModal(bodyToSend);
        })
      }

      reader.readAsDataURL(fileInfo);
    })
  }
}
