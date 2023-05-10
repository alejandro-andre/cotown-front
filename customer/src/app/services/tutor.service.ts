import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer.model';
import { Tutor } from '../models/Tutor.model';

@Injectable({
  providedIn: 'root'
})

export class TutorService {
  private readOnly = {
    name: true,
    province: true,
    city: true,
    country: true,
    address: true,
    postalCode: true,
    document: true,
    email: true,
    phone: true,
    languageId: true,
    originId: true,
    nationality: true,
    birthDate: true,
    typeDoc: true,
  };

  public tutor = new Tutor();
  constructor() {}

  setTutorData(tutor: Tutor): void {
    this.tutor = tutor;
    this.setVisibility();
  }

  get visibility(): { [key: string]: boolean }{
    return this.readOnly;
  }

  private setVisibility(): void {
    if (this.tutor.name === '' || this.tutor.name === null) {
      this.readOnly.name = false;
    }

    if (this.tutor.province === '' || this.tutor.province === null) {
      this.readOnly.province = false;
    }

    if (this.tutor.city === '' || this.tutor.city === null) {
      this.readOnly.city = false;
    }

    if (this.tutor.country === null) {
      this.readOnly.city = false;
    }

    if (this.tutor.address === '' || this.tutor.address === null) {
      this.readOnly.address = false;
    }

    if (this.tutor.postalCode === '' || this.tutor.postalCode === null) {
      this.readOnly.postalCode = false;
    }

    if (this.tutor.document === '' || this.tutor.document === null) {
      this.readOnly.document = false;
    }

    if (this.tutor.email === '' || this.tutor.email === null) {
      this.readOnly.email = false;
    }

    if (this.tutor.phone === '' || this.tutor.phone === null) {
      this.readOnly.phone = false;
    }

    if (this.tutor.languageId === null) {
      this.readOnly.languageId = false;
    }

    if (this.tutor.originId === null) {
      this.readOnly.originId = false;
    }

    if (this.tutor.nationality === null) {
      this.readOnly.nationality = false;
    }

    if (this.tutor.birthDate === null) {
      this.readOnly.birthDate = false;
    }

    if (this.tutor.typeDoc === null) {
      this.readOnly.typeDoc = false;
    }
  }
}
