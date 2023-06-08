export const SCHOOL_QUERY = `query get {
  data: Auxiliar_SchoolList(
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
  }
}`;
