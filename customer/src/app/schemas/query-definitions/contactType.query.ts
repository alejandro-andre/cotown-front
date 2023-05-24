export const CONTACT_TYPE_QUERY = `query contactTypeQuery {
  contacts: Customer_Customer_contact_typeList(
    orderBy: [{attribute: Name, direction:ASC, nullsGo: FIRST}]
  ){
    name: Name
    id
    name_en: Name_en
  }
}`;
