import { Injectable } from '@angular/core';
import { Languages } from '../models/Language.model';
import { BasicResponse } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  public languageModel = new Languages();

  constructor() {}

  setLanguageData(data: BasicResponse []) {
    this.languageModel.languages = data;
  }

  get languages(): BasicResponse[] {
    return this.languageModel.languages || [];
  }
}