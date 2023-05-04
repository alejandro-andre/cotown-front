import { Injectable } from '@angular/core';
import { Country } from '../models/Country.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  public countryModel= new Country();

  constructor() {}

  setCountryData(data: BasicResponse []) {
    this.countryModel.countries = data;
  }

  get countries(): BasicResponse [] {
    return this.countryModel.countries || [];
  }
}