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
    check_in_time: Check_in_time
    check_out_time: Check_out_time
    flight: Flight
    flight_out: Flight_out
    check_in_option_id: Check_in_option_id
    check_out_option_id: Check_out_option_id
    contract_id:Contract_id
    contract_status:Contract_status
    contract_signed:Contract_signed
    contract_rent: Contract_rent { name oid type size }
    contract_services: Contract_services { name oid type size }
    reason: Customer_reasonViaReason_id{
      id
      name: Name
      name_en: Name_en
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
    flat_type: Resource_flat_typeViaFlat_type_id{
      id
      code: Code
      name: Name
      name_en: Name_en
    }
    place_type: Resource_place_typeViaPlace_type_id {
      id
      code: Code
      name: Name
      name_en: Name_en
    }
    resource: ResourceViaResource_id {
      id
      code: Code
      address: Address
      notes: Notes
      flat: ResourceViaFlat_id {
        street: Street
        address: Address
      }
      building: BuildingViaBuilding_id {
        address: Address
        district: DistrictViaDistrict_id {
          location: Location_id
        }
      }
    }
    price_list: Booking_priceListViaBooking_id {
      id
      rent_date:Rent_date
      rent: Rent
      services: Services
      rent_discount: Rent_discount
      service_discount: Services_discount
    }
    questionnaires: Booking_questionnaireListViaBooking_id ( 
      where: { Completed: { IS_NULL: true } }
    ) {
      id
      type: Questionnaire_type
    }    
    options: Booking_optionListViaBooking_id {
      id
      accepted: Accepted
      resource: Resource_type
      flat_type: Resource_flat_typeViaFlat_type_id {
        id
        code: Code
        name: Name
      }
      place_type: Resource_place_typeViaPlace_type_id {
        id
        code: Code
        name: Name
        name_en: Name_en
      }
      building: BuildingViaBuilding_id {
        id
        code: Code
        name: Name
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

export const SIGN_BOOKING_CONTRACT = `mutation($id: Int! $time: String){
  data: Booking_BookingUpdate( where:{ id: {EQ: $id}}
    entity:{
      Contract_status: completed
      Contract_signed: $time
    }
  ){id, Contract_signed}
}`;

export const UPDATE_BOOKING = `mutation(
  $id: Int!,
  $checkin: String,
  $checkout: String,
  $arrival: String,
  $flight: String,
  $flightout: String,
  $checkintime: String,
  $checkouttime: String,
  $optionin: Int,
  $optionout: Int,
  $selectedSchool: Int,
  $selectedReason: Int
){
  data: Booking_BookingUpdate( where:{ id: {EQ: $id}}
    entity:{
      Check_in: $checkin
      Check_out: $checkout
      Arrival: $arrival
      Flight: $flight
      Flight_out: $flightout
      Check_in_time: $checkintime
      Check_out_time: $checkouttime
      Check_in_option_id: $optionin
      Check_out_option_id: $optionout
      School_id: $selectedSchool,
      Reason_id: $selectedReason
    }
  ){
    id
  }
}`;
