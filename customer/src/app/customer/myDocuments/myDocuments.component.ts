import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-documents',
  templateUrl: './myDocuments.component.html',
  styleUrls: ['./myDocuments.component.scss']
})

export class MyDocumentsComponent {

  constructor(
    public customerService: CustomerService,
    private router: Router,
  ) {}

  public image: File | null = null;

  upload($event: any) {
    console.log('The event is: ', $event, ' and este es el image: ', this.image);
  }

  get documents():Array<any> {
    console.log(this.customerService.customer.documents);
    return this.customerService.customer.documents;
  }
}
