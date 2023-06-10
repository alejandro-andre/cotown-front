import { Injectable } from '@angular/core';
import { IBooking, IContact } from '../constants/Interface';
import { Customer } from '../models/Customer.model';
import { getAge } from '../utils/date.util';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  private readOnly: { [key: string]: boolean } = {}

  public customer: Customer = new Customer();
  
  constructor() {}

  setCustomerData(customer: Customer): void {
    this.customer = customer;
    this.setvisibility();
  }

  get visibility(): { [key: string]: boolean } {
    return this.readOnly;
  }

  get age(): number {
    return getAge(this.customer.birth_date);
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

  setvisibility(): void {
    this.readOnly = {}
    this.readOnly['name'] = (this.customer.name === '' || this.customer.name === null);
    this.readOnly['id_type_id'] = (this.customer.id_type_id === null);
    this.readOnly['document'] = (this.customer.document === '' || this.customer.document === null);
    this.readOnly['email'] = (this.customer.email === '' || this.customer.email === null);
    this.readOnly['phones'] = (this.customer.phones === '' || this.customer.phones === null);
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
    this.readOnly['school_id'] = (this.customer.school_id === null);
    this.readOnly['bank_account'] = (this.customer.bank_account === '' || this.customer.bank_account === null);
  }

}
