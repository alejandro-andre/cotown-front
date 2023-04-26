import { Injectable } from '@angular/core';
import { BasicInterface } from '../models/interfaces';
import { Country } from '../models/Country.model';

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  public countryModel= new Country();

  constructor() {}

  setCountryData(data: BasicInterface []) {
    this.countryModel.countries = data;
  }
}