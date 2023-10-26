import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IBookingResource, ICode, IPayment } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Constants } from 'src/app/constants/Constants';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-my-payments',
  templateUrl: './myPayments.component.html',
  styleUrls: ['./myPayments.component.scss']
})

export class MyPaymentsComponent {

  constructor(
    public customerService: CustomerService,
    private lookupService: LookupService,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  public displayedPaymentColumns: string[] = [
    'pay',
    'issued_date',
    'method',
    'concept',
    'amount',
    'resource',
    'payment_date',
    'payment_auth',
    'payment_order',
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

  showPayButton(elem: any): boolean {
    if (elem.payment_date !== null || elem.payment_date === '') 
      return false;
    if (elem.payment_method_id !== 1)
      return false;
    return true;
  }

  get payments(): IPayment[] {
    let payments = this.customerService.customer?.payments || [];
    payments = payments.filter(e => !['solicitud', 'solicitudpagada', 'alternativas', 'alternativaspagada'].includes(e.booking.status));
    return payments;
  }

  getPaymentMethod(payment: IPayment):string {
    const method = this.lookupService.paymentMethods.find((elem) => elem.id === payment.payment_method_id);
    if (this.customerService.customer.appLang === Constants.SPANISH.id)
      return method?.name || '';
    return method?.name_en || '';
  }

  getPaymentResource(resource: ICode):string {
    return resource?.code || '';
  }

  pay(id: number) {
    this.router.navigate(['/payments/payment/', id])
  }

}
