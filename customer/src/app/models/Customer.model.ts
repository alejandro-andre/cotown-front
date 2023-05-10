import { FormControl } from '@angular/forms';
import { Booking, Contact, Invoice, Payment, Document } from '../constants/Interface';
export class Customer {
  id: number = 916
  name: string = '';
  province: string = '';
  city: string = '';
  country: number | null = null;
  address: string = '';
  postalCode: string = '';
  document: string = '';
  email: string = '';
  phone: string = '';
  genderId: number | null = null;
  languageId: number | null = null;
  originId: number | null = null;
  nationality: number | null = null;
  tutor: string = '';
  birthDate: Date | null = null;
  typeDoc: number | null = null;
  formControl = new FormControl<Date | null>(null);
  schoolOrCompany: number | null = null;
  bankAcount: string = '';
  contacts: Contact[] = [] as Contact[];
  documents: Document[] = [] as Document[];
  bookings: Booking[] = [] as Booking[];
  invoices: Invoice[] = [] as Invoice[];
  payments: Payment[] = [] as Payment[];
  appLang: string = 'es'

  constructor(
    name: string = '',
    province: string = '',
    city: string = '',
    country: number | null = null,
    address: string = '',
    postalCode: string = '',
    document: string = '',
    email: string = '',
    phone: string = '',
    genderId: number | null = null,
    language: number | null = null,
    origin: number | null = null,
    nationality: number | null = null,
    tutor: string = '',
    birthDate: Date | null = null,
    typeDoc: number | null = null,
    schoolOrCompany: number | null = null,
    bankAcount: string = '',
    contacts: Contact[] = [],
    doc: Document[] = [],
    bookings: Booking[] = [],
    invoices: Invoice[] = [],
    payments: Payment[] = [],
    appLang: string = 'es',
  ) {
    this.name = name;
    this.province = province;
    this.city = city;
    this.country = country;
    this.address = address;
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
    this.bookings = bookings;
    this.invoices = invoices;
    this.payments = payments;
    this.appLang = appLang;
  }
};