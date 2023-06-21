import { FormControl } from "@angular/forms"

// Navigation
export interface INav {
  name: string,
  url: string
};

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

// Customer contact type
export interface IContactType extends IBase {}

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
  bank_account?: string,
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
  school_id?: number | null,
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
  images: number
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
  payer: IBase,
  date_from: string,
  date_to: string,
  request_date: string,
  confirmation_date: string | null,
  expiry_date: string | null,
  check_in: string | null,
  check_out: string | null,
  building: IBuilding,
  resource_type: string,
  flat_type: IFlatType,
  place_type: IPlaceType,
  resource: any,
  rent: number,
  services: number,
  limit: number,
  deposit: number
  reason: IBase,
  school: IBase,
  contract_rent: IDocFile | null,
  contract_services: IDocFile | null,
  contract_signed: string | null,
  check_in_id: number | null,
  flight: string | null,
  arrival: string | null,
  price_list?: IRent[],
  options: IOption[] | null
};

export interface IBookingResource {
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

