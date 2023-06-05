export const IDENTIFICATION_DOC_TYPE_QUERY = `query identificationDocTypes {
  types: Auxiliar_Id_typeList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ){
    name: Name
    name_en: Name_en
    id
  }
}`;
