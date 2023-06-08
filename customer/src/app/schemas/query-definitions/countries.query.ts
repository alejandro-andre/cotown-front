export const COUNTRY_QUERY = `query get {
  data: Geo_CountryList(
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;
