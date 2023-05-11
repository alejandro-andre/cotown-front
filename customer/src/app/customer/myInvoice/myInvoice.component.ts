import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { BasicResponse, BookingResource, Invoice, Payment, TableObject } from 'src/app/constants/Interface';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-my-invoice',
  templateUrl: './myInvoice.component.html',
  styleUrls: ['./myInvoice.component.scss']
})

export class MyInvoiceComponent {
  constructor(public customerService: CustomerService) {}

  public INVOICE_PROPERTY = Constants.INVOICE_RESOURCE;
  public PAY_PROPERTY = Constants.PAYMENT_PAY;

  public invoceTableFormat: TableObject[] = [
    {
      header: Constants.INVOICE_CODE,
      property: Constants.PROPERTY_CODE,
      name: 'invoiceNumber'
    },
    {
      header: Constants.INVOICE_DATE,
      property: Constants.PROPERTY_ISSUE_DATE,
      name: 'issueDate'
    },
    {
      header: Constants.INVOICE_CONCEPT,
      property: Constants.PROPERTY_CONCEPT,
      name: 'concept'
    },
    {
      header: Constants.INVOICE_TOTAL,
      property: Constants.PROPERTY_TOTAL,
      name: 'total'
    },
    {
      header: Constants.INVOICE_RESOURCE,
      property:  Constants.PROPERTY_BOOKING,
      name: 'booking'
    },
  ];

  public payTableFormat: TableObject[] = [
    {
      header: Constants.PAYMENT_PAY,
      property: Constants.PROPERTY_PAY,
      name: 'pay'
    },
    {
      header: Constants.PAYMENT_CODE,
      property: Constants.PROPERTY_ID,
      name: 'paymentNumber'
    },
    {
      header: Constants.PAYMENT_DATE,
      property: Constants.PROPERTY_ISSUE_DATE,
      name: 'issueDate'
    },
    {
      header: Constants.PAYMENT_CONCEPT,
      property: Constants.PROPERTY_CONCEPT,
      name: 'concept'
    },
    {
      header: Constants.PAYMENT_AMOUNT,
      property: Constants.PROPERTY_AMOUNT,
      name: 'total'
    },
    {
      header: Constants.PAYMENT_RESOURCE,
      property: Constants.PROPERTY_BOOKING,
      name: 'booking'
    },
  ];

  pay(url: string) {
    console.log('The url: ', url);
  }

  getResource(resource: BookingResource): string {
    return resource?.resource?.code || '';
  }

  get displayedInvoiceColumns(): string[] {
    return this.invoceTableFormat.map((elem) => elem.header);
  }

  get displayedPaymentColumns (): string[] {
    return this.payTableFormat.map((elem) => elem.header);
  }

  get invoices(): Invoice[] {
    return this.customerService.customer?.invoices || [];
  }

  get payments(): Payment[] {
    return this.customerService.customer?.payments || [];
  }

  getPaymentResource(resource: BasicResponse):string {
    return resource?.code || '';
  }
}
