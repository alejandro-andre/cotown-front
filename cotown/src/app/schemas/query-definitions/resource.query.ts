export const ResourceListQuery = `{
  id
  code: Code
  address: Address
  resource_type: Resource_type
  building: BuildingViaBuilding_id (joinType: INNER ) {
    id
    name: Name
    code: Code
    address: Address
    DistrictViaDistrict_id (joinType: INNER where: { Location_id: { EQ: $cityId } } ) {
      id
    }
  }
  place_type: Resource_place_typeViaPlace_type_id {
    id
    name: Name
    code: Code
  }
  flat_type: Resource_flat_typeViaFlat_type_id {
    id,
    name: Name,
    code: Code
  }
}
`;

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