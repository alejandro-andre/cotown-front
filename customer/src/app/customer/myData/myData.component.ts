import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';

import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';


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
    public identificationTypesService: IdentificationDocTypesService
  ) {}
  ngOnInit(): void {
  }



  changed() {
    console.log(this.customerService.customer)
  }
}
