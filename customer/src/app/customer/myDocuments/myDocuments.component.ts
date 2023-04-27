import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './myDocuments.component.html',
  styleUrls: ['./myDocuments.component.scss']
})

export class MyDocumentsComponent {

  constructor(
    public customerService: CustomerService,
    private router: Router,

  ) {}
}
