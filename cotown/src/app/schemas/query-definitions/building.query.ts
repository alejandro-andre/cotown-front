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
            name: Name,
            id
        }
    }
  }
}`;

export const BuildingListByCityNameQuery = ` query BuildingListByCityName($cityName: String)
  {
    data: Building_BuildingList (
      where: { Active: { EQ: true } }
      orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
    ) {
      name: Name
      code: Code
      id,
      location: DistrictViaDistrict_id(joinType: INNER){city: LocationViaLocation_id(joinType: INNER where:{Name:{EQ: $cityName}}){Name}}}
  }`;