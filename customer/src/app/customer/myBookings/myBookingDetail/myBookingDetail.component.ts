import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { Booking } from 'src/app/constants/Interface';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent implements OnInit {
  public booking!: Booking;
  public showNotFound: boolean = false;

  public tableFormat = [
    {
      header: Constants.BOOKING_DATE_HEADER,
      property: 'rent_date',
      name: 'Mes'
    },
    {
      header: Constants.BOOKING_RENT_HEADER,
      property: 'rent',
      name: 'Renta'
    },
    {
      header: Constants.BOOKING_SERVICE_HEADER,
      property: 'services',
      name: 'Servicios'
    },
    {
      header: Constants.BOOKING_RENT_DISCOUN_HEADER,
      property: 'rent_discount',
      name: 'Suplementos(+)/Descuentos(-) a la renta'
    },
    {
      header: Constants.BOOKING_SERVICE_DISCOUNT_HEADER,
      property: 'service_discount',
      name: 'Suplementos(+)/Descuentos(-) a los servicios'
    },
  ];

  constructor(
    public customerService: CustomerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe((res) => {
      const id = res['id'];
      const finded = this.customerService.customer.bookings.find((booking: Booking) => booking.id === parseInt(id));
      if (finded) {
        this.booking = finded;
        console.log('The price list is: ', this.booking.price_list)
      } else {
        this.showNotFound = true;
      }
    });
  }

  get buildingName(): string {
    if (this.booking && this.booking.building && this.booking.building.id) {
      const { name, code } = this.booking.building;
      return `${code},${name}`
    }

    return '';
  }

  get flatTypeName(): string {
    if (this.booking && this.booking.flat && this.booking.flat.id) {
      const { name, code } = this.booking.flat;
      return `${code}, ${name} `;
    }

    return '';
  }

  get placeTypeName(): string {
    if (this.booking && this.booking.place && this.booking.place.id) {
      const { name, code } = this.booking.place;
      return `${code}, ${name} `;
    }

    return '';
  }

  get displayedColumns() :string[] {
    return this.tableFormat.map((elem) => elem.header);
  }

  ngOnInit(): void {

  }
}
