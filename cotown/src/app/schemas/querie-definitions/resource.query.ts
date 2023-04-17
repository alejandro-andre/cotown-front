export const ResourceListByBuldingIdQuery = `query ResourceListByBuldingId($buildingId: Int)
  {
    data: Resource_ResourceList (
      where: {Building_id: {EQ: $buildingId}}
      orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
    ) {
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
    }
  }`;

export const ResourceListByBuildingIdAndResourceTypeQuery = `query ResourceListByBuildingIdAndResourceTypeId($buildingId: Int, $resourceTypeId: Int){
    data: Resource_ResourceList (
      where: { Building_id: { EQ: $buildingId }, Place_type_id: { EQ: $resourceTypeId } }
      orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
    ) {
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
    }
  }`;

export const ResourceTypeQuery = `query ResourceType
  {
    data: Resource_Resource_place_typeList (
      orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
    ) {
      code: Code
      name: Name,
      id
    }
  }`;