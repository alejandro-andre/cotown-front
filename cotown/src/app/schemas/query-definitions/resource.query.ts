export const RESOURCES_QUERY = `{
  id
  code: Code
  nra: Registry_num
  address: Address
  resource_type: Resource_type
  area_woc: Area_woc
  notes: Notes
  limit_type: Limit_type
  max_rent: Max_rent
  max_services: Max_services
  max_expenses: Max_expenses
  max_furniture: Max_furniture
  max_utility: Max_utility
  lau_free_date: Last_LAU_free_date
  last_cleaning: Last_cleaning
  last_planned_cleaning: Last_planned_cleaning
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

export const RESOURCE_PLACE_TYPES_QUERY = `query ResourceType {
  data: Resource_Resource_place_typeList (
    orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}]
  ) {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
}`;

export const RESOURCE_FLAT_TYPES_QUERY = `query ResourceFlatQuery {
  data: Resource_Resource_flat_typeList {
    id
    code: Code
    name: Name
    name_en: Name_en
  }
}`;

export const PRICES_QUERY = `query PricingQuery {
  data: Billing_Pricing_detailList (
    where: {Year: { GE: ${new Date().getFullYear()} }}
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