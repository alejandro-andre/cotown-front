export const SCHOOL_COMPANY_QUERY = `query schoolOrCompanies {
  data: Auxiliar_SchoolList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ){
    name: Name
    id
  }
}`;
