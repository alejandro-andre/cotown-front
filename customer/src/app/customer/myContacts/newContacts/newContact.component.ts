import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicResponse } from 'src/app/constants/Interface';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-contact-new',
  templateUrl: './newContact.component.html',
  styleUrls: ['./newContact.component.scss']
})

export class NewContactComponent {
  constructor(
    public customerService: CustomerService,
    private contactTypeService: ContactTypeService,
    private router: Router,
  ) {}

  public contactType: number | null = null;
  public name: string = '';
  public surName: string = '';
  public email: string = '';
  public phone: string = '';

  get contactTypes(): BasicResponse[] {
    return this.contactTypeService.contacts;
  }

  changed() {
    console.log(' HERE AT THE CONTACT')
  }
}
