export const COUNTRY_QUERY = `query CountryQuery {
  countries: Geo_CountryList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ){
    name: Name,
    id
  }
}`;
