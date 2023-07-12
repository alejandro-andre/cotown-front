// Core
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

// Services
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

//Queries & constants
import { Constants } from 'src/app/constants/Constants';
import { IBooking, IOption } from 'src/app/constants/Interface';
import { ACCEPT_BOOKING_OPTION, GET_BOOKING_BY_ID, SIGN_BOOKING_CONTRACT, UPDATE_BOOKING } from 'src/app/schemas/query-definitions/booking.query';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './myBookingDetail.component.html',
  styleUrls: ['./myBookingDetail.component.scss']
})

export class MyBookingDetailComponent {

  @ViewChild('pdfRent') pdfRent: any;
  @ViewChild('pdfServices') pdfServices: any;

  // Current booking
  public booking!: IBooking;

  // Contract data
  public contractMessage: string = '';
  public formatedDate: string = '';

  // Flags
  public isLoading = false;
  public isEditableSchool: boolean = false;
  public isEditableReason: boolean = false;
  public enabledSave: boolean = false;

  // Contracts info
  public contractRentInfo = {
    contract: '',
    total_pages: 1,
    current_page: 1,
    signed: false,
    rendered: false,
  };
  public contractServicesInfo = {
    contract: '',
    total_pages: 1,
    current_page: 1,
    signed: false,
    rendered: false
  };

  // Constants
  public RENT_CONTRACT_TYPE = 'RENT_CONTRACT';
  public SERVICE_CONTRACT_TYPE = 'SERVICE_CONTRACT';
  
  // Tables
  public displayedColumnsOptions: string[] = [
      'accept',
      'building',
      'resource_type',
      'flat_type',
      'place_type',
  ];
  public displayedColumnsPrices: string[] = [
    'rent_date',
    'rent',
    'services',
    'rent_discount',
    'services_discount',
  ];

  // Form data
  public checkinFormControl = new FormControl<Date | null>(null);
  public checkoutFormControl = new FormControl<Date | null>(null);
  public selectedReason!: number;
  public selectedSchool!: number;
  public selectedOption: number | null = null;
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

    this.enableSave();
    // Look for booking
    this.isLoading = true;
    this.activeRoute.params.subscribe((res) => {
      this.isLoading = false;
      const found = this.customerService.customer.bookings?.find((b: IBooking) => b.id === parseInt(res['id']));
      if (found) {
        this.setBooking(found)
        this.getPdfsContracts();
      }
    });

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

  get resourceAddress(): string {
    return (this.booking?.resource?.building?.address || '') + (this.booking?.resource?.flat?.street || '') + ' - '
         + (this.booking?.resource?.address || ''); 
  }

  get reasonName(): string {
    return this.booking?.reason?.name || '';
  }

  get schoolName(): string {
    return this.booking.school?.name || '';
  }

  get payer(): string {
    return this.booking.payer?.name || '---';
  }

