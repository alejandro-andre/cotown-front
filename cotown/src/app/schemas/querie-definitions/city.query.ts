export const CityListQuery = `query CityList {
  data: Geo_LocationList {
    id,
    name: Name
  }
}`;