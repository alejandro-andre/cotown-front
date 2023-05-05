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

  constructor(
    public customerService: CustomerService,
  ) {
    console.log('This , ', this.customerService.customer.payments)
   }
  public INVOICE_PROPERTY = Constants.INVOICE_RESOURCE;
  public PAY_PROPERTY = Constants.PAYMENT_PAY;

  public invoceTableFormat: TableObject[] = [
    {
      header: Constants.INVOICE_CODE,
      property: 'code',
      name: 'Nº Factura'
    },
    {
      header: Constants.INVOICE_DATE,
      property: 'issue_date',
      name: 'Fecha de emisión'
    },
    {
      header: Constants.INVOICE_CONCEPT,
      property: 'concept',
      name: 'Concepto'
    },
    {
      header: Constants.INVOICE_TOTAL,
      property: 'total',
      name: 'Total'
    },
    {
      header: Constants.INVOICE_RESOURCE,
      property: 'booking',
      name: 'Reserva'
    },
  ];

  public payTableFormat: TableObject[] = [
    {
      header: Constants.PAYMENT_PAY,
      property: 'pay',
      name: 'Pay'
    },
    {
      header: Constants.PAYMENT_CODE,
      property: 'id',
      name: 'Nº de pago'
    },
    {
      header: Constants.PAYMENT_DATE,
      property: 'issue_date',
      name: 'Fecha de emisión'
    },
    {
      header: Constants.PAYMENT_CONCEPT,
      property: 'concept',
      name: 'Concepto'
    },
    {
      header: Constants.PAYMENT_AMOUNT,
      property: 'amount',
      name: 'Total'
    },
    {
      header: Constants.PAYMENT_RESOURCE,
      property: 'booking',
      name: 'Reserva'
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
