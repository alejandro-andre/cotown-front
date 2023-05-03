export interface Nav {
  name: string,
  url: string
};

export interface BasicResponse {
  __typename?: string,
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
