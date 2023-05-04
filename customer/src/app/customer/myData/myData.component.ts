// Core
import { Component, OnInit } from '@angular/core';
//Service
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { BasicResponse } from 'src/app/constants/Interface';



@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent implements OnInit{

  constructor(
    public customerService: CustomerService,
    private genderService: GenderService,
    private countryService: CountryService,
    private languageService: LanguageService,
    private identificationTypesService: IdentificationDocTypesService,
    private schoolOrCompaniesService: schoolOrCompaniesService
  ) {}
  ngOnInit(): void {
  }

  changed() {
    console.log(this.customerService.customer)
  }

  get identificationTypes(): BasicResponse [] {
    return this.identificationTypesService.types;
  }

  get countries(): BasicResponse [] {
    return this.countryService.countries;
  }

  get schoolOrCompanies() :BasicResponse [] {
    return this.schoolOrCompaniesService.schoolOrCompanies;
  }

  get genders(): BasicResponse [] {
    return this.genderService.genders;
  }

  get languages(): BasicResponse [] {
    return this.languageService.languages;
  }

}
