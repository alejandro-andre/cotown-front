export const customerQuery = `query customerQuery($id: Int) {
  data: Customer_CustomerList(where: { id: { EQ: $id} }) {
    id,
    appLang: Lang
    name: Name
    email: Email
    city: City
    postal_code: Zip
    province: Province
    address: Address
    bank: Bank_account
    birth_date: Birth_date
    comments: Comments
    phones: Phones
    document: Document
    origin: Country_origin_id
    type_doc: Id_type_id
    school_id: School_id
    gender_id:  Gender_id
    language: Language_id
    nationality: Nationality_id
    country: Country_id
    tutorId: Tutor_id
    photo: Photo {
      name
      oid
      thumbnail
      type
    }
    contacts: Customer_contactListViaCustomer_id {
      name: Name
      id
      phone: Phones
      email: Email
    }
    documents: Customer_docListViaCustomer_id {
      id
      expirity_date: Expiry_date
      created_at: Created_at
      front: Document{
        name
        oid
      }
      back: Document_back{
        name
        oid
      }
      doctype: Customer_doc_typeViaCustomer_doc_type_id {
        name: Name
        images:Images
        id
      }
    }

    invoices: InvoiceListViaCustomer_id {
      id,
      code: Code
      concept: Concept
      total: Total
      issue_date: Issued_date
      booking: BookingViaBooking_id {
        resource: ResourceViaResource_id {
          code: Code
          id
        }
      }
    }

    payments: PaymentListViaCustomer_id {
      id
      amount: Amount
      concept: Concept
      issue_date: Issued_date
      pay: Pay
      booking: BookingViaBooking_id{
        resource: ResourceViaResource_id {
          code: Code
          id
        }
      }
    }

    bookings: BookingListViaCustomer_id {
      id
      start: Date_from
      end: Date_to
      status: Status
      building_id: Building_id
      resource_type: Resource_type
      created_at: Created_at
      services: Services
      rent: Rent
      deposit: Deposit
      request_date: Request_date
      confirmation_date: Confirmation_date
      expiry_date: Expiry_date
      limit: Limit
      reason: Customer_reasonViaReason_id{
        id
        name: Name
      }
      shool: SchoolViaSchool_id {
        name: Name
        id
      }
      building: BuildingViaBuilding_id {
        name: Name
        code: Code
        id
      }
      payer: CustomerViaPayer_id {
        id
        name: Name
      }
      flat: Resource_flat_typeViaFlat_type_id{
          name: Name
          id
          code: Code
      }
      resource: ResourceViaResource_id {
        code: Code
        id
      }
      place: Resource_place_typeViaPlace_type_id {
        id
        code: Code
        name: Name
      }
      price_list: Booking_priceListViaBooking_id {
        rent: Rent
        services: Services
        id
        rent_date:Rent_date
        rent_discount: Rent_discount
        service_discount: Services_discount
      }
    }
  }
}`;

export const UPDATE_CUSTOMER = `
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
    $genderId: Int,
    $languageId: Int,
    $originId: Int,
    $nationality: Int,
    $birthDate: String,
    $typeDoc: Int,
    $schoolOrCompany: Int,
    $bankAcount: String
    $appLang: Auxiliar_LangEnumType){
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
      Bank_account: $bankAcount
      Birth_date: $birthDate
      Document: $document
      Country_origin_id: $originId
      Id_type_id: $typeDoc
      School_id: $schoolOrCompany
      Gender_id: $genderId
      Language_id: $languageId
      Nationality_id:$nationality
      Country_id: $country
      Lang: $appLang
    }){id}
}`;


export const UPLOAD_CUSTOMER_DOCUMENT = `mutation ($id: Int! $bill: Models_DocumentTypeInputType) {
  data: Customer_Customer_docUpdate ( where: { id: {EQ: $id} }
    entity: {
      Document: $bill
    }
  ){ id }
}`;

export const UPLOAD_CUSTOMER_DOCUMENT_BACK = `mutation ($id: Int! $bill: Models_DocumentTypeInputType) {
  data: Customer_Customer_docUpdate ( where: { id: {EQ: $id} }
    entity: {
      Document_back: $bill
    }
  ){ id }
}`;



export const UPLOAD_CUSTOMER_PHOTO = `mutation ($id: Int! $bill: Models_DocumentTypeInputType) {
  data: Customer_CustomerUpdate ( where: { id: {EQ: $id} }
    entity: {
      Photo: $bill
    }
  ){ id }
}`;


export const UPDATE_EXPERITY_DATE = `
mutation ($id: Int, $value: String){
  Customer_Customer_docUpdate(
      where: { id: { EQ: $id } }
      entity: {
          Expiry_date: $value
      }
  ){
      id,
  }
}`;
