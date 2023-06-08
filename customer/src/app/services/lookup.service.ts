import { Injectable } from '@angular/core';
import { Lookup, LookupInt } from '../constants/Interface';
import { ApolloQueryApi } from './apollo-api.service';

import { CONTACT_TYPE_QUERY, COUNTRY_QUERY, REASONS_QUERY, GENDER_QUERY, ID_TYPE_QUERY, LANGUAGE_QUERY, SCHOOL_QUERY } from 'src/app/schemas/query-definitions/lookup.query';
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
  public reasons: LookupInt[] = [];
  
  public appLangs = Constants.LANGUAGES;
  
  constructor(private apolloApi: ApolloQueryApi) {}

  // Load all
  load() {
    this.loadContactTypes();
    this.loadCountries();
    this.loadGenders();
    this.loadIdTypes();
    this.loadLanguages();
    this.loadReasons();
    this.loadSchools();
  }
  
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

  // Load reasons
  loadReasons() {
    this.apolloApi.getData(REASONS_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        console.log(value.data);
        this.reasons = value.data;
      }
    });
  }
}
