// Core
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

//Queries & constants
import { Constants } from 'src/app/constants/Constants';
import { BasicResponse, Booking, LookupInt, TableObject } from 'src/app/constants/Interface';
import {
  ACCEPT_BOOKING_OPTION,
  CHECKIN_OPTIONS,
  GET_BOOKING_BY_ID,
  SIGN_BOOKING_CONTRACT,
  UPDATE_BOOKING
} from 'src/app/schemas/query-definitions/booking.query';
import { FormControl } from '@angular/forms';
import { formatDate } from 'src/app/utils/date.util';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent implements OnInit {
  public isViewLoading = false;
  public booking!: Booking;
  public shownotFound: boolean = false;
  public contract_services = '';
  public contract_rent = '';
  public bookingId!: number;
  public contractMessage: string = '';
  public formatedDate: string = '';
  public isEditableSchool: boolean = false;
  public isEditableReason: boolean = false;
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

  public checkinOptions: BasicResponse [] = [];
  public selectedReason!: number;
  public selectedSchool!: number;
  public selectedOption: number | null = null;
  public activeSaveButton: boolean = false;
  public checkingFormControl = new FormControl<Date | null>(null);
  public checkoutFormControl = new FormControl<Date | null>(null);
  public flight:string = '';
  public arrival: string = '';

  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private activeRoute: ActivatedRoute,
    private axiosApi: AxiosApi,
    private apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {
    this.activeRoute.params.subscribe((res) => {
      this.isViewLoading = true;
      const id = res['id'];
      this.bookingId = parseInt(id);


      const finded = this.customerService.customer.bookings.find(
        (booking: Booking) => booking.id === this.bookingId
      );

      if (finded) {
        this.booking = finded;
        this.loadCheckinOptions();
        this.selectedOption = this.booking.check_in_id;
        this.flight = this.booking.flight !== null ? this.booking.flight : '';
        this.arrival = this.booking.arrival !== null ? this.booking.arrival : '';

        this.checkingFormControl = new FormControl(
          this.booking.check_in !== null ?
          new Date(this.booking.check_in) : null
        );

        this.checkoutFormControl = new FormControl(
          this.booking.check_out !== null ?
          new Date(this.booking.check_out) : null
        )

        if (this.reasonName === '') {
          this.isEditableReason = true;
        } else {
          this.selectedReason = this.booking.reason.id;
          this.isViewLoading = false;
        }

        if (this.schoolName === '') {
          this.isEditableSchool = true;
        } else {
          this.selectedSchool = this.booking.school.id;
        }
      } else {
        this.shownotFound = true;
      }
    });
  }


  save () {
    this.isViewLoading = true;
    const checkin = this.checkingFormControl.value !== null ? formatDate(this.checkingFormControl.value) : null;
    const checkout = this.checkoutFormControl.value !== null ? formatDate(this.checkoutFormControl.value): null;

    const variables: any = {
      id: this.booking.id,
      checkin :checkin,
      checkout: checkout,
      arrival:  this.arrival,
      flight : this.flight,
      selectedSchool : this.selectedSchool,
      selectedReason : this.selectedReason,
      option: this.selectedOption,
    }

    this.apollo.setData(UPDATE_BOOKING, variables).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.getBookingById();
      } else {
        this.modalService.openModal({title: 'Error',message: 'unknownError'});
      }
    }, err  => {
      this.isViewLoading = false;
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
      this.modalService.openModal(bodyToSend);
    })
  }

  activateSaveButton() {
    this.activeSaveButton = true;
  }

  loadCheckinOptions() {
    this.apollo.getData(CHECKIN_OPTIONS).subscribe({

      next: (res) => {
        const value = res.data;
        this.isViewLoading = false;
        if (value && value.options && value.options.length) {
          this.checkinOptions = [ ...value.options ];
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknownError'});
        }
      },

      error: (err) => {
        this.isViewLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }

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

    // Spinner
    this.isViewLoading = true;

    // GraphQL variables
    const variables = {
      id,
      accepted: true
    };
    this.apollo.setData(ACCEPT_BOOKING_OPTION, variables).subscribe({

      next: (res) => {

        const value = res.data;

        if (value && value.updated && value.updated.length) {

          const variablesForId = {
            id: this.booking.id,
          };
          this.apollo.getData(GET_BOOKING_BY_ID, variablesForId).subscribe({

            next: (response) => {
              if (response && response.data && response.data.booking) {
                this.booking = JSON.parse(JSON.stringify(response.data.booking[0]));
                this.isViewLoading = false;
              } else {
                this.isViewLoading = false;
                this.modalService.openModal({title: 'Error', message: 'unknownError'});
              }
            }, 

            error: err => {
              const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
              this.isViewLoading = false;
              this.modalService.openModal(bodyToSend);
            }
          })

        } else {
          this.isViewLoading = false;
          this.modalService.openModal({title: 'Error', message: 'unknownError'});
        }

      },

      error: (err) => {
        this.isViewLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  getBookingById () {
    this.apollo.getData(GET_BOOKING_BY_ID, { id: this.booking.id }).subscribe(response => {
      const data = response.data;
      if (data && data.booking && data.booking.length) {
        this.isEditableReason = false;
        this.isEditableSchool = false;
        const booking: Booking = data.booking[0];
        this.booking = booking;
        this.activeSaveButton = false;
      } else {
        const body = {
          title: 'Error',
          message: 'unknownError'
        };

        this.modalService.openModal(body);
      }

      this.isViewLoading = false;
    }, err => {
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
      this.isViewLoading = false;
      this.modalService.openModal(bodyToSend);
    });
  }

  get isOptionToBeShowed() : boolean {
    return this.booking.status.includes('alternativas');
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
    return this.booking.school?.name || '';
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

  get contractSigned (): String | null {
    return this.booking.contract_signed;
  }

  get showDiscart():boolean {
    return this.booking.status.includes('solicitud') || this.booking.status.includes('alternativas');
  }

  sign(type: String):void {
    this.isViewLoading = true;
    if (type === this.SERVICE_CONTRACT_TYPE) {
      this.contract_service_info.signed = true;
    } else{
      this.contract_rent_info.signed = true;
    }

    if(this.contract_rent_info.signed && this.contract_service_info.signed) {
      const date = formatDate(new Date());
      const variables = {
        id: this.booking.id,
        time: date
      }

       this.apollo.setData(SIGN_BOOKING_CONTRACT,variables).subscribe((res) => {
        const value = res.data.data[0].Contract_signed;
        if (value) {
          const finded = this.customerService.customer.bookings.find((booking: Booking) => booking.id === this.bookingId );
          if(finded) {
            const copy = JSON.parse(JSON.stringify(finded));
            copy.contract_signed = value;
            this.customerService.updateBooking(copy);
            this.booking = copy;
            this.contractMessage ='signedMessage';
            const date = value.split('T');
            this.formatedDate = `${date[0]} ${date[1]}`;
          }

          this.isViewLoading = false;
        } else {
          this.isViewLoading = false;
          const body = {
            title: 'Error',
            message: 'unknownError'
          };

          this.modalService.openModal(body);
        }
      }, err => {
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
        this.isViewLoading = false;
        this.modalService.openModal(bodyToSend);
      });
    }
  }

  discart() {
    this.isViewLoading = true;
    this.axiosApi.discartBooking(this.booking.id).then((respose) =>{
      if (respose && respose.data === 'ok') {
        this.getBookingById();
      } else {
        const body = {
          title: 'Error',
          message: 'unknownError'
        };

        this.modalService.openModal(body);
        this.isViewLoading = false;
      }
    }).catch((err) => {
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
      this.isViewLoading = false;
      this.modalService.openModal(bodyToSend);
    })
  }
}
