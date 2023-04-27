import { Injectable } from '@angular/core';
import { BasicInterface } from '../models/interfaces';
import { Languages } from '../models/Language.model';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  public languageModel = new Languages();

  constructor() {}

  setLanguageData(data: BasicInterface []) {
    this.languageModel.languages = data;
  }

  get languages(): BasicInterface[] {
    return this.languageModel.languages || [];
  }
}