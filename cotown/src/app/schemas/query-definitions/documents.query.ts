export const DOCUMENT_APPROVE_UPDATE = `mutation(
  $id: Int!
  $approved: Boolean
) {
  data: Customer_Customer_docUpdate( where: { id: { EQ: $id } }
    entity:{
      Approved: $approved
    }
  ) { id }
}`;
