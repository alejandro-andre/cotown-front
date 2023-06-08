import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { BasicResponse, BookingResource, Invoice, Payment, TableObject } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { formatDate, formatDateWithTime } from 'src/app/utils/date.util';

@Component({
  selector: 'app-my-invoice',
  templateUrl: './myInvoices.component.html',
  styleUrls: ['./myInvoices.component.scss']
})

export class MyInvoicesComponent {

  public INVOICE_DATE = Constants.INVOICE_DATE;
  public INVOICE_PROPERTY = Constants.INVOICE_RESOURCE;
  public PAY_PROPERTY = Constants.PAYMENT_PAY;
  public PAYMENT_DATE = Constants.PAYMENT_DATE

  constructor(
    public customerService: CustomerService,
    private axiosApi: AxiosApi,
    private router: Router,
  ) {}

  public displayedInvoiceColumns: string[] = [
    'view',
    'issue_date',
    'concept',
    'amount',
    'resource',
    'code',
  ];

  public displayedPaymentColumns: string[] = [
    'pay',
    'issue_date',
    'concept',
    'amount',
    'resource',
    'payment_date',
    'payment_auth',
    'payment_order',
  ];

  getResource(resource: BookingResource): string {
    return resource?.resource?.code || '';
  }

  formatOnlyDate(date: string): string {
    if (date !== '' && date !== null) {
      return formatDate(new Date(date))
    }
    return '';
  }

  formatPropertyDate(date: string): string {
    if (date !== '' && date !== null) {
      return formatDateWithTime(new Date(date))
    }
    return '';
  }

  showPayButton(elem: any): boolean {
    return !(elem.payment_date !== null && elem.payment_date !== '') ;
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

  viewInvoice(id: number) {
    this.axiosApi.getInvoice(id).then((resp) => {
      const fileURL = URL.createObjectURL(resp.data);
      window.open(fileURL, '_blank');
    });
  }

  pay(id: number) {
    this.router.navigate(['/invoices/payment/', id])
  }

}
