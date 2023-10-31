export const PAYMENT_METHOD_QUERY = `query get {
  data: Billing_Payment_methodList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
    where: { Customer: { EQ: true } }
  ) {
    id
    gateway: Gateway
    name: Name
    name_en: Name_en
  }
}`;

export const CONTACT_TYPE_QUERY = `query get {
  data: Customer_Customer_contact_typeList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const COUNTRY_QUERY = `query get {
  data: Geo_CountryList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
    prefix: Prefix
  }
}`;

export const GENDER_QUERY = `query get {
  data: Auxiliar_GenderList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const ID_TYPE_QUERY = `query idTypeQuery {
  data: Auxiliar_Id_typeList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const LANGUAGE_QUERY = `query get {
  data: Auxiliar_LanguageList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const SCHOOL_QUERY = `query get {
  data: Auxiliar_SchoolList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
  }
}`;

export const REASONS_QUERY = `query get {
  data: Booking_Customer_reasonList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const CHECKIN_OPTIONS_QUERY = `query checking_list {
  data: Booking_Checkin_typeList (
    orderBy: [{attribute: Name, direction: ASC, nullsGo: FIRST}]
  ) {
    id
    name: Name
    name_en: Name_en
  }
}`;

export const STATUS_QUERY = `
query get {
  data: Models_EnumTypeLabelList ( where: { container: { EQ: 7 } } ) {
      locale
      labels        
  }
}`;

export const RESOURCE_TYPE_QUERY = `
query get {
  data: Models_EnumTypeLabelList ( where: { container: { EQ: 6 } } ) {
      locale
      labels        
  }
}`;

export const PDFS_QUERY = `query get {
  data: Booking_Booking_docList (
    orderBy: [{attribute: id}]    
  ) {
    id
    name: Name
    name_en: Name_en
    description: Description
    description_en: Description_en
    document: Document { oid }
    document_en: Document_en { oid }
  }
}`;