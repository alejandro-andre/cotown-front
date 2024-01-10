export const BuildingListQuery = `
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

export const BuildingListByLocationQuery = `
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