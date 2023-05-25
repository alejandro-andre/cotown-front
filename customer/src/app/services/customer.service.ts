import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer.model';
import { Booking, Contact } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private readOnly = {
    name: true,
    province: true,
    city: true,
    country: true,
    address: true,
    postalCode: true,
    document: true,
    email: true,
    phone: true,
    genderId: true,
    languageId: true,
    originId: true,
    nationality: true,
    birthDate: true,
    typeDoc: true,
    schoolOrCompany: true,
    bankAcount: true,
  };

  public customer = new Customer();
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
    const index = this.customer.bookings.findIndex((el) => el.id === booking.id);
    this.customer.bookings[index] = booking;
  }

  removeContactById(id: number): void {
    const copy = [...this.customer.contacts];
    this.customer.contacts = copy.filter((ev: Contact) => ev.id !== id);
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

    if (this.customer.country === null) {
      this.readOnly.country = false;
    } else {
      this.readOnly.country = true;
    }

    if (this.customer.address === '' || this.customer.address === null) {
      this.readOnly.address = false;
    } else {
      this.readOnly.address = true;
    }

    if (this.customer.postalCode === '' || this.customer.postalCode === null) {
      this.readOnly.postalCode = false;
    } else {
      this.readOnly.postalCode = true;
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

    if (this.customer.phone === '' || this.customer.phone === null) {
      this.readOnly.phone = false;
    } else {
      this.readOnly.phone = true;
    }

    if (this.customer.genderId === null) {
      this.readOnly.genderId = false;
    } else {
      this.readOnly.genderId = true;
    }

    if (this.customer.languageId === null) {
      this.readOnly.languageId = false;
    } else {
      this.readOnly.languageId = true;
    }

    if (this.customer.originId === null) {
      this.readOnly.originId = false;
    } else {
      this.readOnly.originId = true;
    }

    if (this.customer.nationality === null) {
      this.readOnly.nationality = false;
    } else {
      this.readOnly.nationality = true;
    }

    if (this.customer.birthDate === null) {
      this.readOnly.birthDate = false;
    } else {
      this.readOnly.birthDate = true;
    }

    if (this.customer.typeDoc === null) {
      this.readOnly.typeDoc = false;
    } else {
      this.readOnly.typeDoc = true;
    }

    if (this.customer.schoolOrCompany === null) {
      this.readOnly.schoolOrCompany = false;
    } else {
      this.readOnly.schoolOrCompany = true;
    }

    if (this.customer.bankAcount === '' || this.customer.bankAcount === null) {
      this.readOnly.bankAcount = false;
    } else {
      this.readOnly.bankAcount = true;
    }
  }
}
