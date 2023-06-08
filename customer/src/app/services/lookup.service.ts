import { Injectable } from '@angular/core';
import { Lookup, LookupInt } from '../constants/Interface';
import { ApolloQueryApi } from './apollo-api.service';

import { ID_TYPE_QUERY } from 'src/app/schemas/query-definitions/id-type.query';
import { COUNTRY_QUERY } from 'src/app/schemas/query-definitions/countries.query';
import { GENDER_QUERY } from 'src/app/schemas/query-definitions/gender.query';
import { LANGUAGE_QUERY } from 'src/app/schemas/query-definitions/languages.query';
import { SCHOOL_QUERY } from 'src/app/schemas/query-definitions/school.query';
import { CONTACT_TYPE_QUERY } from 'src/app/schemas/query-definitions/contact-type.query';
import { Constants } from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})

export class LookupService {

  public schools: Lookup[] = [];
  public contactTypes: Lookup[] = [];
  public countries: LookupInt[] = [];
  public languages: LookupInt[] = [];
  public idTypes: LookupInt[] = [];
  public genders: LookupInt[] = [];
  public appLangs = Constants.LANGUAGES;
  
  constructor(private apolloApi: ApolloQueryApi) {}

  // Languages
  loadLanguages() {
    this.apolloApi.getData(LANGUAGE_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        this.languages = value.data;
      }
    });
  }

  // Load ID types
  loadIdTypes() {
    this.apolloApi.getData(ID_TYPE_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        console.log(value.data);
        this.idTypes = value.data;
      }
    });
  }
  
  // Load genders
  loadGenders() {
    this.apolloApi.getData(GENDER_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        console.log(value.data);
        this.genders = value.data;
      }
    });
  }

  // Load countries
  loadCountries() {
    this.apolloApi.getData(COUNTRY_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        console.log(value.data);
        this.countries = value.data;
      }
    });
  }

  // Load contact types
  loadContactTypes() {
    this.apolloApi.getData(CONTACT_TYPE_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data) {
        console.log(value.data);
        this.contactTypes = value.data;
      }
    });
  }

  // Load schools
  loadSchools() {
    this.apolloApi.getData(SCHOOL_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        console.log(value.data);
        this.schools = value.data;
      }
    });
  }

}
