// Core
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Sevices
import { AuthService } from 'src/app/auth/service/auth.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { LanguageService } from 'src/app/services/languages.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';

// Models
import { Customer } from 'src/app/models/Customer.model';

// Queries
import { identificationDocTypesQuery } from 'src/app/schemas/query-definitions/IdentificationDocTypes.query';
import { countryQuery } from 'src/app/schemas/query-definitions/countries.query';
import { customerQuery } from 'src/app/schemas/query-definitions/customer.query';
import { genderQuery } from 'src/app/schemas/query-definitions/gender.query';
import { languageQuery } from 'src/app/schemas/query-definitions/languages.query';
import { schoolOrCompaniesQuery } from 'src/app/schemas/query-definitions/schoolOrCompanies.query';

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
    public languageSerice: LanguageService,
    public identificationTypes: IdentificationDocTypesService,
    public schoolOrCompaniesService: schoolOrCompaniesService

  ) {}

  onSelectOption(data: string): void {
    this.router.navigate([`customer/${data}`]);
  }

  loadIdentificationDocTypes() {
    this.apolloApi.getData(identificationDocTypesQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.types) {
        this.identificationTypes.setTypesData(value.types);
      }
    });
  }

  loadLanguages() {
    this.apolloApi.getData(languageQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.languages) {
        this.languageSerice.setLanguageData(value.languages);
      }
    });
  }

  loadGenders() {
    this.apolloApi.getData(genderQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.genders) {
        this.genderService.setGenderData(value.genders);
      }
    });
  }

  loadCountries() {
    this.apolloApi.getData(countryQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.countries && value.countries.length) {
        this.countryService.setCountryData(value.countries);
      }
    });
  }

  loadSchoolOrCompanies() {
    this.apolloApi.getData(schoolOrCompaniesQuery).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.schoolOrCompaniesService.setSchoolOrCompaniesData(value.data);
      }
    });
  }

  loadCustomer() {
    const variables = {
      id: 1
    }

    this.apolloApi.getData(customerQuery, variables).subscribe((res) => {
      const value = res.data;
      console.log(res)
      if (value && value.data && value.data.length) {
        const {
          name , province, city, country, adress, postal_code, document, email, phones,
          gender_id, language, origin,tutor, birth_date, nationality, type_doc, school_id,
          bank, contacts
        } = value.data[0];

        const birthDate = birth_date !== null ? new Date(birth_date) : null;
        const contactsToSend = contacts !== null ? contacts : [];

        const customer = new Customer(
          name, province, city, country, adress, postal_code, document, email, phones, gender_id,
          language, origin, nationality, tutor?.name || '', birthDate, type_doc, school_id, bank,
          contactsToSend
        );

        this.customerService.setCustomerData(customer);
      }
    });
  }

  ngOnInit(): void {
    this.authService.getAirflowsToken().then(() => {
      this.loadIdentificationDocTypes();
      this.loadLanguages();
      this.loadGenders();
      this.loadCountries();
      this.loadSchoolOrCompanies();
      this.loadCustomer();
    })
  }
}
