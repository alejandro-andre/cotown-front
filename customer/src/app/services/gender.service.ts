import { Injectable } from '@angular/core';
import { Gender } from '../models/Gender.model';
import { BasicInterface } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})

export class GenderService {
  public gendersModel= new Gender();

  constructor() {}

  setGenderData(data: BasicInterface []) {
    this.gendersModel.genders = data;
  }

  get genders(): BasicInterface [] {
    return this.gendersModel.genders || [];
  }
}