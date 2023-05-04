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
    school_id: School_id
    gender_id:  Gender_id
    language: Language_id
    nationality: Nationality_id
    country: Country_id
    tutor: CustomerViaTutor_id {
      name: Name
      id
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
      doctype: Customer_doc_typeViaCustomer_doc_type_id {
        name: Name
        id
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