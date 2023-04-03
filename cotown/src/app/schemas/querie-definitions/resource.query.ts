export const ResourceListByBuldingIdQuery = `query ResourceListByBuldingId($buildingId: Int)
  {
    data: Resource_ResourceList (where: {Building_id: {EQ: $buildingId}}) {
      code: Code
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

export const ResourceListByBuildingIdAndResourceTypeQuery = `query ResourceListByBuildingIdAndResourceTypeId($buildingId: Int, $resourceType: String){
    data: Resource_ResourceList (where: { Building_id: { EQ: $buildingId } }) {
      code: Code
      building_id: Building_id
      adress: Address
      resource_type: Resource_type
      resource_place_type: Resource_place_typeViaPlace_type_id(joinType: INNER where: { Code: { EQ: $resourceType } }) {
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
    data: Resource_Resource_place_typeList {
      code: Code
      name: Name,
      id
    }
  }`;