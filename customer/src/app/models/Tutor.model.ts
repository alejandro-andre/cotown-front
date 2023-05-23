import { FormControl } from '@angular/forms';
import { CustomerInterface } from '../constants/Interface';
export class Tutor implements CustomerInterface {
  id!: number;
  name: string = '';
  province: string = '';
  city: string = '';
  country: number | null = null;
  address: string = '';
  postalCode: string = '';
  document: string = '';
  email: string = '';
  phone: string = '';
  languageId: number | null = null;
  originId: number | null = null;
  nationality: number | null = null;
  birthDate: Date | null = null;
  typeDoc: number | null = null;
  formControl = new FormControl<Date | null>(null);

  constructor(data: CustomerInterface = {} as CustomerInterface ) {
    this.id = data.id;
    this.name = data.name || '';
    this.province = data.province || '';
    this.city = data.city || '';
    this.country = data.country || null;
    this.address = data.address || '';
    this.postalCode = data.postalCode || '';
    this.document = data.document || '';
    this.email = data.email;
    this.phone = data.phone || '';
    this.languageId = data.languageId || null;
    this.originId = data.originId || null;
    this.nationality = data.nationality || null;
    this.birthDate = data.birthDate || null;
    this.formControl = new FormControl(this.birthDate);
    this.typeDoc = data.typeDoc || null;
  }
};
