import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { Booking, TableObject } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent implements OnInit {
  public booking!: Booking;
  public showNotFound: boolean = false;
  public contract_services = '';
  public contract_rent = '';
  private contract_rent_info = {
    total_pages: -1,
    current_page: -1,
    loaded: false,
    signed: false
  };

  private contract_service_info = {
    total_pages: -1,
    current_page: -1,
    loaded: false,
    signed: false
  };

  public RENT_CONTRACT_TYPE = 'RENT_CONTRACT';
  public SERVICE_CONTRACT_TYPE = 'SERVICE_CONTRACT';

  public tableFormat: TableObject[] = [
    {
      header: Constants.BOOKING_DETAIL_DATE_HEADER,
      property: Constants.PROPERTY_RENT_DATE,
      name: Constants.MONTH
    },
    {
      header: Constants.BOOKING_DETAIL_RENT_HEADER,
      property: Constants.PROPERTY_RENT,
      name: Constants.RENT
    },
    {
      header: Constants.BOOKING_DETAIL_SERVICE_HEADER,
      property: Constants.PROPERTY_SERVICES,
      name: Constants.SERVICES
    },
    {
      header: Constants.BOOKING_DETAIL_RENT_DISCOUN_HEADER,
      property: Constants.PROPERTY_RENT_DISCOUNT,
      name: Constants.RENT_SUPPLEMENT
    },
    {
      header: Constants.BOOKING_DETAIL_SERVICE_DISCOUNT_HEADER,
      property: Constants.PROPERTY_SERVICES_DISCOUNT,
      name: Constants.SERVICE_SUPPLEMENT
    },
  ];

  get displayedColumns(): string[] {
    return this.tableFormat.map((elem) => elem.header);
  }

  constructor(
    public customerService: CustomerService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private axiosApi: AxiosApi
  ) {
    this.activeRoute.params.subscribe((res) => {
      const id = res['id'];
      const finded = this.customerService.customer.bookings.find((booking: Booking) => booking.id === parseInt(id));
      if (finded) {
        this.booking = finded;
      } else {
        this.showNotFound = true;
      }
    });
  }
  async ngOnInit(): Promise<void> {
    await this.getPdfsContracts()
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

  get resourceCode(): string {
    return this.booking?.resource?.code || '';
  }

  get reasonName(): string {
    return this.booking?.reason?.name || '';
  }

  get schoolName(): string {
    return this.booking?.school?.name || '';
  }

  async getPdfsContracts() {
    if (this.booking.contract_services) {
      const type = 'Contract_services';
      const contract_services = await this.axiosApi.getContract(this.booking.id, type);
      if (contract_services && contract_services.data) {
        this.contract_services = URL.createObjectURL(contract_services.data);
      }
    }

    if (this.booking.contract_rent) {
      const type = 'Contract_rent';
      const contract_rent = await this.axiosApi.getContract(this.booking.id, type);
      if (contract_rent && contract_rent.data) {
        this.contract_rent = URL.createObjectURL(contract_rent.data);
      }
    }

  }

  pageRenderedRent(e: any) {
    this.contract_rent_info.current_page = e.pageNumber;

    if(
      this.contract_rent_info.current_page === this.contract_rent_info.total_pages &&
      !this.contract_rent_info.loaded
    ) {
      this.contract_rent_info.loaded = true
    }
  }

  afterLoadRent(event: any) {
    this.contract_rent_info.total_pages = event._pdfInfo.numPages;
  }

  pageRenderedService(e: any) {
    this.contract_service_info.current_page = e.pageNumber;

    if(
      this.contract_service_info.current_page === this.contract_service_info.total_pages &&
      !this.contract_service_info.loaded
    ) {
      this.contract_service_info.loaded = true
    }
  }

  afterLoadService(event: any) {
    this.contract_service_info.total_pages = event._pdfInfo.numPages;
  }


  get isRentContractLoaded(): boolean {
    if (this.booking.contract_rent && this.booking.contract_rent.oid) {
      return this.contract_rent_info.loaded;
    }

    return false;
  }

  get isServiceContractLoaded(): boolean {
    if (this.booking.contract_services && this.booking.contract_services.oid) {
      return this.contract_service_info.loaded;
    }

    return false;
  }

  get allContractsLoaded(): boolean {
    if (
      this.booking.contract_rent &&
      this.booking.contract_rent.oid &&
      this.booking.contract_services &&
      this.booking.contract_services.oid
    ) {
      return this.contract_rent_info.loaded && this.contract_service_info.loaded
    }

    if (this.booking.contract_rent && this.booking.contract_rent.oid) {
      return this.contract_rent_info.loaded;
    }

    if (this.booking.contract_services &&
      this.booking.contract_services.oid) {
      return this.contract_service_info.loaded;
    }

    return false
  }

  sign(type: String):void {
    if (type === this.SERVICE_CONTRACT_TYPE) {
      this.contract_service_info.signed = true;
    } else{
      this.contract_rent_info.signed = true;
    }

    if(this.contract_rent_info.signed && this.contract_service_info.signed) {
     
    }
  }
}
