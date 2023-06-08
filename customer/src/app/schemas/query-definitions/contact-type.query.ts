export const CONTACT_TYPE_QUERY = `query get {
  data: Customer_Customer_contact_typeList(
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
  }
}`;
