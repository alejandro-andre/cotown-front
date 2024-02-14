import { FormControl } from '@angular/forms';
import { ICustomer, IPhoto } from '../constants/Interface';
import { IBooking, IContact, IInvoice, IPayment, IDocument } from '../constants/Interface';

export class Customer implements ICustomer {

  id: number;
  name: string = '';
  province: string = '';
  city: string = '';
  country_id: number | null = null;
  address: string = '';
  zip: string = '';
  document: string | null = null;
  email: string = '';
  phones: string = '';
  gender_id: number | null = null;
  language_id: number | null = null;
  country_origin_id: number | null = null;
  nationality_id: number | null = null;
  birth_date: string | null = null;
  tutor_id_type_id: number | null = null;
  tutor_document: string | null = null;
  tutor_name: string | null = null;
  tutor_email: string | null = null;
  tutor_phones: string | null = null;
  id_type_id: number | null = null;
  school_id: number | null = null;
  payment_method_id: number | null = null;
  iban: string = '';
  same_account: string = '';
  bank_account: string = '';
  swift: string = '';
  bank_holder: string = '';
  bank_name: string = '';
  bank_address: string = '';
  bank_city: string = '';
  bank_country_id: number | null = null;
  appLang: string = 'es';
  photo: IPhoto | null = null;
  contacts: IContact[] = [] as IContact[];
  documents: IDocument[] = [] as IDocument[];
  bookings: IBooking[] = [] as IBooking[];
  invoices: IInvoice[] = [] as IInvoice[];
  payments: IPayment[] = [] as IPayment[];

  changed: boolean = false;
  
  formControl = new FormControl<Date | null>(null);

  constructor(data: ICustomer = {} as ICustomer ) {
    this.id = data.id;
    this.name = data.name || '';
    this.id_type_id = data.id_type_id;
    this.document = data.document || '';
    this.email = data.email;
    this.phones = data.phones || '';
    this.address = data.address || '';
    this.zip = data.zip || '';
    this.city = data.city || '';
    this.province = data.province || '';
    this.country_id = data.country_id;
    this.gender_id = data.gender_id || null;
    this.language_id = data.language_id;
    this.country_origin_id = data.country_origin_id;
    this.nationality_id = data.nationality_id;
    this.birth_date = data.birth_date;
    this.tutor_id_type_id = data.tutor_id_type_id;
    this.tutor_document = data.tutor_document;
    this.tutor_name = data.tutor_name;
    this.tutor_email = data.tutor_email;
    this.tutor_phones = data.tutor_phones;
    this.school_id = data.school_id || null;

    this.payment_method_id = data.payment_method_id || null;
    this.iban = data.iban || '';
    this.same_account = data.same_account;
    this.bank_account = data.bank_account || '';
    this.swift = data.swift || '';
    this.bank_holder = data.bank_holder || '';
    this.bank_name = data.bank_name || '';
    this.bank_address = data.bank_address || '';
    this.bank_city = data.bank_city || '';
    this.bank_country_id = data.bank_country_id;

    this.appLang = data.appLang || 'es';
    this.photo = data.photo || null;
   
    this.contacts = data.contacts || [];
    this.documents = data.documents || [];
    this.bookings = data.bookings || [];
    this.invoices = data.invoices || [];
    this.payments = data.payments || [];

    this.changed = false;
  }
  
};
