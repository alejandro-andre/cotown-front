export const GET_BOOKING_BY_ID = `query booking($id: Int){
  booking: Booking_BookingList(where: { id: { EQ: $id } }) {
    id
    status: Status
    date_from: Date_from
    date_to: Date_to
    request_date: Request_date
    confirmation_date: Confirmation_date
    expiry_date: Expiry_date
    check_in: Check_in
    check_out: Check_out
    resource_type: Resource_type
    rent: Rent
    services: Services
    deposit: Deposit
    limit: Limit
    arrival: Arrival
    flight: Flight
    check_in_id: Check_in_option_id
    contract_rent: Contract_rent { name oid type size }
    contract_services: Contract_services { name oid type size }    contract_signed:Contract_signed
    reason: Customer_reasonViaReason_id{
      id
      name: Name
    }
    school: SchoolViaSchool_id {
      id
      name: Name
    }
    building: BuildingViaBuilding_id {
      id
      name: Name
      code: Code
    }
    payer: CustomerViaPayer_id {
      id
      name: Name
    }
    flat_type: Resource_flat_typeViaFlat_type_id{
      id
      name: Name
      code: Code
    }
    place_type: Resource_place_typeViaPlace_type_id {
      id
      code: Code
      name: Name
    }
    resource: ResourceViaResource_id {
      id
      code: Code
    }
    price_list: Booking_priceListViaBooking_id {
      id
      rent_date:Rent_date
      rent: Rent
      services: Services
      rent_discount: Rent_discount
      service_discount: Services_discount
    }
    options: Booking_optionListViaBooking_id {
      id
      accepted: Accepted
      resource: Resource_type
      building: BuildingViaBuilding_id {
        code: Code
        name: Name,
        id
      }
      flat_type: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name
        id
      }
      place_type: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
        id
      }
    }
  }
}`;

export const ACCEPT_BOOKING_OPTION = `mutation ($id: Int!, $accepted: Boolean) {
  updated: Booking_Booking_optionUpdate(
    where: { id: { EQ: $id } }
    entity:{
        Accepted: $accepted
    }
  ){id}
}`;

export const SIGN_BOOKING_CONTRACT = `mutation($id: Int!,$time: String){
  data: Booking_BookingUpdate( where:{ id: {EQ: $id}}
    entity:{
      Contract_signed:$time
    }
  ){id, Contract_signed}
}`;

export const UPDATE_BOOKING = `mutation(
  $id: Int!,
  $checkin: String,
  $checkout: String,
  $arrival: String,
  $flight: String,
  $option: Int,
  $selectedSchool: Int,
  $selectedReason: Int
){
  data: Booking_BookingUpdate( where:{ id: {EQ: $id}}
    entity:{
      Check_in: $checkin
      Check_out: $checkout
      Arrival: $arrival
      Flight: $flight
      Check_in_option_id: $option
      School_id: $selectedSchool,
      Reason_id: $selectedReason
    }
  ){
    id
  }
}`;
