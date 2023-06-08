import { FormControl } from "@angular/forms"

// Classes

export interface IBase  {
  id: number,
  name: string
}

export interface IContactType extends IBase {
}

export interface Contact extends IBase {
  email?: string,
  phones?: string,
  contact_type: IContactType,
};

export interface ICustomer extends IBase {
  appLang?: string,
  email: string,
  city: string,
  zip: string,
  province: string,
  address: string,
  bank_account?: string,
  birth_date: string | null,
  phones: string,
  document: string | null,
  country_origin_id: number | null,
  id_type_id: number | null,
  school_id?: number | null,
  gender_id?: number | null,
  language_id: number | null,
  nationality_id: number | null,
  country_id: number | null,
  
  photo?: Photo | null,
  contacts?: Contact[],
  documents?: Document[],
  invoices?: Invoice[],
  payments?: Payment[],
  bookings?: Booking[],
};

export interface DocFile {
  name: string,
  oid: number,
  type: string,
  size: number

  id: number,
  index?: number
  file?: File,
  fileName: string,
}

export interface Document {
  id: number,
  expiry_date: string | null ,
  front?: DocFile,
  back?: DocFile,
  doctype: DocType,
  formDateControl: FormControl,
}

export interface IBuilding extends IBase {
  code: string
}

export interface IFlatType extends IBase {
  code: string
}

export interface IPlaceType extends IBase {
  code: string
}

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

export interface IOption {
  id: number,
  accepted: boolean,
  building: IBuilding,
  resource_type: string,
  place_type: IPlaceType,
  flat_type: IFlatType,
}

export interface Booking {
  id: number,
  status: string,
  payer: BasicResponse,
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

  resource: BasicResponse

  rent: number,
  services: number,
  limit: number,
  deposit: number

  reason: BasicResponse,
  school: BasicResponse,

  contract_rent: ServerFileDocument | null,
  contract_services: ServerFileDocument | null,
  contract_signed: string | null,

  check_in_id: number | null,
  flight: string | null,
  arrival: string | null,
  
  price_list?: Rent[],
  options: IOption[] | null
};

export interface TableObject {
  header: string,
  property: string,
  name: string
}

export interface BookingResource {
  resource: BasicResponse
}

export interface Invoice {
  id: string,
  concept: string,
  total: number,
  issue_date: string,
  booking: BookingResource,
};

export interface Payment {
  id: string,
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

export interface ServerFileDocument {
  name: string,
  oid: number,
}

export interface Photo extends ServerFileDocument  {
  thumbnail: string | null,
  type: string
}

export interface PayloadFile  {
  file: File,
  id: number,
  document?: string,
}
