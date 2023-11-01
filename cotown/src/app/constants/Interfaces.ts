export interface GraphQlResponse {
  name: string,
  id: number,
}

export interface ApolloVariables {
  [key: string]: string | number
};

export interface AvailabilityPayload {
  date_from: String,
  date_to: String,
  building?: number,
  flat_type?: number
  place_type?: number
};

export interface Building extends GraphQlResponse{
  code: string,
  location?: any
};

export interface City extends GraphQlResponse{}

export interface ResourceType extends GraphQlResponse {
  code: string,
}

export interface Resource {
  Resource_id: number,
  Resource_code: string,
  Resource_type: string,
  Resource_info: string
  Resource_flat_type: number,
  Resource_place_type: number,
  Resource_notes: string
}

export interface Booking {
  Booking_id: number,
  Booking_code: number,
  Booking_lock: string,
  Booking_status: string,
  Booking_date_from: string,
  Booking_date_to: string,
  Booking_comments: string,
  Resource_id: number,
  Resource_code: string
  Customer_name?: string,
  Customer_gender?: string,
  Customer_country?: string,
  Customer_nationality?: string,
  Customer_email?: string,
  Customer_phone?: string,
  Customer_age?: number,
  Customer_last_name?: string,
}

export interface Params {
  entityId: number,
  entity: string,
  attribute: string,
  value: any;
}
