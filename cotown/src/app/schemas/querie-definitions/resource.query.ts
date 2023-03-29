export const ResourceListByBuldingCodeQuery = `query ResourceListByBuldingCode($buildingCode: String)
  {
    data: Resource_ResourceList {
      code: Code
      building_id: Building_id
      adress: Address
      resource_type: Resource_type
      resource_place_type: Resource_place_typeViaPlace_type_id {
        name: Name
        code: Code
      }
      building: BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: $buildingCode}} ){
        name: Name
        code: Code
        address: Address
      }
    }
  }`;

export const ResourceListByBuildingCodeAndResourceTypeQuery = `query ResourceListByBuildingCodeAndResourceType($buidingCode: String, $resourceType: String){
    data: Resource_ResourceList {
      code: Code
      building_id: Building_id
      adress: Address
      resource_type: Resource_type
      resource_place_type: Resource_place_typeViaPlace_type_id(joinType: INNER where: { Code: { EQ: $resourceType } }) {
        name: Name
        code: Code
      }
      building: BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: $buidingCode}} ){
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
      name: Name
    }
  }`;