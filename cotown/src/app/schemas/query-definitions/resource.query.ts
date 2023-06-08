export const ResourceListQuery = `{
  code: Code
  id
  building_id: Building_id
  adress: Address
  resource_type: Resource_type
  resource_place_type: Resource_place_typeViaPlace_type_id {
    name: Name
    code: Code
  }
  building: BuildingViaBuilding_id{
    name: Name
    code: Code
    address: Address
  }
  flat_type: Resource_flat_typeViaFlat_type_id{
    id,
    name: Name,
    code: Code
  }
}`;

export const ResourcePlaceTypeQuery = `query ResourceType
  {
    data: Resource_Resource_place_typeList (
      orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
    ) {
      code: Code
      name: Name,
      id
    }
  }`;

export const ResourceFlatTypeQuery = `query ResourceFlatQuery{
  data: Resource_Resource_flat_typeList {
      id,
      code: Code,
      name: Name
  }

}`;