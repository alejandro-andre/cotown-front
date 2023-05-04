import { Injectable } from '@angular/core';
import { IdentificationDocTypes } from '../models/IdentificationDocTypes.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class IdentificationDocTypesService {
  public identificationTypesModel = new IdentificationDocTypes();

  constructor() {}

  setTypesData(data: BasicResponse []) {
    this.identificationTypesModel.types = data;
  }

  get types(): BasicResponse [] {
    return this.identificationTypesModel.types || [];
  }
}