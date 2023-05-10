// Core
import { Component } from '@angular/core';

//Service
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { BasicResponse } from 'src/app/constants/Interface';
import { Customer } from 'src/app/models/Customer.model';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';

@Component({
  selector: 'app-my-tutor',
  templateUrl: './myTutor.component.html',
  styleUrls: ['./myTutor.component.scss']
})

export class MyTutorComponent{
  constructor(
    public customerService: CustomerService,
    private countryService: CountryService,
    private identificationTypesService: IdentificationDocTypesService,
    private apollo: ApoloQueryApi
  ) {}

  /**
   * Getters
   */

  // Return the current customer
  get customer (): Customer {
    return this.customerService.customer;
  }

  // Return types of documents
  get identificationTypes(): BasicResponse [] {
    return this.identificationTypesService.types;
  }

  // Return country list
  get countries(): BasicResponse [] {
    return this.countryService.countries;
  }

  // Return array of sections with true or false value to set as readOnly or not
  get visibility():{ [key: string]: boolean } {
    return this.customerService.visibility;
  }

  // Return the country of the current customer
  get country(): string {
    return this.countries.find(elem => elem.id === this.customer.country)?.name || '';
  }

  // Return the documentation type name of current customer
  get docType() :string {
    return this.identificationTypes.find((elem ) => elem.id === this.customer.typeDoc)?.name || '';
  }

  // Return formated birthdate of current customer
  get birthDate(): string | null {
    const date = this.customer.birthDate;

    if (date !== null) {
      const year = date.getFullYear();
      const day = date.getDate();
      const month = date.getMonth() + 1;

      return `${year}-${month}-${day}`;
    }

    return null;
  }
}
