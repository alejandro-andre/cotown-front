import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';

import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';

@Component({
  selector: 'app-home',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent{

  constructor(
    public customerService: CustomerService,
    public genderService: GenderService,
    public countryService: CountryService,
    public languageService: LanguageService
  ) {}

  changed() {
    console.log(this.customerService.customer)
  }
}
