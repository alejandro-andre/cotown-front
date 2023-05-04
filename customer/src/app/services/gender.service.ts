import { Injectable } from '@angular/core';
import { Gender } from '../models/Gender.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class GenderService {
  public gendersModel= new Gender();

  constructor() {}

  setGenderData(data: BasicResponse []) {
    this.gendersModel.genders = data;
  }

  get genders(): BasicResponse [] {
    return this.gendersModel.genders || [];
  }
}