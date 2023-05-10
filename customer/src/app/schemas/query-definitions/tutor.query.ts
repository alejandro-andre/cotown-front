export const UPDATE_TUTOR = `
  mutation(
    $id: Int!,
    $name: String!,
    $province: String,
    $city: String,
    $country: Int,
    $address: String,
    $postalCode: String,
    $document: String,
    $phone: String,
    $email:String!,
    $languageId: Int,
    $originId: Int,
    $nationality: Int,
    $birthDate: String,
    $typeDoc: Int){
  Customer_CustomerUpdate(
    where:{ id: {EQ: $id} }
    entity:{
      Name:$name
      Email:$email
      Phones: $phone
      City: $city
      Zip: $postalCode
      Province: $province
      Address: $address
      Birth_date: $birthDate
      Document: $document
      Country_origin_id: $originId
      Id_type_id: $typeDoc
      Language_id: $languageId
      Nationality_id:$nationality
      Country_id: $country
    }){id}
}`;

export const TUTOR_QUERY =`query tutorQuery($id: Int) {
  data: Customer_CustomerList(where: { id: { EQ: $id} }) {
    id,
    name: Name
    email: Email
    city: City
    country: Country_id
    postal_code: Zip
    province: Province
    address: Address
    birth_date: Birth_date
    phones: Phones
    language: Language_id
    nationality: Nationality_id
    document: Document
    origin: Country_origin_id
    type_doc: Id_type_id
  }
}`;