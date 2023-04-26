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
  }
};