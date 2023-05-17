import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { BasicResponse, BookingResource, Invoice, PayloadFile, Payment, TableObject } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-my-invoice',
  templateUrl: './myInvoice.component.html',
  styleUrls: ['./myInvoice.component.scss']
})

export class MyInvoiceComponent {
  public INVOICE_PROPERTY = Constants.INVOICE_RESOURCE;
  public PAY_PROPERTY = Constants.PAYMENT_PAY;

  constructor(
    public customerService: CustomerService,
    private axiosApi: AxiosApi
  ) {}

  public invoceTableFormat: TableObject[] = [
    {
      header: Constants.INVOICE_CODE,
      property: Constants.PROPERTY_CODE,
      name: Constants.INVOICE_NUMBER
    },
    {
      header: Constants.INVOICE_DATE,
      property: Constants.PROPERTY_ISSUE_DATE,
      name: Constants.ISSUE_DATE
    },
    {
      header: Constants.INVOICE_CONCEPT,
      property: Constants.PROPERTY_CONCEPT,
      name: Constants.CONCEPT
    },
    {
      header: Constants.INVOICE_TOTAL,
      property: Constants.PROPERTY_TOTAL,
      name: Constants.TOTAL
    },
    {
      header: Constants.INVOICE_RESOURCE,
      property:  Constants.PROPERTY_BOOKING,
      name: Constants.BOOKING
    },
  ];

  public payTableFormat: TableObject[] = [
    {
      header: Constants.PAYMENT_PAY,
      property: Constants.PROPERTY_PAY,
      name: Constants.PAY
    },
    {
      header: Constants.PAYMENT_CODE,
      property: Constants.PROPERTY_ID,
      name: Constants.PAYMENT_NUMBER
    },
    {
      header: Constants.PAYMENT_DATE,
      property: Constants.PROPERTY_ISSUE_DATE,
      name: Constants.ISSUE_DATE
    },
    {
      header: Constants.PAYMENT_CONCEPT,
      property: Constants.PROPERTY_CONCEPT,
      name: Constants.CONCEPT
    },
    {
      header: Constants.PAYMENT_AMOUNT,
      property: Constants.PROPERTY_AMOUNT,
      name: Constants.STATUS
    },
    {
      header: Constants.PAYMENT_RESOURCE,
      property: Constants.PROPERTY_BOOKING,
      name: Constants.BOOKING
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

  clickedRow(row: any) {
    if (row.document && row.document.oid) {
      this.axiosApi.getInvoice(row.id).then((resp) => {
        const fileURL = URL.createObjectURL(resp.data);
        window.open(fileURL, '_blank');
      });
    }
  }
}
