// Core
import { Component } from '@angular/core';
//Service
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { BasicResponse, PayloadFile } from 'src/app/constants/Interface';
import { Customer } from 'src/app/models/Customer.model';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { UPDATE_CUSTOMER, UPLOAD_CUSTOMER_PHOTO } from 'src/app/schemas/query-definitions/customer.query';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/Constants';
import { AxiosApi } from 'src/app/services/axios-api.service';

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
    private apollo: ApoloQueryApi,
    private translate: TranslateService,
    private axiosApi: AxiosApi
  ) {}

  public appLangs = Constants.ARRAY_OF_LANGUAGES;
  public saveActiveButton: boolean = false;
  public image!: File;
  public isLoading = false;

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
    if(Object.values(this.visibility).filter((elem) => elem === false).length > 0 || this.saveActiveButton){
      return false;
    };

    return true
  }

  /**
   * Methods
   */

  activeButton() {
    this.saveActiveButton = true;
    this.translate.use(this.customer.appLang);
  }

  save() {
    this.isLoading = true;
    const variables: any = {
      ...this.customerService.customer,
      birthDate: this.birthDate
    };

    delete variables.formControl
    this.apollo.setData(UPDATE_CUSTOMER, variables).subscribe(resp => {
      const val = resp.data;
      if (val && val.update && val.update.length) {
        this.customerService.setVisibility();
        this.isLoading = false;
      } else {
        // something wrong
      }
    }, (err) =>{
      // Apollo error !!
      console.log(err, err.getMessage())
    })
  }

  upload(event: any) {
    const fileInfo = event.target.files[0]
    const payload:PayloadFile = {
      file: this.image,
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

        this.apollo.setData(UPLOAD_CUSTOMER_PHOTO, variables).subscribe((response: any) => {
          console.log('The response is: ', response)
        })
      }

      reader.readAsDataURL(fileInfo);
    })
  }
}
