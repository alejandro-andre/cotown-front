export const GENDER_QUERY = `query get {
  data: Auxiliar_GenderList(
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;
