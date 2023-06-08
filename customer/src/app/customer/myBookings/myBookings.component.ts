import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { TableObject } from 'src/app/constants/Interface';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './myBookings.component.html',
  styleUrls: ['./myBookings.component.scss']
})

export class MyBookingsComponent {
  public RESOURCE_PROPERTY = Constants.BOOKING_RESOURCE;
  public FLAT_TYPE_PROPERTY = Constants.BOOKING_FLAT;
  public PLACE_TYPE_PROPERTY = Constants.BOOKING_PLACE;

  constructor(
    public customerService: CustomerService,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  public displayedColumns: string[] = [
    'building',
    'resource_type',
    'date_from',
    'date_to',
    'flat_type',
    'place_type',
    'status',
    'resource',
  ]
  
  get bookings():Array<any> {
    return this.customerService.customer.bookings;
  }

  getComposedName(data: any): string {
    if (data !== undefined && data.code !== undefined && data.name !== undefined) {
      return `${data.code}, ${data.name}`;
    } else {
      return data?.code || data.name || '';
    }
  }

  getResourceCode(resource: { code: string, id: number }): string {
    if(resource) {
      return resource?.code || ''
    }

    return '';
  }

  formatDate(date: string): string {
    if (date !== '' && date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate || '';
    }
    return '';
  }

  getName(item: any): string {
    console.log(item);
    return item.name;
  }

  clickedRow(row: any) {
    const id = row.id;
    this.router.navigate(['/booking-detail', id])
  }
}
