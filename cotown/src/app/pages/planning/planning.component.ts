import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessTokenService } from 'src/app/services/access-token.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';
import { TimeChartLine } from 'src/app/time-chart/models/time-chart-line.model';
import { TimeChartControlComponent } from 'src/app/time-chart/time-chart-control/time-chart-control.component';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {

  @ViewChild(TimeChartControlComponent)
  private ganttChartControl!: TimeChartControlComponent;

  // Bars
  public bars: TimeChartBar[] = [];

  // Cities
  public cities: any [] = [];

  // Query to get the cities
  private citieQuery= `{
    Geo_LocationList {
      id,
      Name
    }
  }`;
  // Current citie
  public selectedCitie = '';
  // Buildings
  public buildings: any [] = [];
  // Selected building
  public selectedBuilding = '';

  // Current date
  public now: Date = new Date();

  // Colors
  private colors: any = {
    confirmada: '#002B5B',
    solicitud: '#1A5F7A',
    checkin: '#159895',
    checkout: '#57C5B6',
    finalizada: '#537FE7'
  };

  // Types
  private types: any = {
    piso: 'title_h1',
    habitacion: 'title_h2',
    plaza: 'title_h3'
  };

  // Resources
  private resources: any[] = [];
  /*private resources = [
    { 'Resource_code': 'ART030.AT.00',        'Resource_type': 'piso',       'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H01',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H02',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H03',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H04',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05.P1', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H05.P2', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06',    'Resource_type': 'habitacion', 'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06.P1', 'Resource_type': 'plaza',      'Resource_info': '...' },
    { 'Resource_code': 'ART030.AT.00.H06.P2', 'Resource_type': 'plaza',      'Resource_info': '...' },
  ]*/

  // Bookings
    private bookings: any [] = [];

  /*private bookings = [
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '',
      'Booking_date_from': '2023-04-01', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00'
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '',
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-06-20',
      'Resource_code': 'ART030.AT.00'
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'confirmada',
      'Booking_date_from': '2023-04-01', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H01',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'solicitud',
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H02',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'checkin', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-04-20',
      'Resource_code': 'ART030.AT.00.H03',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'checkout', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-06-20',
      'Resource_code': 'ART030.AT.00.H03',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': '', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H05',
    },
    {
      'Booking_code': '1234', 'Booking_lock': true, 'Booking_status': 'finalizada', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H05',
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'confirmada', 
      'Booking_date_from': '2023-03-21', 'Booking_date_to': '2023-05-11',
      'Resource_code': 'ART030.AT.00.H05.P1',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    },
    {
      'Booking_code': '1234', 'Booking_lock': false, 'Booking_status': 'solicitud', 
      'Booking_date_from': '2023-04-21', 'Booking_date_to': '2023-05-21',
      'Resource_code': 'ART030.AT.00.H05.P2',
      'Customer_name': 'Alejandro André', 'Customer_gender': 'H', 'Customer_country': 'España', 'Customer_phone': '629 25 26 13', 'Customer_email': 'alejandroandre@hotmail.com', 
    }
  ]*/

  // TODO use only on development mode
  login() {
    this.apolloApi.login().subscribe((res: any) => {
      this.accessToken.token = res.data.login;

      this.apolloApi.getData(this.citieQuery).subscribe((result) => {
        this.cities = result.data.Geo_LocationList;
      });
      console.log(this.accessToken)
    })
  }

  // Constructor

  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi
  ) {
    this.login();
    this.now = new Date();
  }

  ngOnInit() {
    this.login();
  }

  get cityName(): string {
    if (this.selectedCitie) {
      return this.cities.find((cit) => cit.id === this.selectedCitie).Name;
    }

    return '';
  }

  onSelectCity():void {
    const  buildingQuery = `{
      Building_BuildingList{
        Name
        Code
        DistrictViaDistrict_id(joinType: INNER){LocationViaLocation_id(joinType: INNER where:{Name:{EQ:"${this.cityName}"}}){Name}}}
    }`;

    this.apolloApi.getData(buildingQuery).subscribe(res => {
      this.buildings = res.data.Building_BuildingList;
    })
  }

  onSelectBuilding(): void {
    this.resources = [];
    const resourcesQuery = `
    {
      Resource_ResourceList {
        Code,
        Building_id,
        Address,
        Search,
        Billing_type,
        Resource_type,
        Resource_place_typeViaPlace_type_id {
          Name,
          Code
        }
        BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: "${this.selectedBuilding}"}} ){
          Name,
          Code,
          Address,
          Booking_fee,
        }
      }
    }`;


    this.apolloApi.getData(resourcesQuery).subscribe((res: any) => {
      const result = res.data.Resource_ResourceList;
      for(const elem of result) {
        this.resources.push({
          Resource_code: elem.Code,
          Resource_type: elem.Resource_place_typeViaPlace_type_id?.Code || '' ,
          Resource_info: '...' as string
        });
      }

      this.getBookings();
    })
  }

  getBookings(): void {
    this.bookings = [];
    const query =`{
      Booking_Booking_detailList {
        Building_id
        BuildingViaBuilding_id(joinType: INNER where: { Code: { EQ: "${this.selectedBuilding}" } }) {
          Code
        }
        Booking_id
        Status
        ResourceViaResource_id{
          Code
        }
        Date_from
        Date_to
        Lock
        Flat_type: Resource_flat_typeViaFlat_type_id {
          Code
          Name
        }
        Place_type: Resource_place_typeViaPlace_type_id {
          Code
          Name
        }
      }
    }`;

    this.apolloApi.getData(query).subscribe((response: any) => {
      const bookingList = response.data.Booking_Booking_detailList;
      for (const booking of bookingList) {
        this.bookings.push({
          Booking_code: booking.Booking_id,
          Booking_lock: booking.Lock,
          Booking_status: booking.Status,
          Booking_date_from: booking.Date_from,
          Booking_date_to: booking.Date_to,
          Resource_code: booking.ResourceViaResource_id?.Code || ''
        })
      }

      console.log('Hello from your bookings: ', this.bookings)
      this.generateBars()
    })


  }

  // Go 1 week bacwards
  goBackward() {
    this.ganttChartControl.backward();
  }

  // Go 1 week forward
  goForward() {
    this.ganttChartControl.forward();
  }

  // Generate bars for the time chart
  generateBars() {
    this.bars = [];
    let auxBar!: TimeChartBar;

    // Current resource
    let res = '';

    // Generate bars
    for (const r of this.resources) {
      auxBar = new TimeChartBar();
      auxBar.code = r.Resource_code;
      auxBar.info = r.Resource_info
      auxBar.style = this.types[r.Resource_type];
        this.bars.push(auxBar);
    }

    // Generate lines
    for (const b of this.bookings) {
      // Dates
      let line: TimeChartLine = new TimeChartLine();
      line.datefrom = new Date(b.Booking_date_from);
      line.dateto = new Date(b.Booking_date_to);

      // Locking booking
      if (b.Booking_lock) {
        line.lock = true;
        line.color = '#C0C0C0';
        line.type = 'stripes';
      }

      // Real booking
      else {
        line.lock = false;
        line.code = b.Booking_code;
        line.color = this.colors[b.Booking_status];
        line.text = b.Customer_name
          + ' - ' + b.Customer_gender
          + ' - ' + b.Customer_country
          + ' - ' + b.Customer_email
          + ' - ' + b.Customer_phone;
        line.tooltip = `
          <div><span class="tiphead">${b.Booking_code}</span></div>
          <div><span class="tipfield">${b.Booking_status}</span></div>
          <div><span class="tipfield">${b.Booking_date_from} a ${b.Booking_date_to}</span></div>
          <div><span class="tipfield">Nombre:</span><span>${b.Customer_name}</span></div>
          <div><span class="tipfield">Edad/Género:</span><span>${b.Customer_gender}</span></div>
          <div><span class="tipfield">País:</span><span>${b.Customer_country}</span></div>
          <div><span class="tipfield">Teléfono:</span><span>${b.Customer_phone}</span></div>
          <div><span class="tipfield">Email:</span><span>${b.Customer_email}</span></div>`
      }

      // Add line to proper bar
      for (const bar of this.bars) {
        if (bar.code == b.Resource_code) {
          bar.lines.push(line);
          break;
        }
      }
    }

    // Consolidate bar lines
    for (const bar of this.bars) {
      if (bar.lines.length > 1 && bar.lines[0].lock) {
        bar.lines = this.consolidateIntervals(bar.lines);
      }
    }
  }

  // Consolidate bookings for lock types
  consolidateIntervals(intervals: TimeChartLine[]) {

    // Sort by date
    intervals.sort((a, b) => a.datefrom.getTime() - b.datefrom.getTime());

    // List of resulting consolidated bookings
    let consolidatedIntervals = [];

    // Get first booking as current
    let currentInterval = intervals[0];

    // Loop thru all bookings
    for (let i = 1; i < intervals.length; i++) {

      // Next interval overlaps current one
      if (intervals[i].datefrom <= currentInterval.dateto) {

        // Extend current interval
        if (currentInterval.dateto < intervals[i].dateto) {
          currentInterval.dateto = intervals[i].dateto;
        }
      }

      // Next interval doesnt overlap, its a new one
      else {
        consolidatedIntervals.push(currentInterval);
        currentInterval = intervals[i];
      }
    }

    // Add last interval to list and return
    consolidatedIntervals.push(currentInterval);
    return consolidatedIntervals;
  }
}
