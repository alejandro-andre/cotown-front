export const SET_NEW_CONTACT = `mutation($id: Int!, $cid: Int!, $name: String!, $email:String, $phone: String){
  Customer_Customer_contactCreate(
    entity:{
      Customer_id:$id
      Customer_contact_type_id:$cid
      Name:$name
      Email:$email
      Phones: $phone}){id}
}`;

export const GET_CONTACTS_BY_CUSTOMERID =` query customerContacts($customerId: Int){
  contacts: Customer_Customer_contactList(where: { Customer_id: { EQ: $customerId} }){
    name: Name
    id
    phone: Phones
    email: Email
  }
}
`;