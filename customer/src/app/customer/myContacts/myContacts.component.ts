import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './myContacts.component.html',
  styleUrls: ['./myContacts.component.scss']
})

export class MyContactsComponent {

  constructor(
    public customerService: CustomerService,
    private router: Router,

  ) {}

  get contacts(): Array<any> {
    return this.customerService.customer.contacts || [];
  }

  goToAdd() {
    this.router.navigate(['customer/cantacts/add']);
  }
}
