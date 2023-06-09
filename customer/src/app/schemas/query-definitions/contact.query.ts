export const GET_CONTACTS_BY_CUSTOMERID =`query get($customerId: Int) {
  data: Customer_Customer_contactList(
    where: { Customer_id: { EQ: $customerId } }
  ) {
    id
    name: Name
    phones: Phones
    email: Email
    contact_type: Customer_contact_typeViaCustomer_contact_type_id {
      id
      name: Name
    }
  }
}`;

export const INSERT_CONTACT = `mutation($id: Int!, $contact_type: Int!, $name: String!, $email:String, $phone: String) {
  data: Customer_Customer_contactCreate(
    entity: {
      Customer_id: $id
      Customer_contact_type_id: $contact_type
      Name: $name
      Email: $email
      Phones: $phone
    }
  ) { id }
}`;

export const DELETE_CONTACT = `mutation($id: Int!, $customer_id: Int!) {
  data: Customer_Customer_contactDelete(
    where: { Customer_id: { EQ: $customer_id }, id: { EQ: $id } }
  ) { id }
}`;