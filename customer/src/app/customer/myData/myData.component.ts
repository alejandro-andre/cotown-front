// Core
import { Component, OnInit } from '@angular/core';
//Service
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { BasicInterface } from 'src/app/models/interfaces';


@Component({
  selector: 'app-my-data',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent implements OnInit{

  constructor(
    public customerService: CustomerService,
    public genderService: GenderService,
    public countryService: CountryService,
    public languageService: LanguageService,
    public identificationTypesService: IdentificationDocTypesService,
    public schoolOrCompaniesService: schoolOrCompaniesService
  ) {}
  ngOnInit(): void {
  }

  changed() {
    console.log(this.customerService.customer)
  }

  get identificationTypes(): BasicInterface [] {
    return this.identificationTypesService.identificationTypesModel.types || [];
  }

  get countries(): BasicInterface [] {
    return this.countryService.countryModel.countries || [];
  }

  get schoolOrCompanies() :BasicInterface [] {
    return this.schoolOrCompaniesService.schoolOrCompaniesModel.schoolOrCompanies || [];
  }

  get genders(): BasicInterface [] {
    return this.genderService.gendersModel.genders || [];
  }

  get languages(): BasicInterface [] {
    return this.languageService.languageModel.languages || [];
  }

}
