export const LANGUAGE_QUERY = `query languageQuery {
  languages: Auxiliar_LanguageList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ) {
    name: Name
    name_en: Name_en
    id
  }
}`;
