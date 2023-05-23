import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { Booking, TableObject } from 'src/app/constants/Interface';
import { GET_BOOKING_BY_ID } from 'src/app/schemas/query-definitions/booking.query';
import { ACCEPT_BOOKING_OPTION, SIGN_BOOKING_CONTRACT } from 'src/app/schemas/query-definitions/customer.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent implements OnInit {
  constructor(
    public customerService: CustomerService,
    private activeRoute: ActivatedRoute,
    private axiosApi: AxiosApi,
    private apolo: ApoloQueryApi
  ) {
    this.activeRoute.params.subscribe((res) => {
      const id = res['id'];
      this.bookingId = parseInt(id);
      const finded = this.customerService.customer.bookings.find((booking: Booking) => booking.id === this.bookingId);
      if (finded) {
        this.booking = finded;
      } else {
        this.showNotFound = true;
      }
    });
  }

  public isViewLoading = false;
  public booking!: Booking;
  public showNotFound: boolean = false;
  public contract_services = '';
  public contract_rent = '';
  public bookingId!: number;
  public contractMessage: string = '';
  public formatedDate: string = '';
  private contract_rent_info = {
    total_pages: -1,
    current_page: -1,
    loaded: false,
    signed: false,
    rendered: false,
  };

  private contract_service_info = {
    total_pages: -1,
    current_page: -1,
    loaded: false,
    signed: false,
    rendered: false
  };

  public RENT_CONTRACT_TYPE = 'RENT_CONTRACT';
  public SERVICE_CONTRACT_TYPE = 'SERVICE_CONTRACT';
  public ACCEPT_PROPERTY = 'Accept'

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

  public tableForOptions: TableObject[] = [
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
    {
      header: 'Accept',
      property: 'accepted',
      name: 'Accept'
    },
  ];

  get displayedColumnsOptions(): string[] {
    return this.tableForOptions.map((elem) => elem.header);
  }


  get displayedColumns(): string[] {
    return this.tableFormat.map((elem) => elem.header);
  }

  async ngOnInit(): Promise<void> {
    if(this.booking) {
      if (this.booking.contract_signed !== null) {
        this.contractMessage = 'signedMessage';
        const date = this.booking.contract_signed.split('T');
        this.formatedDate = `${date[0]} ${date[1]}`
      } else {
        this.contractMessage = 'signMessage';
      }
      await this.getPdfsContracts();
    }
  }

  get options(): any {
    const options =  [];
    for(const option of  this.booking.options || []) {
      if(!option.accepted) {
        const newop = {
          'id': option.id,
          'accepted': option.accepted,
          [Constants.PROPERTY_FLAT]: `${option.resource_flat.code || ''}, ${option.resource_flat.name || ''} `,
          [Constants.PROPERTY_PLACE]: `${option.resource_place.code || ''}, ${option.resource_place.name || ''}`,
          [Constants.PROPERTY_RESOURCE_TYPE]: option.resource
        }

        options.push(newop)
      }
    }

    return options;
  }

  accept(id: number): void {
    this.isViewLoading = true;
    const variables = {
      id,
      accepted: true
    }
    this.apolo.setData(ACCEPT_BOOKING_OPTION, variables).subscribe((resp) => {
      const value = resp.data;
      console.log('value: ', resp)

      if (value && value.updated && value.updated.length) {
        const variablesForId = {
          id: this.booking.id,
        };

        this.apolo.getData(GET_BOOKING_BY_ID, variablesForId).subscribe((response) => {
          this.booking = JSON.parse(JSON.stringify(response.data.booking[0]));
          this.isViewLoading = false;
        })
      }
    })
  }

  get isOptionToBeShowed() : boolean {
    for(const option of this.options) {
      if (!option.accepted) {
        return true;
      }
    }

    return false;
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
      const type = Constants.CONTRACT_SERVICES_PDF;
      const contract_services = await this.axiosApi.getContract(this.booking.id, type);
      if (contract_services && contract_services.data) {
        this.contract_services = URL.createObjectURL(contract_services.data);
        this.contract_service_info.rendered = true;
      }
    }

    if (this.booking.contract_rent) {
      const type = Constants.CONTRACT_RENT_PDF;
      const contract_rent = await this.axiosApi.getContract(this.booking.id, type);
      if (contract_rent && contract_rent.data) {
        this.contract_rent = URL.createObjectURL(contract_rent.data);
        this.contract_rent_info.rendered = true;
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

  get allContractsRendered(): boolean {
    if (
      this.booking.contract_rent &&
      this.booking.contract_rent.oid &&
      this.booking.contract_services &&
      this.booking.contract_services.oid
    ) {
      return this.contract_rent_info.rendered && this.contract_service_info.rendered
    }

    if (this.booking.contract_rent && this.booking.contract_rent.oid) {
      return this.contract_rent_info.rendered;
    }

    if (this.booking.contract_services && this.booking.contract_services.oid) {
      return this.contract_service_info.rendered;
    }

    return false
  }

  formatDate(date: Date): string {
    if(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const min = date.getMinutes();
      const hours = date.getHours();
      const sec = date.getSeconds();

      return `${year}-${month}-${day}T${hours}:${min}:${sec}`;
    }

    return '';
  }

  get contractSigned (): String | null {
    return this.booking.contract_signed;
  }

  sign(type: String):void {
    if (type === this.SERVICE_CONTRACT_TYPE) {
      this.contract_service_info.signed = true;
    } else{
      this.contract_rent_info.signed = true;
    }

    if(this.contract_rent_info.signed && this.contract_service_info.signed) {
      const date = this.formatDate(new Date());
      const variables = {
        id: this.booking.id,
        time: date
      }

      this.apolo.setData(SIGN_BOOKING_CONTRACT,variables).subscribe((res) => {
        const value = res.data.data[0].Contract_signed;
        const finded = this.customerService.customer.bookings.find((booking: Booking) => booking.id === this.bookingId );
        if(finded) {
          const copy = JSON.parse(JSON.stringify(finded));
          copy.contract_signed = value;
          this.customerService.updateBooking(copy);
          this.booking = copy;
          this.contractMessage ='signedMessage';
          const date = value.split('T');
          this.formatedDate = `${date[0]} ${date[1]}`
        }
      });
    }
  }
}
