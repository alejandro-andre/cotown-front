import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingListByBuildingCodeAndResourceTypeQuery, BookingListByBuildingCodeQuery } from 'src/app/schemas/querie-definitions/booking.query';
import { BuildingListByCityNameQuery, BuildingListQuery } from 'src/app/schemas/querie-definitions/building.query';
import { CityListQuery } from 'src/app/schemas/querie-definitions/city.query';
import { ResourceListByBuildingCodeAndResourceTypeQuery, ResourceListByBuldingCodeQuery, ResourceTypeQuery } from 'src/app/schemas/querie-definitions/resource.query';
import { AccessTokenService } from 'src/app/services/access-token.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';
import { TimeChartLine } from 'src/app/time-chart/models/time-chart-line.model';
import { TimeChartControlComponent } from 'src/app/time-chart/time-chart-control/time-chart-control.component';
import { orderByName } from 'src/app/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {

  @ViewChild(TimeChartControlComponent)
  private ganttChartControl!: TimeChartControlComponent;

  public bars: TimeChartBar[] = []; // Bars
  public cities: any [] = []; // Cities
  public selectedCitie = 'ALL'; // Current city
  public buildings: any [] = []; // Buildings
  public selectedBuilding = ''; // Selected building
  public now: Date = new Date(); // Current date
  public resourceTypes: any [] = []; // Type of resources
  public selectedResouceType = 'ALL';

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
  private resources: any[] = []; // Resources
  private bookings: any [] = []; // Bookings

  // Constructor
  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi
  ) {
    this.now = new Date();
  }

  // TODO use only on development mode
  login() {
    this.apolloApi.login().subscribe((res: any) => {
      this.accessToken.token = res.data.login;
      this.getCities();
      this.getAllBuildings();
    })
  }

  getAllBuildings(): void {
    this.apolloApi.getData(BuildingListQuery).subscribe(res => {
      this.buildings = orderByName(res.data.data);
    });
  }

  getCities(): void {
    this.apolloApi.getData(CityListQuery).subscribe((result) => {
      this.cities = orderByName(result.data.data);
    });
  }

  ngOnInit() {
    this.login();
  }

  get cityName(): string {
    if (this.selectedCitie) {
      return this.cities.find((cit) => cit.id === this.selectedCitie).name;
    }

    return '';
  }

  getResourceType() :void {
    this.apolloApi.getData(ResourceTypeQuery).subscribe(res => {
      this.resourceTypes = res.data.data;
    })
  }

  applyResourceTypeFilter():void {
    // Remove all data
    this.bookings = [];
    this.resources = [];
    const variables = {
      buidingCode: this.selectedBuilding,
      resourceType: this.selectedResouceType
    };

    this.getResourceList(ResourceListByBuildingCodeAndResourceTypeQuery, variables).then(() => {
      this.getBookings(BookingListByBuildingCodeAndResourceTypeQuery, variables);
    });
  }

  onSelectResourceType(): void {
    this.bars = [];
    this.resources = [];
    this.bookings = [];
    if (this.selectedResouceType === 'ALL') { // Dont use filter
      this.getResourcesAndBookings();
    } else {
      this.applyResourceTypeFilter();
    }
  }

  onSelectCity():void {
    this.bars = [];
    this.resources = [];
    this.bookings = [];
    this.selectedBuilding = '';

    if (this.selectedCitie === 'ALL') {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
      });
    } else {
      const variables = {
        cityName: this.cityName
      };

      this.apolloApi.getData(BuildingListByCityNameQuery, variables).subscribe(res => {
        this.buildings = res.data.data;
      });
    }
  }

  async getResourceList(query: string, variables: { [key: string]: string}): Promise<void> {
    new Promise<void>((resolve) => {
      this.apolloApi.getData(query, variables).subscribe((res: any) => {
        this.getResourceType();
        const result = res.data.data;
        for(const elem of result) {
          this.resources.push({
            Resource_code: elem.code,
            Resource_type: elem.resource_type,
            Resource_info: elem.resource_place_type?.code || ''
          });
        }

        resolve();
      });
    });
  }

  getResourcesAndBookings(): void {
    this.resources = [];
    this.bookings = [];
    this.bars = [];

    this.getResourceList(ResourceListByBuldingCodeQuery, { 'buildingCode': this.selectedBuilding }).then(() => {
      this.getBookings(BookingListByBuildingCodeQuery, { 'buildingCode': this.selectedBuilding });
    });
  }

  getAge(birthdate: string) {
      const timeDiff = Math.abs(Date.now() - new Date(birthdate).getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      return age;
  }

  getBookings(query: string, variables: { [key: string]: string}): void {
    this.bookings = [];
    this.apolloApi.getData(query, variables).subscribe((response: any) => {
      const bookingList = response.data.data;
      console.log(bookingList);
      for (const booking of bookingList) {
        const age = this.getAge(booking.booking.customer.birth_date);
        this.bookings.push({
          Booking_code: booking.booking_id,
          Booking_lock: booking.lock,
          Booking_status: booking.status,
          Booking_date_from: booking.date_from,
          Booking_date_to: booking.date_to,
          Resource_code: booking.resource?.code || '',
          Customer_name: booking.booking.customer.name,
          Customer_gender: booking.booking.customer.gender.code,
          Customer_country: booking.booking.customer.country.name,
          Customer_email: booking.booking.customer.email,
          Customer_phone: booking.booking.customer.phones,
          Customer_age: age,
          Customer_last_name: booking.booking.customer.last_name
        });
      }

      this.generateBars()
    });
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
          + ' - ' + b.Customer_last_name
          + ' - ' + b.Customer_age
          + ' - ' + b.Customer_gender
          + ' - ' + b.Customer_country
        line.tooltip = `
          <div><span class="tiphead">${b.Booking_code}</span></div>
          <div><span class="tipfield">${b.Booking_status}</span></div>
          <div><span class="tipfield">${b.Booking_date_from} a ${b.Booking_date_to}</span></div>
          <div><span class="tipfield">Nombre:</span><span>${b.Customer_name}</span></div>
          <div><span class="tipfield">Apellido:</span><span>${b.Customer_last_name}</span></div>
          <div><span class="tipfield">Género:</span><span>${b.Customer_gender}</span></div>
          <div><span class="tipfield">Edad:</span><span>${b.Customer_age}</span></div>
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
