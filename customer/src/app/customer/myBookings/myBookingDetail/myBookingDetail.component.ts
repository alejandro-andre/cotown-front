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
  public checkinControl = new FormControl<Date | null>(null);
  public checkinTimeControl = new FormControl<String | null>(null);
  public checkinOptionControl = new FormControl<String | null>(null);
  public checkoutControl = new FormControl<Date | null>(null);
  public checkoutTimeControl = new FormControl<String | null>(null);
  public checkoutOptionControl = new FormControl<String | null>(null);
  public selectedReason!: number;
  public selectedSchool!: number;
  public checkinOption: number | null = null;
  public checkoutOption: number | null = null;
  public flight: string = '';
  public flight_out: string = '';
  public arrival: string | null = '';
  public checkintime: string | null = null;
  public checkouttime: string | null = null;

  constructor(
    public customerService: CustomerService,
    public lookupService: LookupService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private axiosApi: AxiosApi,
    private apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {
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
    if (this.booking.school?.id == 1)
      return this.booking.school?.name + ' - ' + this.booking.school_other;
    return this.booking.school?.name || '';
  }

  get company(): string {
    return this.booking.company || '';
  }

  get check_in_option(): string {
    if (this.isSpanish)
      return this.lookupService.checkinOptions.find((elem) => elem.id === this.booking.check_in_option_id)?.name || '';
    return this.lookupService.checkinOptions.find((elem) => elem.id === this.booking.check_in_option_id)?.name_en || '';
  }

  get check_out_option(): string {
    if (this.isSpanish)
      return this.lookupService.checkoutOptions.find((elem) => elem.id === this.booking.check_out_option_id)?.name || '';
    return this.lookupService.checkoutOptions.find((elem) => elem.id === this.booking.check_out_option_id)?.name_en || '';
  }

  option_detail(): string {
    let text = ''
    if (this.isSpanish)
      text = this.lookupService.checkinOptions.find((elem) => elem.id === this.checkinOption)?.description || '';
    else
      text = this.lookupService.checkinOptions.find((elem) => elem.id === this.checkinOption)?.description_en || '';
    return text.replaceAll("\n", "<br>")
  }

  option_detail_out(): string {
    let text = ''
    if (this.isSpanish)
      text = this.lookupService.checkoutOptions.find((elem) => elem.id === this.checkoutOption)?.description || '';
    else
      text = this.lookupService.checkoutOptions.find((elem) => elem.id === this.checkoutOption)?.description_en || '';
    return text.replaceAll("\n", "<br>")
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
  
  // Return array of sections with true or false value to set as readOnly or not
  get visibility():{ [key: string]: boolean } {
    return this.customerService.visibility;
  }

  // Return array of valid check in options for the check in date, hour and location
  get checkinOptions() {
    // Enough data?
    const checkin = this.checkinControl.value !== null ? this.datePipe.transform(this.checkinControl.value, 'yyyy-MM-dd') : null;
    if (checkin == null || this.checkintime == null)
      return [];

    // Check day of week or if it's holiday
    let dow = this.checkinControl.value?.getDay();
    this.lookupService.holidays.forEach((d: any) => {
      if (d.day == checkin && (d.location == null || d.location == this.booking.resource.building.district.location))
        dow = 0;
    });

    // Look up checkin options
    const result: any = []
    this.lookupService.checkinOptions.forEach(option => {
      if (option.prices)
        option.prices.forEach((price: any) => {
          if (
            price.location == this.booking.resource.building.district.location &&
            (!price.date_from || checkin >= price.date_from) && 
            (!price.date_to || checkin <= price.date_to)
          ) {
            let from = price.timetable.Week_from; 
            let to   = price.timetable.Week_to;
            if (dow == 0) { from = price.timetable.Sun_from; to = price.timetable.Sun_to; }
            else if (dow == 6) { from = price.timetable.Sat_from; to = price.timetable.Sat_to; }
            else if (dow == 5) { from = price.timetable.Fri_from; to = price.timetable.Fri_to; }
            if (from != undefined) {
              if ((this.checkintime || '00:00') >= from.substring(0, 5) && (this.checkintime || '99:99') <= this.minusOneMinute(to)) {
                option.price = price.price;
                result.push(option);
              }
            }
          }
        })
    })

    // Options
    return result;
  }

  // Return array of valid check out options for the check in date, hour and location
  get checkoutOptions() {
    // Enough data?
    const checkout = this.checkoutControl.value !== null ? this.datePipe.transform(this.checkoutControl.value, 'yyyy-MM-dd') : null;
    if (checkout == null || this.checkouttime == null)
      return [];

    // Check day of week or if it's holiday
    let dow = this.checkoutControl.value?.getDay();
    this.lookupService.holidays.forEach((d: any) => {
      if (d.day == checkout && (d.location == null || d.location == this.booking.resource.building.district.location))
        dow = 0;
    });

    // Look up checkin options
    const result: any = []
    this.lookupService.checkoutOptions.forEach(option => {
      if (option.prices)
        option.prices.forEach((price: any) => {
          if (
            price.location == this.booking.resource.building.district.location &&
            (!price.date_from || checkout >= price.date_from) && 
            (!price.date_to || checkout <= price.date_to)
          ) {
            let from = price.timetable.Week_from; 
            let to   = price.timetable.Week_to;
            if (dow == 0) { from = price.timetable.Sun_from; to = price.timetable.Sun_to; }
            else if (dow == 6) { from = price.timetable.Sat_from; to = price.timetable.Sat_to; }
            else if (dow == 5) { from = price.timetable.Fri_from; to = price.timetable.Fri_to; }
            if (from != undefined) {
              if ((this.checkouttime || '00:00') >= from.substring(0, 5) && (this.checkouttime || '99:99') <= this.minusOneMinute(to)) {
                option.price = price.price;
                result.push(option);
              }
            }
          }
        })
    })

    // Options
    return result;
  }

  /*
   * Methods
   */

  canCheck(status: string): boolean {
    return (
      status === 'contrato' ||
      status === 'checkinconfirmado' ||
      status === 'checkin' ||
      status === 'inhouse' ||
      status === 'checkout'
    )
  }
  
  canCert(status: string): boolean {
    return (
      status === 'firmacontrato' ||
      status === 'contrato' ||
      status === 'checkinconfirmado' ||
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
    // No by default
    this.enabledSave = false;

    // Checkin date correct?
    if (this.booking && this.checkinControl.value) {
      const fecha = this.checkinControl.value;
      const d = fecha.getFullYear() + '-' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '-' + fecha.getDate().toString().padStart(2, '0');
      if (d < this.booking.date_from) {
        this.checkinControl.setErrors({ 'before_contract': true });
        return;
      }
    }

    // Checkout date correct?
    if (this.booking && this.checkoutControl.value) {
      const fecha = this.checkoutControl.value;
      const d = fecha.getFullYear() + '-' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '-' + fecha.getDate().toString().padStart(2, '0');
      if (d > this.booking.date_to) {
        this.checkoutControl.setErrors({ 'after_contract': true });
        return;
      }
      if (fecha < new Date()) {
        this.checkoutControl.setErrors({ 'past_date': true });
        return;
      }
    }

    // Mandatory fields?
    let ok = (this.checkinControl.value != null || this.checkoutControl.value != null);
    if (this.checkinControl.value || this.checkinTimeControl.value) {
      if (!this.checkinControl.value) {
        this.checkinControl.setErrors({ 'field_required': true });
        ok = false;
      }
      if (!this.checkinTimeControl.value) {
        this.checkinTimeControl.setErrors({ 'field_required': true });
        ok = false;
      }
      if (!this.check_in_option && (!this.checkinOptionControl.value || this.checkinOptions.length == 0)) {
        this.checkinOptionControl.setErrors({ 'field_required': true });
        ok = false;
      } 
    } else {
      this.checkinControl.setErrors(null)
      this.checkinTimeControl.setErrors(null)
      this.checkinOptionControl.setErrors(null)
    }

    // Show errors
    this.checkinControl.markAsTouched({ onlySelf: true });
    this.checkinTimeControl.markAsTouched({ onlySelf: true });
    this.checkinOptionControl.markAsTouched({ onlySelf: true });
    this.checkoutControl.markAsTouched({ onlySelf: true });
    this.checkoutTimeControl.markAsTouched({ onlySelf: true });
    this.checkoutOptionControl.markAsTouched({ onlySelf: true });

    // Ok
    this.enabledSave = ok;
  }

  setBooking(booking: any) {
    // Assign booking
    this.booking = booking;

    // Fill form fields
    this.checkinOption = this.booking.check_in_option_id;
    this.checkoutOption = this.booking.check_out_option_id;
    this.flight = this.booking.flight !== null ? this.booking.flight : '';
    this.flight_out = this.booking.flight_out !== null ? this.booking.flight_out : '';
    this.arrival = this.booking.arrival;
    this.checkintime = this.booking.check_in_time;
    this.checkouttime = this.booking.check_out_time;

    // Checkin date
    this.checkinControl = new FormControl(
      this.booking.check_in !== null ?
      new Date(this.booking.check_in) : null
    );

    // Checkout date
    this.checkoutControl = new FormControl(
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
    if (this.booking.contract_status === 'completed') {
      this.contractMessage = 'signed_message';
      const locale = Constants.LANGUAGES.find((elem) => elem.id === this.customerService.customer.appLang)?.date;
      this.formatedDate = this.datePipe.transform(this.booking.contract_signed, locale + ' HH:MM:SS') || '';
    } else {
      this.contractMessage = 'sign_message';
    }

    // Visibility
    this.customerService.setBookingVisibility(this.booking);
  }

  // Refresh booking
  getBookingById () {
    this.isLoading = true;
    this.apollo.getData(GET_BOOKING_BY_ID, { id: this.booking.id }).subscribe({

      next: (res) => {
        const data = res.data;
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
    const checkin = this.checkinControl.value !== null ? this.datePipe.transform(this.checkinControl.value, 'yyyy-MM-dd') : null;
    const checkout = this.checkoutControl.value !== null ? this.datePipe.transform(this.checkoutControl.value, 'yyyy-MM-dd'): null;

    // GraphQL API
    const variables: any = {
      id: this.booking.id,
      checkin: checkin,
      checkout: checkout,
      arrival: this.arrival,
      flight: this.flight,
      flightout: this.flight_out,
      checkintime: this.checkintime == '' ? null : this.checkintime,
      checkouttime: this.checkouttime == '' ? null : this.checkouttime,
      optionin: this.checkinOption,
      optionout: this.checkoutOption,
      selectedSchool : this.selectedSchool,
      selectedReason : this.selectedReason,
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
        console.log(err)
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

  // Stay certificate
  certificate () {
    this.isLoading = true;
    const url = `cert/${this.booking.id}`;
    this.axiosApi.getFileFromUrl(url).then((res) => {
      const fileURL = URL.createObjectURL(res.data);
      this.isLoading = false;
      window.open(fileURL, '_blank');
    });
  }

  // Cancel booking
  discard () {

    // Confirm
    const modal = this.modalService.confirmModal({ title: 'confirm', message: 'discard_confirmation', type: 'yesno' });
    modal.afterClosed().subscribe((sure: any) => {

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

  minusOneMinute(d: string) {
    let time = parseInt(d.split(':')[0]) * 60 + parseInt(d.split(':')[1]) - 1;
    if (time < 0)
      return "23:59";
    return Math.trunc(time / 60).toString().padStart(2, '0') + ':' + (time % 60).toString().padStart(2, '0');
  }
}