import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  public customer = new Customer();

  constructor() {}

  setCustomerData(customer: Customer) {
    this.customer = customer;
  }
}