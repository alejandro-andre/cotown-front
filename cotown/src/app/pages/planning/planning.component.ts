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

  public bars: TimeChartBar[] = []; // Bars
  public cities: any [] = []; // Cities
  public selectedCitie = ''; // Current city
  public buildings: any [] = []; // Buildings
  public selectedBuilding = ''; // Selected building
  public now: Date = new Date(); // Current date
  public resourceTypes: any [] = []; // Type of resources
  public selectedResouceType = '';

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

  // Bookings
  private bookings: any [] = [];

  // TODO use only on development mode
  login() {
    const  citieQuery= `{
      data: Geo_LocationList {
        id,
        name: Name
      }
    }`;

    this.apolloApi.login().subscribe((res: any) => {
      this.accessToken.token = res.data.login;

      this.apolloApi.getData(citieQuery).subscribe((result) => {
        this.cities = result.data.data;
      });
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
      return this.cities.find((cit) => cit.id === this.selectedCitie).name;
    }

    return '';
  }

  getResourceType() :void {
    const resourceQuery = `{
      data: Resource_Resource_place_typeList {
        code: Code
        name: Name
      }
    }`;

    this.apolloApi.getData(resourceQuery).subscribe(res => {
      this.resourceTypes = res.data.data;
    })
  }

  onSelectResourceType(): void {
    // Remove all data
    this.bookings = [];
    this.resources = [];


    // Resource query
    const resourcesQuery = `
    {
      data: Resource_ResourceList {
        code: Code
        building_id: Building_id
        adress: Address
        resource_type: Resource_type
        resource_place_type: Resource_place_typeViaPlace_type_id(joinType: INNER where: { Code: { EQ: "${this.selectedResouceType}" } }) {
          name: Name
          code: Code
        }
        building: BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: "${this.selectedBuilding}"}} ){
          name: Name
          code: Code
          address: Address
        }
      }
    }`;
    this.getResourceList(resourcesQuery);

    // Booking query
    const bookinsgQuery = `{
      data: Booking_Booking_detailList {
        building_id: Building_id
        building: BuildingViaBuilding_id(joinType: INNER where: { Code: { EQ: "${this.selectedBuilding}" } }) {
          code: Code,
        }
        booking_id: Booking_id
        booking: BookingViaBooking_id {
          customer: CustomerViaCustomer_id {
            name: Name
            birth_date: Birth_date
            gender: GenderViaGender_id {
              code: Code
              name: Name
            }
            email: Email
            phones: Phones
            country: CountryViaCountry_id {
              name: Name
            }
          }
        }
        status: Status
        resource: ResourceViaResource_id{
          code: Code
        }
        date_from: Date_from
        date_to: Date_to
        lock: Lock
        flat_type: Resource_flat_typeViaFlat_type_id {
          code: Code
          name: Name
        }
        place_type: Resource_place_typeViaPlace_type_id(joinType: INNER where: { Code: { EQ: "${this.selectedResouceType}" } }) {
          code: Code
          name: Name
        }
      }
    }`;

    this.getBookings(bookinsgQuery);
  }

  onSelectCity():void {
    const  buildingQuery = `
    query BuildingList($cityName: String){
      data: Building_BuildingList{
        name: Name
        code: Code
        DistrictViaDistrict_id(joinType: INNER){LocationViaLocation_id(joinType: INNER where:{Name:{EQ: $cityName}}){Name}}}
    }`;

    const variables = {
      cityName: this.cityName
    }

    this.apolloApi.getData(buildingQuery, variables).subscribe(res => {
      this.buildings = res.data.data;
    })
  }

  getResourceList(query: string): void {
    this.apolloApi.getData(query).subscribe((res: any) => {
      this.getResourceType();
      const result = res.data.data;
      for(const elem of result) {
        this.resources.push({
          Resource_code: elem.code,
          Resource_type: elem.resource_place_type?.code || '' ,
          Resource_info: elem.resource_place_type?.code || ''
        });
      }
    })
  }

  onSelectBuilding(): void {
    this.resources = [];
    const resourcesQuery = `
    {
      data: Resource_ResourceList {
        code: Code
        building_id: Building_id
        adress: Address
        resource_type: Resource_type
        resource_place_type: Resource_place_typeViaPlace_type_id {
          name: Name
          code: Code
        }
        building: BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: "${this.selectedBuilding}"}} ){
          name: Name
          code: Code
          address: Address
        }
      }
    }`;

    const bookinsgQuery = `{
      data: Booking_Booking_detailList {
        building_id: Building_id
        building: BuildingViaBuilding_id(joinType: INNER where: { Code: { EQ: "${this.selectedBuilding}" } }) {
          code: Code,
        }
        booking_id: Booking_id
        booking: BookingViaBooking_id {
          customer: CustomerViaCustomer_id {
            name: Name
            birth_date: Birth_date
            gender: GenderViaGender_id {
              code: Code
              name: Name
            }
            email: Email
            phones: Phones
            country: CountryViaCountry_id {
              name: Name
            }
          }
        }
        status: Status
        resource: ResourceViaResource_id{
          code: Code
        }
        date_from: Date_from
        date_to: Date_to
        lock: Lock
        flat_type: Resource_flat_typeViaFlat_type_id {
          code: Code
          name: Name
        }
        place_type: Resource_place_typeViaPlace_type_id {
          code: Code
          name: Name
        }
      }
    }`;

    this.getResourceList(resourcesQuery);
    this.getBookings(bookinsgQuery);
  }

  getBookings(query: string): void {
    this.bookings = [];
    this.apolloApi.getData(query).subscribe((response: any) => {
      const bookingList = response.data.data;
      for (const booking of bookingList) {
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
          Customer_phone: booking.booking.customer.phones
        })
      }

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
