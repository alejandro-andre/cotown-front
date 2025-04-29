export const PAYMENT_UPDATE = `mutation(
  $id: Int!
  $warning_1: String
  $warning_2: String
  $warning_3: String
) {
  data: Billing_PaymentUpdate( where: { id: { EQ: $id } }
    entity:{
      Warning_1: $warning_1
      Warning_2: $warning_2
      Warning_3: $warning_3
    }
  ) { id }
}`;

export const DEPOSIT_UPDATE = `mutation(
  $id: Int!
  $deposit_returned: Float
  $date_deposit_returned: String
) {
  data: Booking_BookingUpdate( where: { id: { EQ: $id } }
    entity:{
      Deposit_returned: $deposit_returned
      Date_deposit_returned: $date_deposit_returned
    }
  ) { id }
}`;