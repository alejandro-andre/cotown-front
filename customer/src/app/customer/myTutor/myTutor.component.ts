// Core
import { Component } from '@angular/core';

//Service
import { CountryService } from 'src/app/services/country.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { BasicResponse } from 'src/app/constants/Interface';
import { Customer } from 'src/app/models/Customer.model';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { TutorService } from 'src/app/services/tutor.service';
import { UPDATE_CUSTOMER } from 'src/app/schemas/query-definitions/customer.query';

@Component({
  selector: 'app-my-tutor',
  templateUrl: './myTutor.component.html',
  styleUrls: ['./myTutor.component.scss']
})

export class MyTutorComponent {
  constructor(
    public tutorService: TutorService,
    private countryService: CountryService,
    private identificationTypesService: IdentificationDocTypesService,
    private apollo: ApoloQueryApi
  ) { }

  public saveActiveButton: boolean = false;

  /**
   * Getters
   */

  // Return the current tutor
  get tutor(): Customer {
    return this.tutorService.tutor;
  }

  // Return types of documents
  get identificationTypes(): BasicResponse[] {
    return this.identificationTypesService.types;
  }

  // Return country list
  get countries(): BasicResponse[] {
    return this.countryService.countries;
  }

  // Return array of sections with true or false value to set as readOnly or not
  get visibility(): { [key: string]: boolean } {
    return this.tutorService.visibility;
  }

  // Return the country of the current tutor
  get country(): string {
    return this.countries.find(elem => elem.id === this.tutor.country)?.name || '';
  }

  // Return the documentation type name of current tutor
  get docType(): string {
    return this.identificationTypes.find((elem) => elem.id === this.tutor.typeDoc)?.name || '';
  }

  // Return formated birthdate of current tutor
  get birthDate(): string | null {
    const date = this.tutor.birthDate;

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
    if (Object.values(this.visibility).filter((elem) => elem === false).length > 0) {
      return false;
    };

    return true
  }

  save() {
    const variables = {
      ...this.tutor,
      birthDate: this.birthDate
    };

    this.apollo.setData(UPDATE_CUSTOMER, variables).subscribe(resp => {
      console.log('The response is : ', resp)
    })
  }
}
