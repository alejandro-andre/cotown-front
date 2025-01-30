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
  $status: Auxiliar_Booking_statusEnumType!
  $checkinroomok: Boolean!
  $checkinkeysok: Boolean!
  $checkinkeylessok: Boolean!
  $checkoutkeysok: Boolean!
  $checkoutkeylessok: Boolean!
  $checkoutrevisionok: Boolean!
  $eco_ext_keyless_ok: Boolean!
  $eco_ext_change_ok: Boolean!
  $issues_ok: Boolean!
  $damages_ok: Boolean!
) {
  data: Booking_BookingUpdate( where: { id: { EQ: $id } }
    entity:{
      Status: $status
      Check_in_room_ok: $checkinroomok
      Check_in_keys_ok: $checkinkeysok
      Check_in_keyless_ok: $checkinkeylessok
      Check_out_keys_ok: $checkoutkeysok
      Check_out_keyless_ok: $checkoutkeylessok
      Check_out_revision_ok: $checkoutrevisionok
      Eco_ext_keyless_ok: $eco_ext_keyless_ok
      Eco_ext_change_ok: $eco_ext_change_ok
      Issues_ok: $issues_ok
      Damages_ok: $damages_ok   
    }
  ) { id }
}`;

export const BOOKING_OTHER_UPDATE_DEV = `mutation ($id: Int!, $date: String) {
  updated: Booking_Booking_otherUpdate(
    where: { id: { EQ: $id } }
    entity: { Deposit_return_date: $date }
  ) {id}
}`;

export const BOOKING_OTHER_UPDATE_ITP = `mutation ($id: Int!, $date: String) {
  updated: Booking_Booking_otherUpdate(
    where: { id: { EQ: $id } }
    entity: { ITP_date: $date }
  ) {id}
}`;

export const BOOKING_OTHER_UPDATE_END = `mutation ($id: Int!, $date: String) {
  updated: Booking_Booking_otherUpdate(
    where: { id: { EQ: $id } }
    entity: { Burofax_date: $date }
  ) {id}
}`;

