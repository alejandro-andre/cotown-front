import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-my-invoice',
  templateUrl: './myInvoice.component.html',
  styleUrls: ['./myInvoice.component.scss']
})

export class MyInvoiceComponent {

  constructor(
    public customerService: CustomerService,
  ) {}
}
