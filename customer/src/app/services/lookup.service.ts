import { Injectable } from '@angular/core';
import { ICountry, ILookup, ILookupInt, IPaymentMethod as IPaymentMethod, IPdf } from '../constants/Interface';
import { ApolloQueryApi } from './apollo-api.service';

import { CONTACT_TYPE_QUERY, COUNTRY_QUERY, REASONS_QUERY, GENDER_QUERY, ID_TYPE_QUERY, LANGUAGE_QUERY, SCHOOL_QUERY, STATUS_QUERY, RESOURCE_TYPE_QUERY, CHECKIN_OPTIONS_QUERY, PDFS_QUERY, PAYMENT_METHOD_QUERY } from 'src/app/schemas/query-definitions/lookup.query';
import { Constants } from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})

export class LookupService {

  public schools: ILookup[] = [];
  public contactTypes: ILookupInt[] = [];
  public countries: ICountry[] = [];
  public prefixes: any[] = [];
  public languages: ILookupInt[] = [];
  public idTypes: ILookupInt[] = [];
  public genders: ILookupInt[] = [];
  public reasons: ILookupInt[] = [];
  public paymentMethods: IPaymentMethod[] = [];
  public checkinOptions: ILookupInt[] = [];
  public resourceTypes: {code:string, name:string, name_en: string}[] = [];
  public status: {code:string, name:string, name_en: string}[] = [];
  public pdfs: IPdf[] = [];
  
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
    this.loadPaymentMethods();
    this.loadSchools();
    this.loadCheckinOptions();
    this.loadStatus();
    this.loadResourceTypes();
    this.loadPDFs()
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
        this.idTypes = value.data;
      }
    });
  }
  
  // Load genders
  loadGenders() {
    this.apolloApi.getData(GENDER_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        this.genders = value.data;
      }
    });
  }

  // Load countries
  loadCountries() {
    this.apolloApi.getData(COUNTRY_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        this.countries = value.data;
        this.prefixes = [...new Set(this.countries.map(c => c.prefix))].sort();
      }
    });
  }

  // Load contact types
  loadContactTypes() {
    this.apolloApi.getData(CONTACT_TYPE_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data) {
        this.contactTypes = value.data;
      }
    });
  }

  // Load schools
  loadSchools() {
    this.apolloApi.getData(SCHOOL_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.schools = value.data;
      }
    });
  }

  // Load reasons
  loadReasons() {
    this.apolloApi.getData(REASONS_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.reasons = value.data;
      }
    });
  }

  // Load payment methods
  loadPaymentMethods() {
    this.apolloApi.getData(PAYMENT_METHOD_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.paymentMethods = value.data;
      }
    });
  }

  // Load checkin options
  loadCheckinOptions() {
    this.apolloApi.getData(CHECKIN_OPTIONS_QUERY).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.checkinOptions = value.data;
      }
    });
  }

  loadStatus() {
    this.status = [
      {code:'solicitud', name:'', name_en:''},
      {code:'solicitudpagada', name:'', name_en:''},
      {code:'alternativas', name:'', name_en:''},
      {code:'alternativaspagada', name:'', name_en:''},
      {code:'descartada', name:'', name_en:''},
      {code:'descartadapagada', name:'', name_en:''},
      {code:'pendientepago', name:'', name_en:''},
      {code:'caducada', name:'', name_en:''},
      {code:'confirmada', name:'', name_en:''},
      {code:'cancelada', name:'', name_en:''},
      {code:'firmacontrato', name:'', name_en:''},
      {code:'contrato', name:'', name_en:''},
      {code:'checkinconfirmado', name:'', name_en:''},
      {code:'checkin', name:'', name_en:''},
      {code:'inhouse', name:'', name_en:''},
      {code:'checkout', name:'', name_en:''},
      {code:'devolvergarantia', name:'', name_en:''},
      {code:'finalizada', name:'', name_en:''}
    ]
    this.apolloApi.getData(STATUS_QUERY).subscribe((res) => {
      const value = res.data;
      for (let i = 0; i < value.data[0].labels.length; i++) {
        if (value.data[0].locale == "es_ES") {
          this.status[i].name = value.data[0].labels[i],
          this.status[i].name_en = value.data[1].labels[i]
        } else {
          this.status[i].name = value.data[1].labels[i],
          this.status[i].name_en = value.data[0].labels[i]
        }
      }
    });
  }

  loadResourceTypes() {
    this.resourceTypes = [
      {code:'piso', name:'', name_en:''},
      {code:'habitacion', name:'', name_en:''},
    ]
    this.apolloApi.getData(RESOURCE_TYPE_QUERY).subscribe((res) => {
      const value = res.data;
      for (let i = 0; i < value.data[0].labels.length; i++) {
        if (value.data[0].locale == "es_ES") {
          this.resourceTypes[i].name = value.data[0].labels[i],
          this.resourceTypes[i].name_en = value.data[1].labels[i]
        } else {
          this.resourceTypes[i].name = value.data[1].labels[i],
          this.resourceTypes[i].name_en = value.data[0].labels[i]
        }
      }
    });
  }

  // PDFs
  loadPDFs() {
    this.apolloApi.getData(PDFS_QUERY).subscribe((res) => {
      const value = res.data;
      if (value && value.data) {
        this.pdfs = value.data;
      }
    });
  }

}
