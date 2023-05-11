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
  public RESOURCE_PROPERTY = Constants.BOOKING_RESOURCE;
  public FLAT_TYPE_PROPERTY = Constants.BOOKING_FLAT;
  public PLACE_TYPE_PROPERTY = Constants.BOOKING_PLACE;

  constructor(
    public customerService: CustomerService,
    private router: Router,
  ) {}

  public tableFormat: TableObject[] = [
    {
      header: Constants.BOOKING_RESOURCE,
      property: Constants.PROPERTY_RESOURCE,
      name: Constants.RESOURCE
    },
    {
      header: Constants.BOOKING_FROM,
      property: Constants.PROPERTY_START,
      name: Constants.DATE_FROM
    },
    {
      header: Constants.BOOKING_TO,
      property: Constants.PROPERTY_END,
      name:  Constants.DATE_TO
    },
    {
      header: Constants.BOOKING_STATUS,
      property: Constants.PROPERTY_STATUS,
      name: Constants.STATUS
    },
    {
      header: Constants.BOOKING_FLAT,
      property: Constants.PROPERTY_FLAT,
      name: Constants.FLAT_TYPE
    },
    {
      header: Constants.BOOKING_PLACE,
      property: Constants.PROPERTY_PLACE,
      name: Constants.PLACE_TYPE
    },
    {
      header: Constants.BOOKING_RESOURCE_TYPE,
      property: Constants.PROPERTY_RESOURCE_TYPE,
      name: Constants.RESOURCE_TYPE
    },
  ];

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
