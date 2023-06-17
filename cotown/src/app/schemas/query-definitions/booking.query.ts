export const BookingListQuery = `{
  booking_id: Booking_id
  status: Status
  date_from: Date_from
  date_to: Date_to
  lock: Lock
  building: BuildingViaBuilding_id (joinType: INNER) {
    id
    code: Code
    DistrictViaDistrict_id (joinType: INNER where: { Location_id: { EQ: $cityId } } ) { id }
  }
  flat_type: Resource_flat_typeViaFlat_type_id {
      code: Code
      name: Name,
      id
  }
  place_type: Resource_place_typeViaPlace_type_id {
      code: Code
      name: Name
  }
  resource: ResourceViaResource_id{
    id
    code: Code
  }
  booking: BookingViaBooking_id {
    check_in: Check_in
    check_out: Check_out
    customer: CustomerViaCustomer_id {
      name: Name
      birth_date: Birth_date
      gender: GenderViaGender_id {
        code: Code
        name: Name
      }
      email: Email
      phones: Phones
      country: CountryViaCountry_id {
        name: Name
      }
    }
  }
  group: Booking_groupViaBooking_group_id {
    id
    customer: CustomerViaPayer_id {
      name: Name
      email: Email
      phones: Phones
    }
  }
  rooms: Booking_roomingViaBooking_rooming_id {
    id
    email: Email
    name: Name,
    phones: Phones
  }
}`;

export const BuildingDataViaBooking = `query bookingQuery($id: Int)
{
  data: Booking_BookingList(where:{ id: { EQ: $id } }) {
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    flat_type_id: Flat_type_id
    place_type_id: Place_type_id
    lock: Lock
 }
}`;

export const BuildingDataViaBookingGroup = `query bookingQuery($id: Int)
{
  data: Booking_Booking_groupList(where:{ id: { EQ: $id } }) {
    id
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    max: Rooms
    rooms: Room_ids
  }
}`;
