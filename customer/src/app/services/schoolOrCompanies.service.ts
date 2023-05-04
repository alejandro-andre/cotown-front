import { Injectable } from '@angular/core';
import { schoolOrCompany } from '../models/SchoolOrCompany.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class schoolOrCompaniesService {
  public schoolOrCompaniesModel = new schoolOrCompany();

  constructor() {}

  setSchoolOrCompaniesData(data: BasicResponse []) {
    this.schoolOrCompaniesModel.schoolOrCompanies = data;
  }

  get schoolOrCompanies(): BasicResponse[] {
    return this.schoolOrCompaniesModel.schoolOrCompanies ||[];
  }
}