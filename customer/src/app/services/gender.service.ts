import { Injectable } from '@angular/core';
import { Gender, GenderInterface } from '../models/Gender.model';



@Injectable({
  providedIn: 'root'
})

export class GenderService {
  public gendersModel= new Gender();

  constructor() {}

  setGenderData(data: GenderInterface []) {
    this.gendersModel.genders = data;
  }
}