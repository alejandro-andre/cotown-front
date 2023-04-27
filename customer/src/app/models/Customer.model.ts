import { FormControl } from '@angular/forms';
export class Customer {
  name: string = '';
  province: string = '';
  city: string = '';
  country: string = '';
  adress: string = '';
  postalCode: string = '';
  document: string = '';
  email: string = '';
  phone: string  ='';
  genderId: number | null = null;
  languageId: number | null = null;
  originId: number | null = null;
  nationality: number | null = null;
  tutor: string = '';
  birthDate: Date | null = null;
  typeDoc: number | null = null;
  formControl = new FormControl<Date | null>(null);
  schoolOrCompany: string = '';
  bankAcount: string = '';
  contacts: Array<any> = [];
  documents: Array<any> = []

  constructor(
    name: string = '',
    province: string = '',
    city: string = '',
    country: string = '',
    adress: string = '',
    postalCode: string = '',
    document: string = '',
    email: string = '',
    phone: string  ='',
    genderId: number | null = null,
    language: number | null = null,
    origin: number | null = null,
    nationality: number | null = null,
    tutor: string = '',
    birthDate: Date | null = null,
    typeDoc: number | null = null,
    schoolOrCompany: string = '',
    bankAcount: string = '',
    contacts: Array<any> = [],
    doc: Array<any> = [],
    ) {
    this.name = name;
    this.province = province;
    this.city = city;
    this.country = country;
    this.adress = adress;
    this.postalCode = postalCode;
    this.document = document;
    this.email = email;
    this.phone = phone;
    this.genderId = genderId;
    this.languageId = language;
    this.originId = origin;
    this.nationality = nationality;
    this.tutor = tutor;
    this.birthDate = birthDate;
    this.formControl = new FormControl(this.birthDate);
    this.typeDoc = typeDoc;
    this.schoolOrCompany = schoolOrCompany;
    this.bankAcount = bankAcount;
    this.contacts = contacts;
    this.documents = doc;
  }
};