export const BOOKING_LIST_QUERY = `
query BookingList([[params]]) {
  data: Booking_Booking_detailList[[where]] {
    booking_id: Booking_id
    booking_group_id: Booking_group_id
    availability_id: Availability_id
    status: Status
    date_from: Date_from
    date_to: Date_to
    lock: Lock
    building: BuildingViaBuilding_id (
      joinType: INNER
      where: { Active: { EQ: true } }
    ) {
      id
      code: Code
      DistrictViaDistrict_id (
        joinType: INNER 
        where: { Location_id: { EQ: $cityId } } 
      ) { 
        id 
      }
    }
    resource: ResourceViaResource_id(
      joinType: INNER 
      [[whereplace]] 
    ) {
      id
      code: Code
      flat_type: Resource_flat_typeViaFlat_type_id {
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
    }
    booking: BookingViaBooking_id {
      id
      check_in: Check_in
      check_out: Check_out
      comments: Comments
      customer: CustomerViaCustomer_id {
        name: Name
        birth_date: Birth_date
        gender: GenderViaGender_id {
          code: Code
          name: Name
          name_en: Name_en
        }
        email: Email
        phones: Phones
        country: CountryViaCountry_id {
          name: Name
          name_en: Name_en
        }
        nationality: CountryViaNationality_id {
          name: Name
          name_en: Name_en
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
    rooms: Booking_group_roomingViaBooking_rooming_id {
      id
      name: Name,
      email: Email
      phones: Phones
    }
  }
}`;

export const BOOKING_UPDATE = `mutation(
  $id: Int!
  $status: String!
  $checkinroomok: Boolean!
  $checkinnoticeok: Boolean!
  $checkinkeysok: Boolean!
  $checkinkeylessok: Boolean!
  $checkoutkeysok: Boolean!
  $checkoutkeylessok: Boolean!
) {
  data: Booking_BookingUpdate( where: { id: { EQ: $id } }
    entity:{
      Status: $status
      Check_in_room_ok: $checkinroomok
      Check_in_notice_ok: $checkinnoticeok
      Check_in_keys_ok: $checkinkeysok
      Check_in_keyless_ok: $checkinkeylessok
      Check_out_keys_ok: $checkoutkeysok
      Check_out_keyless_ok: $checkoutkeylessok
    }
  ) { id }
}`;



