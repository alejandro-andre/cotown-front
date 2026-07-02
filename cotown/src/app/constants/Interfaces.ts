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

export interface Price {
  key: string,
  year: number,
  long: number,
  medium: number,
  short: number,
  services: number,
};

export interface Holiday {
  day: string,
  location: number
}

export interface City extends GraphQlResponse{}

export interface ResourceType extends GraphQlResponse {
  code: string,
}

export interface Resource {
  resource_id: number,
  resource_nra: string,
  resource_code: string,
  resource_type: string,
  resource_info: string
  resource_building_id: number,
  resource_flat_type: number,
  resource_place_type: number,
  resource_notes: string,
  resource_area_woc: number,
  resource_rate: number,
  resource_limit_type: string,
  resource_max_rent: number,
  resource_max_services: number,
  resource_max_expenses: number,
  resource_max_furniture: number,
  resource_max_utility: number,
  resource_lau_free_date: Date,
  resource_last_cleaning: Date | null,
  resource_last_planned_cleaning: Date | null,
  resource_prices: any[]
}

export interface Booking {
  booking_id: number,
  booking_code: number,
  booking_lock: string,
  booking_status: string,
  booking_date_from: string,
  booking_date_to: string,
  booking_comments: string,
  resource_id: number,
  resource_code: string
  rustomer_name?: string,
  customer_gender?: string,
  customer_country?: string,
  customer_nationality?: string,
  customer_email?: string,
  customer_phone?: string,
  customer_age?: number,
  customer_last_name?: string,
}

export interface Params {
  entityId: number,
  entity: string,
  attribute: string,
  value: any;
}
