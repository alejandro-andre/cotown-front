import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IBookingResource, IInvoice } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-my-invoices',
  templateUrl: './myInvoices.component.html',
  styleUrls: ['./myInvoices.component.scss']
})

export class MyInvoicesComponent {

  constructor(
    public customerService: CustomerService,
    private datePipe: DatePipe,
    private axiosApi: AxiosApi,
    private router: Router,
  ) {}

  public displayedInvoiceColumns: string[] = [
    'view',
    'issued_date',
    'concept',
    'amount',
    'resource',
    'code',
  ];

  getResource(resource: IBookingResource): string {
    return resource?.resource?.code || '';
  }

  formatOnlyDate(date: string): string {
    if (date !== '' && date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate || '';
    }
    return '';
  }

  formatPropertyDate(date: string): string {
    if (date !== '' && date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale + ' HH:MM:SS');
      return formattedDate || '';
    }
    return '';
  }

  get invoices(): IInvoice[] {
    return this.customerService.customer?.invoices || [];
  }

  viewInvoice(id: number) {
    this.axiosApi.getInvoice(id).then((res) => {
      const fileURL = URL.createObjectURL(res.data);
      window.open(fileURL, '_blank');
    });
  }

}
