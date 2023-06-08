import { FormControl } from "@angular/forms"

export interface Nav {
  name: string,
  url: string
};

export interface Lookup {
  id: number,
  name?: string,
};

export interface LookupInt {
  id: number,
  name?: string,
  name_en?: string,
};

export interface BasicResponse {
  id: number,
  code?: string
  name?: string,
  name_en?: string,
};

export interface Rent extends BasicResponse {
  rent: number,
  services: number,
  rent_date: string
  rent_discount: number,
  service_discount: number
}

export interface Option {
  resource: string,
  accepted: boolean,
  id: number,
  resource_place: BasicResponse,
  resource_flat: BasicResponse,
  booking_id: number,
  building: BasicResponse
}

export interface Booking {
  flight: string | null,
  check_in_id: number | null,
  arrival: string | null,
  check_in: string | null,
  check_out: string | null,
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
  contract_rent: ServerFileDocument | null,
  contract_services: ServerFileDocument | null,
  contract_signed: string | null,
  options: Option[] | null
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
  id: number,
  name: string,
  oid: number,
  file?: File,
  type: string,
  index?: number
}

export interface Document extends BasicResponse {
  formDateControl: FormControl,
  expirity_date: string | null ,
  created_at: string,
  doctype: DocType,
  front?: DocFile,
  back?: DocFile
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
  photo?: Photo | null,
};

export interface ServerFileDocument {
  name: string,
  oid: number,
}

export interface Photo extends ServerFileDocument  {
  thumbnail: string | null,
  type: string
}

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
  document?: string,
}
