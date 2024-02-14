export const CUSTOMER_ID_QUERY = `query user_id {
  data: Customer_CustomerList {
    id
  }
}`;

export const CUSTOMER_QUERY = `query customerQuery($id: Int) {
  data: Customer_CustomerList(where: { id: { EQ: $id } } ) {
    id
    appLang: Lang
    name: Name
    email: Email
    city: City
    zip: Zip
    province: Province
    address: Address
    payment_method_id: Payment_method_id
    iban: IBAN
    same_account: Same_account
    bank_account: Bank_account
    swift: Swift
    bank_holder: Bank_holder
    bank_name: Bank_name
    bank_address: Bank_address
    bank_city: Bank_city
    bank_country_id: Bank_country_id
    birth_date: Birth_date
    tutor_id_type_id: Tutor_id_type_id
    tutor_document: Tutor_document
    tutor_name: Tutor_name
    tutor_email: Tutor_email
    tutor_phones: Tutor_phones
    phones: Phones
    document: Document
    country_origin_id: Country_origin_id
    id_type_id: Id_type_id
    school_id: School_id
    gender_id:  Gender_id
    language_id: Language_id
    nationality_id: Nationality_id
    country_id: Country_id
    photo: Photo { name oid type size thumbnail }
    contacts: Customer_contactListViaCustomer_id {
      id
      name: Name
      phones: Phones
      email: Email
      contact_type: Customer_contact_typeViaCustomer_contact_type_id {
        id
        name: Name
        name_en: Name_en
      }
    }
    documents: Customer_docListViaCustomer_id {
      id
      expiry_date: Expiry_date
      front: Document { name oid type size }
      back: Document_back { name oid type size }
      doc_type: Customer_doc_typeViaCustomer_doc_type_id {
        id
        name: Name
        name_en: Name_en
        images: Images
        expires: Expires
      }
    }
    bookings: BookingListViaCustomer_id {
      id
      status: Status
      date_from: Date_from
      date_to: Date_to
      request_date: Request_date
      confirmation_date: Confirmation_date
      expiry_date: Expiry_date
      check_in: Check_in
      check_out: Check_out
      resource_type: Resource_type
      rent: Rent
      services: Services
      deposit: Deposit
      limit: Limit
      arrival: Arrival
      check_in_time: Check_in_time
      flight: Flight
      check_in_option_id: Check_in_option_id
      contract_rent: Contract_rent { name oid type size }
      contract_services: Contract_services { name oid type size }
      contract_signed: Contract_signed
      reason: Customer_reasonViaReason_id {
        id
        name: Name
        name_en: Name_en
      }
      school: SchoolViaSchool_id {
        id
        name: Name
      }
      building: BuildingViaBuilding_id {
        id
        name: Name
        code: Code
      }
      flat_type: Resource_flat_typeViaFlat_type_id {
        id
        code: Code
        name: Name
        name_en: Name_en
      }
      place_type: Resource_place_typeViaPlace_type_id {
        id
        code: Code
        name: Name
        name_en: Name_en
      }
      resource: ResourceViaResource_id {
        id
        code: Code
        address: Address
        notes: Notes
        flat: ResourceViaFlat_id {
          street: Street
          address: Address
        }
        building: BuildingViaBuilding_id {
          address: Address
          district: DistrictViaDistrict_id {
            location: Location_id
          }
        }
      }
      questionnaires: Booking_questionnaireListViaBooking_id ( 
        where: { Completed: { IS_NULL: true } }
      ) {
        id
        type: Questionnaire_type
      }    
      options: Booking_optionListViaBooking_id {
        id
        accepted: Accepted
        resource_type: Resource_type
        building: BuildingViaBuilding_id {
          id
          code: Code
          name: Name
        }
        flat_type: Resource_flat_typeViaFlat_type_id {
          id
          code: Code
          name: Name
          name_en: Name_en
        }
        place_type: Resource_place_typeViaPlace_type_id {
          id
          code: Code
          name: Name
          name_en: Name_en
        }
      }
      price_list: Booking_priceListViaBooking_id {
        id
        rent_date: Rent_date
        rent: Rent
        services: Services
        rent_discount: Rent_discount
        service_discount: Services_discount
      }
    }
    invoices: InvoiceListViaCustomer_id {
      id,
      code: Code
      concept: Concept
      total: Total
      issued_date: Issued_date
      document: Document { name oid type size }
      booking: BookingViaBooking_id {
        id
        status: Status
        resource: ResourceViaResource_id {
          id
          code: Code
        }
      }
    }
    payments: PaymentListViaCustomer_id (
      where: { Amount: { GT: 0 } }
      orderBy: [
        {attribute: Issued_date, direction:ASC}
      ]
    ) {
      id
      payment_type: Payment_type
      payment_date: Payment_date
      payment_order: Payment_order
      payment_auth: Payment_auth
      payment_method_id: Payment_method_id
      amount: Amount
      concept: Concept
      issued_date: Issued_date
      booking: BookingViaBooking_id {
        id
        status: Status
        resource: ResourceViaResource_id {
          id
          code: Code
        }
      }
    }
  }
}`;

