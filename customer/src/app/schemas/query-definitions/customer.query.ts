export const customerQuery = `query customerQuery($id: Int) {
  data: Customer_CustomerList(where: { id: { EQ: $id} }) {
    name: Name
    email: Email
    city: City
    postal_code: Zip
    province: Province
    adress: Address
    bank: Bank_account
    birth_date: Birth_date
    comments: Comments
    phones: Phones
    document: Document
    origin: Country_origin_id
    type_doc: Id_type_id
    tutor: CustomerViaTutor_id {
        name: Name
        id
    }
    gender_id:  Gender_id
    language: Language_id
    nationality: Nationality_id
    country: Country_id
    school: SchoolViaSchool_id {
      name: Name,
      id
    }
  }
}`;