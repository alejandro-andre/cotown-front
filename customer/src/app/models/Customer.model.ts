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
  id_type_id: number | null = null;
  school_id: number | null = null;
  bank_account: string = '';
  appLang: string = 'es';
  photo: IPhoto | null = null;

  contacts: IContact[] = [] as IContact[];
  documents: IDocument[] = [] as IDocument[];
  bookings: IBooking[] = [] as IBooking[];
  invoices: IInvoice[] = [] as IInvoice[];
  payments: IPayment[] = [] as IPayment[];
  
  formControl = new FormControl<Date | null>(null);

  constructor(data: ICustomer = {} as ICustomer ) {
    this.id = data.id;
    this.name = data.name || '';
    this.province = data.province || '';
    this.city = data.city || '';
    this.country_id = data.country_id || null;
    this.address = data.address || '';
    this.zip = data.zip || '';
    this.document = data.document || '';
    this.email = data.email;
    this.phones = data.phones || '';
    this.gender_id = data.gender_id || null;
    this.language_id = data.language_id || null;
    this.country_origin_id = data.country_origin_id || null;
    this.nationality_id = data.nationality_id || null;
    this.birth_date = data.birth_date || null;
    this.id_type_id = data.id_type_id || null;
    this.school_id = data.school_id || null;
    this.bank_account = data.bank_account || '';
    this.appLang = data.appLang || 'es';
    this.photo = data.photo || null;
    
    this.contacts = data.contacts || [];
    this.documents = data.documents || [];
    this.bookings = data.bookings || [];
    this.invoices = data.invoices || [];
    this.payments = data.payments || [];
  }
};
