export const BookingListQuery = `{
  building_id: Building_id
  rooming: Booking_rooming_id
  group_id: Booking_group_id
  building: BuildingViaBuilding_id (joinType: INNER) {
      code: Code
      DistrictViaDistrict_id (joinType: INNER where: { Location_id: { EQ: $cityId } } ) { id }
  }
  room_user: Booking_roomingViaBooking_rooming_id {
      email: Email
      name: Name,
      phones: Phones
  }
  group: Booking_groupViaBooking_group_id {
      customer: CustomerViaPayer_id {
      name: Name
      email: Email
      phones: Phones
      }
  }
  booking_id: Booking_id
  booking: BookingViaBooking_id {
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
  status: Status
  resource: ResourceViaResource_id{
      id
      code: Code
  }
  date_from: Date_from
  date_to: Date_to
  lock: Lock
  flat_type: Resource_flat_typeViaFlat_type_id {
      code: Code
      name: Name,
      id
  }
  place_type: Resource_place_typeViaPlace_type_id {
      code: Code
      name: Name
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
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    max: Rooms
    rooms: Room_ids
  }
}`;
