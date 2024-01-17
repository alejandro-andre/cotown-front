export const ResourceListQuery = `{
  id
  code: Code
  address: Address
  resource_type: Resource_type
  notes: Notes
  building: BuildingViaBuilding_id (
    joinType: INNER 
    where: { Active: { EQ: true } }
  ) {
    id
    name: Name
    code: Code
    address: Address
    notes: Notes
    DistrictViaDistrict_id (joinType: INNER where: { Location_id: { EQ: $cityId } } ) {
      id
    }
  }
  place_type: Resource_place_typeViaPlace_type_id {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
  flat_type: Resource_flat_typeViaFlat_type_id {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
  pricing: Pricing_rateViaRate_id {
    multiplier: Multiplier
  }
  amenities: Resource_amenityListViaResource_id {
    amenity_type: Resource_amenity_typeViaAmenity_type_id {
        increment: Increment
    }
  }
}
`;

export const ResourcePlaceTypeQuery = `query ResourceType {
  data: Resource_Resource_place_typeList (
    orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
  ) {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
}`;

export const ResourceFlatTypeQuery = `query ResourceFlatQuery {
  data: Resource_Resource_flat_typeList {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
}`;

export const PricingQuery = `query PricingQuery {
  data: Billing_Pricing_detailList (
    orderBy: [{attribute: Building_id}, {attribute: Flat_type_id}, {attribute: Place_type_id}]
  ) {
    building: Building_id
    flat_type_id: Flat_type_id
    place_type_id: Place_type_id
    year: Year
    long: Rent_long
    medium: Rent_medium
    short: Rent_short
    services: Services
  }
}`;