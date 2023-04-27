import { Injectable } from '@angular/core';
import { BasicInterface } from '../models/interfaces';
import { IdentificationDocTypes } from '../models/IdentificationDocTypes.model';

@Injectable({
  providedIn: 'root'
})

export class IdentificationDocTypesService {
  public identificationTypesModel = new IdentificationDocTypes();

  constructor() {}

  setTypesData(data: BasicInterface []) {
    this.identificationTypesModel.types = data;
  }
}