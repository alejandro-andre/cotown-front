import { Component, OnInit } from '@angular/core';
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
  constructor(
    public customerService: CustomerService,
    private router: Router,
  ) {}

  public tableFormat: TableObject[] = [
    {
      header: Constants.BOOKING_RESOURCE,
      property: 'resource',
      name: 'resource'
    },
    {
      header: Constants.BOOKING_FROM,
      property: 'start',
      name: 'dateFrom'
    },
    {
      header: Constants.BOOKING_TO,
      property: 'end',
      name: 'dateTo'
    },
    {
      header: Constants.BOOKING_STATUS,
      property: 'status',
      name: 'status'
    },
    {
      header: Constants.BOOKING_FLAT,
      property: 'flat',
      name: 'flatType'
    },
    {
      header: Constants.BOOKING_PLACE,
      property: 'place',
      name: 'placeType'
    },
    {
      header: Constants.BOOKING_RESOURCE_TYPE,
      property: 'resource_type',
      name: 'resourceType'
    },
  ];

  public RESOURCE_PROPERTY = Constants.BOOKING_RESOURCE;
  public FLAT_TYPE_PROPERTY = Constants.BOOKING_FLAT;
  public PLACE_TYPE_PROPERTY = Constants.BOOKING_PLACE;
  get displayedColumns() :string[] {
    return this.tableFormat.map((elem) => elem.header);
  }

  get bookings():Array<any> {
    return this.customerService.customer.bookings;
  }

  isNormalHeader (value :string): boolean {
    return value !== this.RESOURCE_PROPERTY &&
      value !== this.FLAT_TYPE_PROPERTY &&
      value !== this.PLACE_TYPE_PROPERTY;
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

  clickedRow(row: any) {
    const id = row.id;
    this.router.navigate(['customer/booking-detail', id])
  }
}
