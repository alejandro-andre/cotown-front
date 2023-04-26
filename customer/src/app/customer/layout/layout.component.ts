import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Customer } from 'src/app/models/Customer.model';
import { countryQuery } from 'src/app/schemas/query-definitions/countries.query';
import { customerQuery } from 'src/app/schemas/query-definitions/customer.query';
import { genderQuery } from 'src/app/schemas/query-definitions/gender.query';
import { languageQuery } from 'src/app/schemas/query-definitions/languages.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { LanguageService } from 'src/app/services/languages.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  constructor(
    private router: Router,
    private apolloApi: ApoloQueryApi,
    private customerService: CustomerService,
    public authService: AuthService,
    public genderService: GenderService,
    public countryService: CountryService,
    public languageSerice: LanguageService

  ) {}

  onSelectOption(data: string): void {
    this.router.navigate([`customer/${data}`]);
  }

   ngOnInit(): void {
    const variables = {
      id: 1
    }

    this.authService.getAirflowsToken().then(() => {

      this.apolloApi.getData(languageQuery).subscribe((res) => {
        console.log(res.data)
        const value = res.data;
        if (value && value.languages) {
          this.languageSerice.setLanguageData(value.languages);
        }
      })

      this.apolloApi.getData(genderQuery).subscribe((res) => {
        const value = res.data;

        if (value && value.genders) {
          this.genderService.setGenderData(value.genders);
        }
      });

      this.apolloApi.getData(countryQuery).subscribe((res) => {
        const value = res.data;
        if (value && value.countries && value.countries.length) {
          this.countryService.setCountryData(value.countries);
        }
        console.log(res)
      })

      this.apolloApi.getData(customerQuery, variables).subscribe((res) => {
        const value = res.data;
        console.log(res)
        if (value && value.data && value.data.length) {
          const {
            name , province, city, country,adress, postal_code, document, email, phones,
            gender_id, language, origin
          } = value.data[0];

          const customer = new Customer(
            name, province, city, country, adress, postal_code, document, email, phones, gender_id,
            language, origin
          );

          this.customerService.setCustomerData(customer);
          console.log('COSTYM', value[0]);
        }
      });

    })

  }
}
