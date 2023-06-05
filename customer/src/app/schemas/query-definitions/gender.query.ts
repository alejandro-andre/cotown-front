export const GENDER_QUERY = `query genderQuery {
  genders: Auxiliar_GenderList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ){
    name: Name
    name_en: Name_en
    id
  }
}`;
