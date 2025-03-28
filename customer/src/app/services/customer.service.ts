import { Injectable } from '@angular/core';
import { IBooking, IContact } from '../constants/Interface';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  private readOnly: { [key: string]: boolean } = {}

  public customer: Customer = new Customer();
  
  constructor() {}

  get visibility(): { [key: string]: boolean } {
    return this.readOnly;
  }

  get enoughData(): boolean {
    if (!this.customer.id_type_id ||
        !this.customer.document ||
        !this.customer.address ||
        !this.customer.zip ||
        !this.customer.city ||
        !this.customer.country_id) {
      return false;
    }
    return true;
  }

  setCustomerData(customer: Customer): void {
    this.customer = customer;
    this.setCustomerVisibility();
  }

  setContacts(contacts: IContact[]): void{
    this.customer.contacts = contacts;
  }

  updateBooking(booking: IBooking){
    if (this.customer.bookings) {
      const index = this.customer.bookings?.findIndex((el) => el.id === booking.id);
      this.customer.bookings[index] = booking;
    }
  }

  removeContactById(id: number): void {
    if (this.customer.contacts) {
      const copy = [...this.customer.contacts];
      this.customer.contacts = copy.filter((ev: IContact) => ev.id !== id);
    }
  }

  setCustomerVisibility(): void {
    this.readOnly = {}
    this.readOnly['name'] = (this.customer.name === '' || this.customer.name === null);
    this.readOnly['id_type_id'] = (this.customer.id_type_id === null);
    this.readOnly['document'] = (this.customer.document === '' || this.customer.document === null);
    this.readOnly['email'] = (this.customer.email === '' || this.customer.email === null);
    this.readOnly['phones'] = true;
    this.readOnly['address'] = (this.customer.address === '' || this.customer.address === null);
    this.readOnly['zip'] = (this.customer.zip === '' || this.customer.zip === null);
    this.readOnly['province'] = (this.customer.province === '' || this.customer.province === null);
    this.readOnly['city'] = (this.customer.city === '' || this.customer.city === null);
    this.readOnly['country_id'] = (this.customer.country_id === null);
    this.readOnly['gender_id'] = (this.customer.gender_id === null);
    this.readOnly['language_id'] = (this.customer.language_id === null);
    this.readOnly['country_origin_id'] = (this.customer.country_origin_id === null);
    this.readOnly['nationality_id'] = (this.customer.nationality_id === null);
    this.readOnly['birth_date'] = (this.customer.birth_date === '' || this.customer.birth_date === null);
    this.readOnly['tutor_id_type_id'] = (this.customer.tutor_id_type_id === null);
    this.readOnly['tutor_document'] = (this.customer.tutor_document === '' || this.customer.tutor_document === null);
    this.readOnly['tutor_name'] = (this.customer.tutor_name === '' || this.customer.tutor_name === null );
    this.readOnly['tutor_email'] = (this.customer.tutor_email === '' || this.customer.tutor_email === null);
    this.readOnly['tutor_phones'] = (this.customer.tutor_phones === '' || this.customer.tutor_phones === null);
    this.readOnly['payment_method_id'] = (this.customer.payment_method_id === null);
    this.readOnly['iban'] = (this.customer.iban === '' || this.customer.iban === null);
    this.readOnly['same_account'] = (this.customer.same_account === '' || this.customer.same_account === null);
    this.readOnly['bank_account'] = (this.customer.bank_account === '' || this.customer.bank_account === null);
    this.readOnly['swift'] = (this.customer.swift === '' || this.customer.swift === null);
    this.readOnly['bank_holder'] = (this.customer.bank_holder === '' || this.customer.bank_holder === null);
    this.readOnly['bank_name'] = (this.customer.bank_name === '' || this.customer.bank_name === null);
    this.readOnly['bank_address'] = (this.customer.bank_address === '' || this.customer.bank_address === null);
    this.readOnly['bank_city'] = (this.customer.bank_city === '' || this.customer.bank_city === null);
    this.readOnly['bank_country_id'] = (this.customer.bank_country_id === null);
  }

  setBookingVisibility(booking: IBooking): void {
    // Checkin
    this.readOnly['check_in'] = (booking.check_in === null);
    this.readOnly['flight'] = (booking.flight === null);
    this.readOnly['arrival'] = (booking.arrival === null);
    this.readOnly['check_in_time'] = (booking.check_in_time === null);
    this.readOnly['check_in_option_id'] = (booking.check_in_option_id === null);

    // Checkout
    const date_to = new Date(booking.date_to);
    const date_now = new Date();
    date_to.setDate(date_now.getDate() - 10);
    console.log(date_to);
    console.log(date_now);
    console.log(date_now > date_to);
    this.readOnly['check_out'] = (booking.check_out === null && date_now > date_to);
    this.readOnly['flight_out'] = (booking.flight_out === null && date_now > date_to);
    this.readOnly['check_out_time'] = (booking.check_out_time === null && date_now > date_to);
    this.readOnly['check_out_option_id'] = (booking.check_out_option_id === null && date_now > date_to);
  }

}
