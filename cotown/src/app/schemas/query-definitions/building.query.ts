export const BUILDINGS_QUERY = `
query BuildingList{
  data: Building_BuildingList(
    where: { Active: { EQ: true } }
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ) {
    name: Name
    code: Code,
    id,
    location: DistrictViaDistrict_id{
      city: LocationViaLocation_id {
        name: Name
        id
      }
    }
  }
}`;

export const BUILDINGS_BY_LOCATION_QUERY = `
query BuildingListByLocation($id: Int)
{
  data: Building_BuildingList (
    where: { Active: { EQ: true } }
    orderBy: [{ attribute: Name, direction: ASC, nullsGo: FIRST }]
  ) {
    id
    name: Name
    code: Code
    location: DistrictViaDistrict_id (
      joinType: INNER
      where: { Location_id: {EQ: $id} }
    ) {
      id
    }
  }
}`;

export const BUILDING_BY_BOOKING_QUERY = `query bookingQuery($id: Int)
{
  data: Booking_BookingList(
    where:{ id: { EQ: $id } }
  ) {
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    flat_type_id: Flat_type_id
    place_type_id: Place_type_id
    lock: Lock
  }
}`;
  
export const BUILDING_BY_BOOKING_GROUP_QUERY = `query bookingQuery($id: Int)
{
  data: Booking_Booking_groupList(
    where:{ id: { EQ: $id } }
  ) {
    id
    building_id: Building_id
    booking_id: id
    date_from: Date_from
    date_to: Date_to
    max: Rooms
    rooms: Room_ids
  }
}`;
  