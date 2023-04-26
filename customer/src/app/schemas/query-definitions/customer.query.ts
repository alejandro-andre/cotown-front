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
    tutor: CustomerViaTutor_id {
        name: Name
        id
    }
    gender: GenderViaGender_id {
        name: Name
        id
    }
    country: CountryViaCountry_id {
      name: Name,
      id
    }
    school: SchoolViaSchool_id {
      name: Name,
      id
    }
    nacionalty: CountryViaNationality_id {
      name: Name,
      id
    }
    origin: CountryViaCountry_origin_id {
      id,
      name: Name
    }
  }
}`;