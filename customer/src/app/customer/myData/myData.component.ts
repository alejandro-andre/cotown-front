import { Component, OnInit } from '@angular/core';

import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent{

  constructor(
    public customerService: CustomerService
  ) {}
}
