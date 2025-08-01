import { FormControl } from "@angular/forms"

// Navigation
export interface INav {
  name: string,
  url: string
};

// Phone number
export interface IPhone {
  prefix: string,
  number: string
}

// Interfaces
export interface IBase  {
  id: number,
  name: string
}

// ILookup tables
export interface ILookup extends IBase {};
export interface ILookupInt extends IBase {
  name_en?: string,
};

// Payment methods
export interface IPaymentMethod extends ILookupInt {
  gateway?: boolean
}

// Countries
export interface ICountry extends ILookupInt {
  prefix?: string
}

// Customer contact type
export interface IContactType extends ILookupInt {}

// Customer contact
export interface IContact extends IBase {
  email?: string,
  phones?: string,
  contact_type: IContactType,
};

// Customer
export interface ICustomer extends IBase {
  appLang?: string,
  email: string,
  city: string,
  zip: string,
  province: string,
  address: string,
  payment_method_id: number | null,
  iban: string,
  same_account: string,
  bank_account: string,
  swift: string,
  bank_holder: string,
  bank_name: string,
  bank_address: string,
  bank_city: string,
  bank_country_id: number | null,
  birth_date: string | null,
  tutor_id_type_id: number | null,
  tutor_document: string | null,
  tutor_name: string | null,
  tutor_email: string | null,
  tutor_phones: string | null,
  phones: string,
  document: string | null,
  country_origin_id: number | null,
  id_type_id: number | null,
  gender_id?: number | null,
  language_id: number | null,
  nationality_id: number | null,
  country_id: number | null,
  photo?: IPhoto | null,
  contacts?: IContact[],
  documents?: IDocument[],
  invoices?: IInvoice[],
  payments?: IPayment[],
  bookings?: IBooking[],
  changed: boolean
};

// Customer document
export interface IDocType extends IBase {
  name_en: string,
  images: number,
  expires: boolean
}
export interface IDocument {
  id: number,
  expiry_date: string | null ,
  doc_type?: IDocType,
  front?: IDocFile,
  back?: IDocFile,
  frontFile?: File,
  backFile?: File,
  formDateControl: FormControl
}

// Files
export interface IFile {
  name: string,
  oid: number,
  type: string
  size: number
}
export interface IPhoto extends IFile  {
  thumbnail: any | null,
  content: any,
}
export interface IDocFile extends IPhoto {
  id: number,
  file?: File,
  content: any,
}

// Building, flat and place types
export interface ICode extends IBase {
  code: string
}
export interface IBuilding extends ICode {}
export interface IFlatType extends ICode {}
export interface IPlaceType extends ICode {}

// Booking options
export interface IOption {
  id: number,
  accepted: boolean,
  building: IBuilding,
  resource_type: string,
  flat_type: IFlatType,
  place_type: IPlaceType,
}

export interface IRent extends IBase {
  rent: number,
  services: number,
  rent_date: string
  rent_discount: number,
  service_discount: number
}

export interface IBooking {
  id: number,
  status: string,
  date_from: string,
  date_to: string,
  request_date: string,
  confirmation_date: string | null,
  expiry_date: string | null,
  check_in: string | null,
  check_out: string | null,
  building: IBuilding,
  resource_type: string,
  flat_type: IFlatType | null,
  place_type: IPlaceType | null,
  resource: any,
  rent: number,
  services: number,
  limit: number,
  deposit: number
  reason: IBase,
  school: IBase,
  school_other: string | null,
  company: string | null,
  contract_id: string | null,
  contract_status: string | null,
  contract_signed: string | null,
  contract_rent: IDocFile | null,
  contract_services: IDocFile | null,
  check_in_option_id: number | null,
  check_out_option_id: number | null,
  flight: string | null,
  flight_out: string | null,
  arrival: string | null,
  check_in_time: string | null,
  check_out_time: string | null,
  price_list?: IRent[],
  options: IOption[] | null,
  questionnaires: [] | null
};

export interface IBookingResource {
  id: number,
  status: string,
  resource: ICode
}

export interface IInvoice {
  id: string,
  concept: string,
  total: number,
  issued_date: string,
  booking: IBookingResource,
};

export interface IPayment {
  id: string,
  amount: number,
  concept: string,
  issued_date: string,
  pay: string,
  payment_auth: string,
  payment_date: string,
  payment_type: string,
  payment_method_id: number | null,
  booking: IBookingResource
}

export interface IPayloadFile {
  id: number,
  type: string,
  data: any 
}

export interface IPdf {
  id: number,
  name: string,
  name_en: string,
  description: string,
  description_en: string
}

export interface IHoliday {
  day: string,
  location: number
}

