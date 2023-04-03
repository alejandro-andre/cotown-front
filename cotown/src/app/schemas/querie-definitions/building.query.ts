export const BuildingListQuery = `
query BuildingList{
  data: Building_BuildingList{
    name: Name
    code: Code,
    id
  }
}`;

export const BuildingListByCityNameQuery = ` query BuildingListByCityName($cityName: String)
  {
    data: Building_BuildingList{
      name: Name
      code: Code
      id,
      DistrictViaDistrict_id(joinType: INNER){LocationViaLocation_id(joinType: INNER where:{Name:{EQ: $cityName}}){Name}}}
  }`;