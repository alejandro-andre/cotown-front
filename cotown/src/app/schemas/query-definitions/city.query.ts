export const CITIES_QUERY = `query CityList {
  data: Geo_LocationList (
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ) {
    id,
    name: Name
  }
}`;