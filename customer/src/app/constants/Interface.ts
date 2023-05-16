import { FormControl } from "@angular/forms"

export interface Nav {
  name: string,
  url: string
};

export interface BasicResponse {
  name?: string,
  id: number,
  code?: string
};

export interface Rent extends BasicResponse {
  rent: number,
  services: number,
  rent_date: string
  rent_discount: number,
  service_discount: number
}

export interface Booking {
  id: number,
  start: string,
  end: string,
  status: string,
  building_id: number,
  resource_type: string,
  created_at: string,
  services: number,
  rent: number,
  request_date: string,
  confirmation_date: string | null,
  expiry_date: string | null,
  limit: number,
  flat: BasicResponse,
  resource: BasicResponse
  place: BasicResponse,
  price_list?: Rent[],
  payer: BasicResponse,
  building: BasicResponse
  reason: BasicResponse,
  school: BasicResponse,
  deposit: number
};

export interface TableObject {
  header: string,
  property: string,
  name: string
}

export interface BookingResource {
  resource: BasicResponse
}

export interface Invoice extends BasicResponse {
  concept: string,
  total: number,
  issue_date: string,
  booking: BookingResource,
};

export interface Payment extends BasicResponse {
  amount: number,
  concept: string,
  issue_date: string,
  pay: string,
  booking: BookingResource
}

export interface DocType extends BasicResponse {
  images: number,
  arrayOfImages?: Array<any>
}

export interface DocFile {
  name: string,
  oid: number
}

export interface Document extends BasicResponse {
  formDateControl: FormControl,
  expirity_date: string | null ,
  created_at: string,
  doctype: DocType,
  frontDoc?: DocFile,
  backDoc?: DocFile
}

export interface Contact extends BasicResponse {
  phone: string,
  email: string
}

export interface CustomerInterface {
  id: number,
  name: string,
  province: string,
  city: string,
  country: number | null,
  address: string,
  postalCode: string,
  document: string,
  email: string,
  phone: string,
  genderId?: number | null,
  languageId: number | null,
  originId: number | null,
  nationality: number | null,
  tutorId?: number | null,
  birthDate: Date | null,
  typeDoc: number | null,
  schoolOrCompany?: number | null,
  bankAcount?: string,
  contacts?: Contact[],
  documents?: Document[],
  bookings?: Booking[],
  invoices?: Invoice[],
  payments?: Payment[],
  appLang?: string,
};

export interface ContactVariables {
  id: number,
  cid: number,
  name: string,
  email?: string,
  phone?: string
};

export interface PayloadFile  {
  file: File,
  id: number,
  document: string,
}