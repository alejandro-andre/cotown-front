export const GET_BOOKING_BY_ID = `query booking($id: Int){
  booking: Booking_BookingList(where: { id: { EQ: $id } }) {
    id
    start: Date_from
    end: Date_to
    status: Status
    building_id: Building_id
    resource_type: Resource_type
    created_at: Created_at
    services: Services
    rent: Rent
    deposit: Deposit
    request_date: Request_date
    confirmation_date: Confirmation_date
    expiry_date: Expiry_date
    limit: Limit
    contract_rent: Contract_rent{
      name
      oid
    }
    contract_services: Contract_services {
      name
      oid
    }
    contract_signed:Contract_signed
    reason: Customer_reasonViaReason_id{
      id
      name: Name
    }
    shool: SchoolViaSchool_id {
      name: Name
      id
    }
    building: BuildingViaBuilding_id {
      name: Name
      code: Code
      id
    }
    payer: CustomerViaPayer_id {
      id
      name: Name
    }
    flat: Resource_flat_typeViaFlat_type_id{
      name: Name
      id
      code: Code
    }
    resource: ResourceViaResource_id {
      code: Code
      id
    }
    place: Resource_place_typeViaPlace_type_id {
      id
      code: Code
      name: Name
    }
    price_list: Booking_priceListViaBooking_id {
      rent: Rent
      services: Services
      id
      rent_date:Rent_date
      rent_discount: Rent_discount
      service_discount: Services_discount
    }
    options: Booking_optionListViaBooking_id {
      accepted: Accepted
      id
      resource: Resource_type
      resource_place: Resource_place_typeViaPlace_type_id {
        code: Code
        name: Name
        id
      }
      resource_flat: Resource_flat_typeViaFlat_type_id {
        code: Code
        name: Name
        id
      }
      booking_id: Booking_id
      building: BuildingViaBuilding_id {
        code: Code
        name: Name,
        id
      }
    }
  }
}`;