  get options(): any {

    const options =  [];

    for (const option of this.booking.options || []) {
      if (!option.accepted) {
        options.push({
          'id': option.id,
          'accepted': option.accepted,
          'building': `${option.building?.code || ''}, ${option.building?.name || ''} `,
          'resource_type': this.getResourceType(option.resource_type),
          'flat_type': `${option.flat_type?.code || ''}, ${option.flat_type?.name || ''} `,
          'place_type': `${option.place_type?.code || ''}, ${option.place_type?.name || ''}`,
        })
      }
    }
    return options;
  }

  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }
  
  /*
   * Methods
   */

  canCheckIn(status: string): boolean {
    return (
      status === 'checkinconfirmado' ||
      status === 'contrato' ||
      status === 'checkin' ||
      status === 'inhouse' ||
      status === 'checkout'
    )
  }
  
  getResourceType(code: string): string {
    const status = this.lookupService.resourceTypes.find((elem) => elem.code === code)
    return (this.customerService.customer.appLang === Constants.SPANISH.id) ? status?.name || '' : status?.name_en || '';
  }

  formatDate(date: string | null): string {
    if (date !== '' && date !== null) {
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      const formattedDate = this.datePipe.transform(date, locale);
      return formattedDate || '';
    }
    return '';
  }

  enableSave() {
    this.enabledSave = true;
  }

  setBooking(booking: any) {

    // Assign booking
    this.booking = booking;

    // Fill form fields
    this.selectedOption = this.booking.check_in_id;
    this.flight = this.booking.flight !== null ? this.booking.flight : '';
    this.arrival = this.booking.arrival !== null ? this.booking.arrival : '';

    // Checkin date
    this.checkinFormControl = new FormControl(
      this.booking.check_in !== null ?
      new Date(this.booking.check_in) : null
    );

    // Checkout date
    this.checkoutFormControl = new FormControl(
      this.booking.check_out !== null ?
      new Date(this.booking.check_out) : null
    )

    // Reason
    if (this.reasonName === '') {
      this.isEditableReason = true;
    } else {
      this.selectedReason = this.booking.reason.id;
    }

    // School
    if (this.schoolName === '') {
      this.isEditableSchool = true;
    } else {
      this.selectedSchool = this.booking.school.id;
    }

    // Signature
    if (this.booking.contract_signed !== null) {
      this.contractMessage = 'signed_message';
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      this.formatedDate = this.datePipe.transform(this.booking.contract_signed, locale + ' HH:MM:SS') || '';
    } else {
      this.contractMessage = 'sign_message';
    }

  }

  // Refresh booking
  getBookingById () {
    this.isLoading = true;
    this.apollo.getData(GET_BOOKING_BY_ID, { id: this.booking.id }).subscribe({

      next: (res) => {
        const data = res.data;
        console.log(data);
        this.isLoading = false;
        if (data && data.booking && data.booking.length) {
          this.enabledSave = false;
          this.setBooking(data.booking[0]);
        } else {
          this.modalService.openModal({ title: 'Error', message: 'unknown_error', type: 'ok' });
        }

      }, 

      error: (err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }

    });
  }

  // Save changes
  save () {

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
    this.isLoading = true;
    this.apollo.setData(UPDATE_BOOKING, variables).subscribe({

      next: (res) => {
        const value = res.data;
        this.isLoading = false;
        if (value && value.data && value.data.length) {
          this.getBookingById();
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok'});
        }
      }, 

      error: (err)  => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }

    })
  }

  // Accept option
  accept (option: IOption): void {

    // GraphQL variables
    const variables = {
      id: option.id,
      accepted: true
    };
    this.isLoading = true;
    this.apollo.setData(ACCEPT_BOOKING_OPTION, variables).subscribe({

      next: (res) => {
        const value = res.data;
        this.isLoading = false;
        if (value && value.updated && value.updated.length) {
          this.getBookingById();
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok'});
        }
      },

      error: (err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      }
    })
  }

  isDiscardable() {
    //return ['solicitud','solicitudpagada','alternativas','alternativaspagada','pendientepago'].includes(this.booking.status)
    return ['solicitud','alternativas','pendientepago'].includes(this.booking.status)
  }
  
  // Cancel booking
  discard () {

    // Confirm
    const modal = this.modalService.confirmModal({ title: 'confirm', message: 'discard_confirmation', type: 'yesno' });
    modal.afterClosed().subscribe((sure) => {

      // Not sure
      if (!sure) {
        return;
      }

      // Sure: discard
      let status = 'descartada';
      if (this.booking.status.includes('pagada'))
        status = 'descartadapagada';

      // Call API
      this.isLoading = true;
      this.axiosApi.discardBooking(this.booking.id, status).then((respose) =>{
        this.isLoading = false;
        if (respose && respose.data === 'ok') {
          this.getBookingById();
        } else {
          this.modalService.openModal({ title: 'Error', message: 'unknown_error', type: 'ok' });
        }
      }).catch((err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
        this.modalService.openModal(bodyToSend);
      })
    });
    return;

  }

  /* PDFs */

  async getPdfsContracts() {

    if (this.booking.contract_services) {
      const type = Constants.CONTRACT_SERVICES_PDF;
      const data = await this.axiosApi.getContract(this.booking.id, type);
      if (data && data.data) {
        this.contractServicesInfo.contract = URL.createObjectURL(data.data);
        this.contractServicesInfo.rendered = true;
      }
    }

    if (this.booking.contract_rent) {
      const type = Constants.CONTRACT_RENT_PDF;
      const data = await this.axiosApi.getContract(this.booking.id, type);
      if (data && data.data) {
        this.contractRentInfo.contract = URL.createObjectURL(data.data);
        this.contractRentInfo.rendered = true;
      }
    }
  }

  afterLoadRent(pdf: PDFDocumentProxy) {
    this.pdfRent = pdf;
    this.contractRentInfo.total_pages = pdf._pdfInfo.numPages;
  }

  afterLoadServices(pdf: PDFDocumentProxy) {
    this.pdfServices = pdf;
    this.contractServicesInfo.total_pages = pdf._pdfInfo.numPages;
  }

  get contractsRendered(): boolean {
    return this.contractRentInfo.rendered || this.contractServicesInfo.rendered
  }

  get contractsSigned (): String | null {
    return this.booking.contract_signed;
  }

  sign(type: String):void {

    // Signed contract
    if (type === this.SERVICE_CONTRACT_TYPE) {
      this.contractServicesInfo.signed = true;
    } else {
      this.contractRentInfo.signed = true;
    }

    // Both signed
    if (this.contractRentInfo.signed && (this.contractServicesInfo.signed || this.contractServicesInfo.contract == '')) {
      const variables = {
        id: this.booking.id,
        time: this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss')
      }
      this.isLoading = true;
      this.apollo.setData(SIGN_BOOKING_CONTRACT, variables).subscribe({

        next: (res) => {
          this.isLoading = false;
          this.getBookingById();
        }, 
      
        error: (err) => {
          this.isLoading = false;
          const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es');
          this.modalService.openModal(bodyToSend);
        }

      });
    }
  }

  downloadRent() {
    this.download(this.pdfRent, this.booking.contract_rent?.name || 'Contrato renta.pdf');
  }

  downloadServices() {
    this.download(this.pdfServices, this.booking.contract_services?.name || 'Contrato servicios.pdf');
  }

  download(pdf: any, name: string) {
    pdf.getData().then((data:any) => {
      let blob = new Blob([data.buffer], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL((blob));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      link.click();
    });
  }
}