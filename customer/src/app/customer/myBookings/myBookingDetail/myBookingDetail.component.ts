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
import { Booking, TableObject } from 'src/app/constants/Interface';
import {
  ACCEPT_BOOKING_OPTION,
  GET_BOOKING_BY_ID,
  SIGN_BOOKING_CONTRACT,
  UPDATE_BOOKING
} from 'src/app/schemas/query-definitions/booking.query';
import { FormControl } from '@angular/forms';
import { LookupService } from 'src/app/services/lookup.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent implements OnInit {

  public isViewLoading = false;
  public booking!: Booking;
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

  public displayedColumnsOptions: string[] = [
      'accept',
      'building',
      'resource_type',
      'flat_type',
      'place_type',
  ];

  public displayedColumns: string[] = [
    'rent_date',
    'rent',
    'services',
    'rent_discount',
    'services_discount',
  ];

  public enabledSave: boolean = false;

  public selectedReason!: number;
  public selectedSchool!: number;
  public selectedOption: number | null = null;
  public checkinFormControl = new FormControl<Date | null>(null);
  public checkoutFormControl = new FormControl<Date | null>(null);
  public flight:string = '';
  public arrival: string = '';

  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private axiosApi: AxiosApi,
    private apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {

    // Spinner
    this.isViewLoading = true;

    // Get id
    this.activeRoute.params.subscribe((res) => {
      const id = res['id'];
      this.bookingId = parseInt(id);
      const finded = this.customerService.customer.bookings?.find(
        (booking: Booking) => booking.id === this.bookingId
      );
      if (finded) {
        this.booking = finded;
        this.selectedOption = this.booking.check_in_id;
        this.flight = this.booking.flight !== null ? this.booking.flight : '';
        this.arrival = this.booking.arrival !== null ? this.booking.arrival : '';
        this.checkinFormControl = new FormControl(
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
      }
    });
  }

  async ngOnInit(): Promise<void> {

    // Get contracts
    if (this.booking) {
      if (this.booking.contract_signed !== null) {
        this.contractMessage = 'signed_message';
        const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
        this.formatedDate = this.datePipe.transform(this.booking.contract_signed, locale + ' HH:MM:SS') || '';
      } else {
        this.contractMessage = 'sign_message';
      }
      await this.getPdfsContracts();
    }
    
  }

  /*
   * Getters
   */

  get status(): string {
    if (this.booking && this.booking.status) {
      const status = this.lookupService.status.find((elem) => elem.code === this.booking.status)
      return (this.customerService.customer.appLang === Constants.SPANISH.id) ? status?.name || '' : status?.name_en || '';
    }
    return '';
  }

  get building(): string {
    if (this.booking && this.booking.building) {
      const { name, code } = this.booking.building;
      return `${code}, ${name}`
    }
    return '';
  }

  get resourceType(): string {
    if (this.booking && this.booking.resource_type) {
      const status = this.lookupService.resourceTypes.find((elem) => elem.code === this.booking.resource_type)
      return (this.customerService.customer.appLang === Constants.SPANISH.id) ? status?.name || '' : status?.name_en || '';
    }
    return '';
  }

  get flatType(): string {
    if (this.booking && this.booking.flat_type) {
      const { name, code } = this.booking.flat_type;
      return `${code}, ${name} `;
    }
    return '';
  }

  get placeType(): string {
    if (this.booking && this.booking.place_type) {
      const { name, code } = this.booking.place_type;
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

  get options(): any {

    const options =  [];

    for (const option of this.booking.options || []) {
      if (!option.accepted) {
        options.push({
          'id': option.id,
          'accepted': option.accepted,
          'building': `${option.building.code || ''}, ${option.building.name || ''} `,
          'resource_type': this.getResourceType(option.resource_type),
          'flat_type': `${option.flat_type.code || ''}, ${option.flat_type.name || ''} `,
          'place_type': `${option.place_type.code || ''}, ${option.place_type.name || ''}`,
        })
      }
    }
    return options;
  }

  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }
  
  getResourceType(code: string): string {
    const status = this.lookupService.resourceTypes.find((elem) => elem.code === code)
    return (this.customerService.customer.appLang === Constants.SPANISH.id) ? status?.name || '' : status?.name_en || '';
  }

  enableSave() {
    this.enabledSave = true;
  }

  formatDate(date: string | null): string {
    if (date !== '' && date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate || '';
    }
    return '';
  }

  save () {

    // Spinner
    this.isViewLoading = true;

    // Format dates
    const checkin = this.checkinFormControl.value !== null ? this.datePipe.transform(this.checkinFormControl.value, 'yyyy-MM-dd') : null;
    const checkout = this.checkoutFormControl.value !== null ? this.datePipe.transform(this.checkoutFormControl.value, 'yyyy-MM-dd'): null;

    // GraphQL API
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
    this.apollo.setData(UPDATE_BOOKING, variables).subscribe({

      next: (res) => {
        const value = res.data;
        if(value && value.data && value.data.length) {
          this.getBookingById();
        } else {
          this.modalService.openModal({title: 'Error',message: 'unknownError'});
        }
      }, 

      error: (err)  => {
        this.isViewLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }

    })
  }

  accept (id: number): void {

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
              const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
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
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  /* REVISAR */

  getBookingById () {
    this.apollo.getData(GET_BOOKING_BY_ID, { id: this.booking.id }).subscribe({

      next: (res) => {
        const data = res.data;
        this.isViewLoading = false;
        if (data && data.booking && data.booking.length) {
          this.isEditableReason = false;
          this.isEditableSchool = false;
          this.booking = data.booking[0];
          this.enabledSave = false;
        } else {
          this.modalService.openModal({ title: 'Error', message: 'unknownError' });
        }

      }, 

      error: (err) => {
        this.isViewLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }

    });
  }

  /* PDFs */

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
    if (
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

  sign (type: String):void {
    this.isViewLoading = true;
    if (type === this.SERVICE_CONTRACT_TYPE) {
      this.contract_service_info.signed = true;
    } else{
      this.contract_rent_info.signed = true;
    }

    if(this.contract_rent_info.signed && this.contract_service_info.signed) {
      const variables = {
        id: this.booking.id,
        time: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.apollo.setData(SIGN_BOOKING_CONTRACT,variables).subscribe({

        next: (res) => {
          const value = res.data.data[0].Contract_signed;
          this.isViewLoading = false;
          if (value) {
            const finded = this.customerService.customer.bookings?.find((booking: Booking) => booking.id === this.bookingId );
            if (finded) {
              const copy = JSON.parse(JSON.stringify(finded));
              copy.contract_signed = value;
              this.customerService.updateBooking(copy);
              this.booking = copy;
              this.contractMessage ='signedMessage';
              const date = value.split('T');
              this.formatedDate = `${date[0]} ${date[1]}`;
            }
          } else {
            this.modalService.openModal({title: 'Error', message: 'unknownError'});
          }
        }, 
      
        error: (err) => {
          const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
          this.isViewLoading = false;
          this.modalService.openModal(bodyToSend);
        }

      });
    }
  }

  discard() {

    // Spinner
    this.isViewLoading = true;

    // API REEST
    this.axiosApi.discartBooking(this.booking.id).then((respose) =>{
      if (respose && respose.data === 'ok') {
        this.getBookingById();
      } else {
        this.modalService.openModal({ title: 'Error', message: 'unknownError'});
        this.isViewLoading = false;
      }
    }).catch((err) => {
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
      this.isViewLoading = false;
      this.modalService.openModal(bodyToSend);
    })
  }
}