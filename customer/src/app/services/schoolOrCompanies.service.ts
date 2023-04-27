import { Injectable } from '@angular/core';
import { BasicInterface } from '../models/interfaces';
import { schoolOrCompany } from '../models/SchoolOrCompany.model';

@Injectable({
  providedIn: 'root'
})

export class schoolOrCompaniesService {
  public schoolOrCompaniesModel = new schoolOrCompany();

  constructor() {}

  setSchoolOrCompaniesData(data: BasicInterface []) {
    this.schoolOrCompaniesModel.schoolOrCompanies = data;
  }

  get schoolOrCompanies(): BasicInterface[] {
    return this.schoolOrCompaniesModel.schoolOrCompanies ||[];
  }
}