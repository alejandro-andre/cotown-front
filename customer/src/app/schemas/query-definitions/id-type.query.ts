export const ID_TYPE_QUERY = `query idTypeQuery {
  data: Auxiliar_Id_typeList(
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;
