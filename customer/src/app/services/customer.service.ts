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

   private setVisibility(): void {
    if (this.customer.name === '' || this.customer.name === null) {
      this.readOnly.name = false;
    }

    if (this.customer.province === '' || this.customer.province === null) {
      this.readOnly.province = false;
    }

    if (this.customer.city === '' || this.customer.city === null) {
      this.readOnly.city = false;
    }

    if (this.customer.country === null) {
      this.readOnly.city = false;
    }

    if (this.customer.address === '' || this.customer.address === null) {
      this.readOnly.address = false;
    }

    if (this.customer.postalCode === '' || this.customer.postalCode === null) {
      this.readOnly.postalCode = false;
    }

    if (this.customer.document === '' || this.customer.document === null) {
      this.readOnly.document = false;
    }

    if (this.customer.email === '' || this.customer.email === null) {
      this.readOnly.email = false;
    }

    if (this.customer.phone === '' || this.customer.phone === null) {
      this.readOnly.phone = false;
    }

    if (this.customer.genderId === null) {
      this.readOnly.genderId = false;
    }

    if (this.customer.languageId === null) {
      this.readOnly.languageId = false;
    }

    if (this.customer.originId === null) {
      this.readOnly.originId = false;
    }

    if (this.customer.nationality === null) {
      this.readOnly.nationality = false;
    }

    if (this.customer.birthDate === null) {
      this.readOnly.birthDate = false;
    }

    if (this.customer.typeDoc === null) {
      this.readOnly.typeDoc = false;
    }

    if (this.customer.schoolOrCompany === null) {
      this.readOnly.schoolOrCompany = false;
    }

    if (this.customer.bankAcount === '' || this.customer.bankAcount === null) {
      this.readOnly.bankAcount = false;
    }
  }
}
