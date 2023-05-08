import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer.model';
import { Contact } from '../constants/Interface';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  public customer = new Customer();

  constructor() {}

  setCustomerData(customer: Customer): void {
    this.customer = customer;
  }

  setContacts(contacts: Contact[]): void{
    this.customer.contacts = contacts;
  }
}