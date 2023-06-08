import { Injectable } from '@angular/core';
import { Booking, Contact, ICustomer } from '../constants/Interface';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  private readOnly = {
    name: true,
    province: true,
    city: true,
    country_id: true,
    address: true,
    zip: true,
    document: true,
    email: true,
    phones: true,
    gender_id: true,
    language_id: true,
    country_origin_id: true,
    nationality_id: true,
    birth_date: true,
    id_type_id: true,
    school_id: true,
    bank_account: true,
  };

  public customer: Customer = new Customer();
  
  constructor() {}

  setCustomerData(customer: Customer): void {
    this.customer = customer;
    this.setVisibility();
  }

  get visibility(): { [key: string]: boolean }{
    return this.readOnly;
  }

  setContacts(contacts: Contact[]): void{
    this.customer.contacts = contacts;
  }

  updateBooking(booking: Booking){
    if (this.customer.bookings) {
      const index = this.customer.bookings?.findIndex((el) => el.id === booking.id);
      this.customer.bookings[index] = booking;
    }
  }

  removeContactById(id: number): void {
    if (this.customer.contacts) {
      const copy = [...this.customer.contacts];
      this.customer.contacts = copy.filter((ev: Contact) => ev.id !== id);
    }
  }

  setVisibility(): void {
    if (this.customer.name === '' || this.customer.name === null) {
      this.readOnly.name = false;
    } else {
      this.readOnly.name = true;
    }

    if (this.customer.province === '' || this.customer.province === null) {
      this.readOnly.province = false;
    } else {
      this.readOnly.province = true;
    }

    if (this.customer.city === '' || this.customer.city === null) {
      this.readOnly.city = false;
    } else {
      this.readOnly.city = true;
    }

    if (this.customer.country_id === null) {
      this.readOnly.country_id = false;
    } else {
      this.readOnly.country_id = true;
    }

    if (this.customer.address === '' || this.customer.address === null) {
      this.readOnly.address = false;
    } else {
      this.readOnly.address = true;
    }

    if (this.customer.zip === '' || this.customer.zip === null) {
      this.readOnly.zip = false;
    } else {
      this.readOnly.zip = true;
    }

    if (this.customer.document === '' || this.customer.document === null) {
      this.readOnly.document = false;
    } else {
      this.readOnly.document = true;
    }

    if (this.customer.email === '' || this.customer.email === null) {
      this.readOnly.email = false;
    } else {
      this.readOnly.email = true;
    }

    if (this.customer.phones === '' || this.customer.phones === null) {
      this.readOnly.phones = false;
    } else {
      this.readOnly.phones = true;
    }

    if (this.customer.gender_id === null) {
      this.readOnly.gender_id = false;
    } else {
      this.readOnly.gender_id = true;
    }

    if (this.customer.language_id === null) {
      this.readOnly.language_id = false;
    } else {
      this.readOnly.language_id = true;
    }

    if (this.customer.country_origin_id === null) {
      this.readOnly.country_origin_id = false;
    } else {
      this.readOnly.country_origin_id = true;
    }

    if (this.customer.nationality_id === null) {
      this.readOnly.nationality_id = false;
    } else {
      this.readOnly.nationality_id = true;
    }

    if (this.customer.birth_date === null) {
      this.readOnly.birth_date = false;
    } else {
      this.readOnly.birth_date = true;
    }

    if (this.customer.id_type_id === null) {
      this.readOnly.id_type_id = false;
    } else {
      this.readOnly.id_type_id = true;
    }

    if (this.customer.school_id === null) {
      this.readOnly.school_id = false;
    } else {
      this.readOnly.school_id = true;
    }

    if (this.customer.bank_account === '' || this.customer.bank_account === null) {
      this.readOnly.bank_account = false;
    } else {
      this.readOnly.bank_account = true;
    }
  }
}
