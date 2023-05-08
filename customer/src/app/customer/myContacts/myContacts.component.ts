import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { TableObject } from 'src/app/constants/Interface';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './myContacts.component.html',
  styleUrls: ['./myContacts.component.scss']
})

export class MyContactsComponent {

  constructor(
    public customerService: CustomerService,
    private router: Router,

  ) {}

  public tableFormat: TableObject[] = [
    {
      header: Constants.CONTACT_NAME,
      property: 'name',
      name: 'name'
    },
    {
      header: Constants.CONTACT_EMAIL,
      property: 'email',
      name: 'email'
    },
    {
      header: Constants.CONTACT_PHONE,
      property: 'phone',
      name: 'phone'
    }
  ];

  get contacts(): Array<any> {
    return this.customerService.customer.contacts || [];
  }

  get displayedColumns (): string[] {
    return this.tableFormat.map((elem) => elem.header);
  }


  goToAdd() {
    this.router.navigate(['customer/cantacts/new']);
  }
}
