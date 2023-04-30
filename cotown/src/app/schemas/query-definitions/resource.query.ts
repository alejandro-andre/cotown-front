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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListQuery = `query ResourceList
  {
    data: Resource_ResourceList (
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListByBuildingIdAndResourceFlatTypeQuery = `query ResourceListByBuildingIdAndResourceTypeFlatId($buildingId: Int, $resourceTypeFlatId: Int){
    data: Resource_ResourceList (
      where: { Building_id: { EQ: $buildingId }, Flat_type_id: { EQ: $resourceTypeFlatId } }
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListByBuildingIdAndResourceTypeAndFlatQuery = `query ResourceListByBuildingIdAndResourceTypeIdAndFlatId($buildingId: Int, $resourceTypeId: Int, $resourceTypeFlatId: Int){
    data: Resource_ResourceList (
      where: { Building_id: { EQ: $buildingId }, Place_type_id: { EQ: $resourceTypeId }, Flat_type_id: { EQ: $resourceTypeFlatId } }
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListByResourceTypeQuery = `query ResourceListByResourceTypeId($resourceTypeId: Int){
    data: Resource_ResourceList (
      where: { Place_type_id: { EQ: $resourceTypeId } }
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListByResourceTypeAndFlatQuery = `query ResourceListByResourceTypeIdAndFlatId($resourceTypeId: Int, $resourceTypeFlatId: Int){
    data: Resource_ResourceList (
      where: { Place_type_id: { EQ: $resourceTypeId },  Flat_type_id: { EQ: $resourceTypeFlatId } }
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
      }
    }
  }`;

export const ResourceListByResourceFlatTypeQuery = `query ResourceListByResourceFlatTypeQuery($resourceTypeFlatId: Int)
  {
    data: Resource_ResourceList (
      orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
      where: { Flat_type_id: { EQ: $resourceTypeFlatId } }
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
      flat: Resource_flat_typeViaFlat_type_id{
        id,
        name: Name,
        code: Code
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

export const ResourceFlatTypeQuery = `query ResourceFlatQuery{
  data: Resource_Resource_flat_typeList {
      id,
      code: Code,
      name: Name
  }

}`;