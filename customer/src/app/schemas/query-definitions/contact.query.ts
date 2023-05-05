export const SET_NEW_CONTACT = `mutation($id: Int!, $cid: Int!, $name: String!, $email:String, $phone: String){
  Customer_Customer_contactCreate(
    entity:{
      Customer_id:$id
      Customer_contact_type_id:$cid
      Name:$name
      Email:$email
      Phones: $phone}){id}
}`;