export const UPDATE_CUSTOMER = `
  mutation(
    $id: Int!
    $id_type_id: Int
    $document: String
    $phones: String
    $address: String
    $zip: String
    $province: String
    $city: String
    $country_id: Int
    $gender_id: Int
    $language_id: Int
    $country_origin_id: Int
    $nationality_id: Int
    $birth_date: String
    $tutor_id_type_id: Int
    $tutor_name: String
    $tutor_email: String
    $tutor_phones: String
    $school_id: Int
    $payment_method_id: Int
    $iban: String
    $same_account: Boolean
    $bank_account: String
    $swift: String
    $bank_holder: String
    $bank_name: String
    $bank_address: String
    $bank_city: String
    $bank_country_id: Int
    $appLang: Auxiliar_LangEnumType) {
  update: Customer_CustomerUpdate(
    where: { id: {EQ: $id} }
    entity: {
      Id_type_id: $id_type_id
      Document: $document
      Phones: $phones
      Address: $address
      City: $city
      Zip: $zip
      Province: $province
      Birth_date: $birth_date
      Tutor_id_type_id: $tutor_id_type_id
      Tutor_name: $tutor_name
      Tutor_email: $tutor_email
      Tutor_phones: $tutor_phones
      Country_origin_id: $country_origin_id
      School_id: $school_id
      Gender_id: $gender_id
      Language_id: $language_id
      Nationality_id:$nationality_id
      Country_id: $country_id
      Payment_method_id: $payment_method_id
      IBAN: $iban
      Same_account: $same_account
      Bank_account: $bank_account
      Swift: $swift
      Bank_holder: $bank_holder
      Bank_name: $bank_name
      Bank_address: $bank_address
      Bank_city: $bank_city
      Bank_country_id: $bank_country_id
      Lang: $appLang
    }) {id}
}`;

export const UPLOAD_CUSTOMER_DOCUMENT = `mutation ($id: Int! $fileFront: Models_DocumentTypeInputType, $date: String) {
  data: Customer_Customer_docUpdate ( where: { id: {EQ: $id} }
    entity: {
      Expiry_date: $date
      Document: $fileFront
    }
  ) { 
    id 
    Document { oid name type size }
    Document_back { oid name type size }
  }
}`;

export const UPLOAD_CUSTOMER_FULL_DOCUMENTS = `mutation ($id: Int!, $fileFront: Models_DocumentTypeInputType, $fileBack: Models_DocumentTypeInputType, $date: String) {
  data: Customer_Customer_docUpdate ( where: { id: {EQ: $id} }
    entity: {
      Expiry_date: $date
      Document: $fileFront
      Document_back: $fileBack
    }
  ) { 
    id 
    Document { oid name type size }
    Document_back { oid name type size }
  }
}`;

export const UPLOAD_CUSTOMER_PHOTO = `mutation ($id: Int! $file: Models_DocumentTypeInputType) {
  data: Customer_CustomerUpdate ( where: { id: {EQ: $id} }
    entity: {
      Photo: $file
    }
  ) {
    id
    photo: Photo {
      name
      oid
      thumbnail
      type
    }
  }
}`;