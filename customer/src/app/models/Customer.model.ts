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
  }


};