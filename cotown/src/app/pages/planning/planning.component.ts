import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

import axiosApi from 'src/app/services/api.service';

import { AccessTokenService } from 'src/app/services/access-token.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';
import { TimeChartLine } from 'src/app/time-chart/models/time-chart-line.model';

import { BuildingListByCityNameQuery, BuildingListQuery } from 'src/app/schemas/querie-definitions/building.query';
import { CityListQuery } from 'src/app/schemas/querie-definitions/city.query';
import {
  BookingList,
  BookingListByBuildingIdAndResourceTypeQuery,
  BookingListByBuildingIdQuery,
  BookingListByResourceTypeQuery,
  getBuildingDataWithBooking
} from 'src/app/schemas/querie-definitions/booking.query';

import {
  ResourceListByBuildingIdAndResourceTypeQuery,
  ResourceListByBuldingIdQuery,
  ResourceListByResourceTypeQuery,
  ResourceListQuery,
  ResourceTypeQuery
} from 'src/app/schemas/querie-definitions/resource.query';

import { Constants } from 'src/app/constants/Constants';
import {
  ApolloVariables,
  AvailabilityPayload,
  Booking,
  Building,
  City,
  Resource,
  ResourceType
} from 'src/app/constants/Interfaces';
import {
  formatDate,
  getAge,
  nextMonth,
  orderByName,
  prevMonth
} from 'src/app/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningComponent {
  public spinnerActive: boolean = false;
  public bars: TimeChartBar[] = []; // Bars
  public cities: City [] = [] as City[]; // Cities
  public selectedCity: number = Constants.allStaticNumericValue; // Current city
  public buildings: Building[] = [] as Building[]; // Buildings
  public selectedBuildingId: number = Constants.allStaticNumericValue; // Selected building
  public selectedBuilding: Building = {} as Building;
  public now: Date = new Date(); // Current date
  public resourceTypes: ResourceType [] = [] as ResourceType []; // Type of resources
  public selectedResouceTypeId = Constants.allStaticNumericValue;
  public selectedResourceType: ResourceType = {} as ResourceType;
  public availableResources: string[] = [];
  public initDate!: Date;
  public endDate !: Date;
  public lang: string = Constants.defaultLanguage;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private resources: Resource[] = [] as Resource[] ; // Resources
  private bookings: any [] = []; // Bookings

  // Constructor
  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi,
    private _adapter: DateAdapter<any>
  ) {
    this.now = new Date();
    this._adapter.setLocale(this.lang);
  }

  cleanBookings() {
    const newBookings = [];
    for (let i = 0; i < this.bookings.length; i++) {
      const book = this.bookings[i];
      if (book.Booking_status !== Constants.availableStatus) {
        newBookings.push(book);
      }
    }

    this.bookings = JSON.parse(JSON.stringify(newBookings));
  }

  onDateChange() {
    if (this.range.valid && this.range.value &&this.range.value.start && this.range.value.end ) {
      this.cleanBookings();
      this.initDate = new Date(this.range.value.start);
      this.endDate = new Date(this.range.value.end);

      const data: AvailabilityPayload = {
        date_from: formatDate(this.initDate),
        date_to: formatDate(this.endDate),
        building: this.selectedBuilding.code,
      };

      if (this.selectedResouceTypeId !== Constants.allStaticNumericValue) {
        data.place_type = this.selectedResourceType.code;
      }

      axiosApi.getAvailability(data).then((resp) => {
        this.availableResources = resp.data;
        this.bars = [];
        for(const available of this.availableResources) {
          const finded: number = this.bookings.findIndex((elem: Booking) => elem.Resource_code === available);
          if(finded >= 0){
            this.bookings.push({
              ...this.bookings[finded],
              Booking_status: Constants.availableStatus,
              Booking_date_to: data.date_to,
              Booking_date_from: data.date_from,
            });
          } else {
            this.bookings.push({
              Resource_code: available,
              Booking_status: Constants.availableStatus,
              Booking_date_to: data.date_to,
              Booking_date_from: data.date_from,

            });
          }
        }

        this.generateBars();
      })
    }
  }

  // TODO use only on development mode
  login() {
    this.apolloApi.login().subscribe((res: any) => {
      this.accessToken.token = res.data.login;
      this.getCities();
      this.getAllBuildings();
      this.getResourcesAndBookingsOfAllBuildings();
    })
  }

  async initData(bookingId: number) {
    const variables = {
      id: bookingId,
    };

    this.apolloApi.getData(getBuildingDataWithBooking, variables).subscribe( async(res) =>{
      if(res.data.bookings) {
        const data = res.data?.bookings[0];
        this.selectedBuildingId = parseInt(data.building_id);
        const finded = this.buildings.find((elem) => elem.id === this.selectedBuildingId);

        if(finded) {
          this.selectedCity = finded.location.city.id;
        }

        this.range.setValue({ start: new Date(data.date_from), end: new Date(data.date_to) });
        await this.getResourcesAndBookings();
      }
    });
  }

  async getAllBuildings(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = orderByName(res.data.data);
        resolve();
      });
    })

  }

  async getCities(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(CityListQuery).subscribe((result) => {
        this.cities = orderByName(result.data.data);
        resolve();
      });
    })

  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const { language, entityId, accessToken } = params;
      this.lang = language;
      this.accessToken.token = accessToken;
      await this.getCities();
      await this.getAllBuildings();
      this.initData(parseInt(entityId));
    });
    // this.login();
  }

  get cityName(): string {
    if (this.selectedCity) {
      const finded = this.cities.find((cit) => cit.id === this.selectedCity);
      return finded ? finded.name : ''
    }

    return '';
  }

  getResourceType() :void {
    this.apolloApi.getData(ResourceTypeQuery).subscribe(res => {
      this.resourceTypes = res.data.data;
    })
  }

  async applyResourceTypeFilter():Promise<void> {
    // Remove all data
    this.bookings = [];
    this.resources = [];
    const variables = {
      resourceTypeId: this.selectedResouceTypeId
    };

    if (this.selectedBuildingId === Constants.allStaticNumericValue) {
      await this.getResourceList(ResourceListByResourceTypeQuery, variables);
      this.getBookings(BookingListByResourceTypeQuery, variables);
    } else {
      const varToSend = {
        ...variables,
        buildingId: this.selectedBuildingId,
      }
      await this.getResourceList(ResourceListByBuildingIdAndResourceTypeQuery, varToSend);
      this.getBookings(BookingListByBuildingIdAndResourceTypeQuery, varToSend);
    }
  }

  onSelectResourceType(): void {
    this.spinnerActive = true;
    this.bars = [];
    this.resources = [];
    this.bookings = [];
    if (this.selectedResouceTypeId === Constants.allStaticNumericValue) { // Dont use filter
      this.getResourcesAndBookings();
    } else {
      const findedResourceType = this.resourceTypes.find((elem:ResourceType) =>elem.id === this.selectedResouceTypeId);
      this.selectedResourceType = findedResourceType!;
      this.applyResourceTypeFilter();
    }

    if (this.initDate && this.endDate) {
      this.onDateChange();
    }
  }

  getBuildingsByCityName():void {
    const variables = {
      cityName: this.cityName
    };

    this.apolloApi.getData(BuildingListByCityNameQuery, variables).subscribe(res => {
      this.buildings = orderByName(res.data.data);
    });
  }

  onSelectCity():void {
    this.bars = [];
    this.resources = [];
    this.bookings = [];
    this.selectedBuildingId = -1;

    if (this.selectedCity === Constants.allStaticNumericValue) {
      this.getAllBuildings();
    } else {
      this.getBuildingsByCityName();
    }
  }

  async getResourceList(query: string, variables: ApolloVariables | undefined = undefined): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(query, variables).subscribe((res: any) => {
        this.getResourceType();
        const result = res.data.data;
        for(const elem of result) {
          this.resources.push({
            Resource_id: elem.id,
            Resource_code: elem.code,
            Resource_type: elem.resource_type,
            Resource_info: elem.resource_place_type?.code || ''
          });
        }

        resolve();
      });
    });
  }

  async onSelectBulding() {
    this.spinnerActive = true;
    if (
      this.selectedBuildingId === Constants.allStaticNumericValue &&
      this.selectedResouceTypeId === Constants.allStaticNumericValue
    ) {
      await this.getResourcesAndBookingsOfAllBuildings();
    } else {
      const building = this.buildings.find((elem) => elem.id === this.selectedBuildingId);
      if (building) {
        this.selectedBuilding = { ...building };
      }

      if (this.selectedResouceTypeId !== Constants.allStaticNumericValue) {
        await this.applyResourceTypeFilter();
      } else {
        await this.getResourcesAndBookings();
      }
    }

    if (this.initDate && this.endDate) {
      this.onDateChange();
    }
  }

  async getResourcesAndBookingsOfAllBuildings() {
    this.spinnerActive = true;
    this.resources = [];
    this.bookings = [];
    this.bars = [];

    await this.getResourceList(ResourceListQuery);
    this.getBookings(BookingList);
  }

  async getResourcesAndBookings(): Promise<void> {
    this.resources = [];
    this.bookings = [];
    this.bars = [];

    if (this.selectedBuildingId === Constants.allStaticNumericValue) {
      await this.getResourcesAndBookingsOfAllBuildings();
    } else {
      const variables = {
          buildingId: this.selectedBuildingId
      };

      await this.getResourceList(ResourceListByBuldingIdQuery, variables );
      this.getBookings(BookingListByBuildingIdQuery, variables);
    }
  }

  onSelectAvailable(resourceId: number){
    console.log('IM on onselectAvailable phather', resourceId);
  }

  getBookings(query: string, variables: ApolloVariables | undefined = undefined): void {
    this.bookings = [];
    this.apolloApi.getData(query, variables).subscribe((response: any) => {
      const bookingList = response.data.data;
      for (const booking of bookingList) {
        let age;
        if (booking.booking && booking.booking.customer) {
          age = getAge(booking.booking.customer.birth_date);
        }

        this.bookings.push({
          Booking_code: booking.booking_id,
          Booking_lock: booking.lock,
          Booking_status: booking.status,
          Booking_date_from: booking.date_from,
          Booking_date_to: booking.date_to,
          Resource_code: booking.resource?.code || '',
          Customer_name: booking.booking?.customer.name|| '',
          Customer_gender: booking.booking?.customer.gender?.code || '',
          Customer_country: booking.booking?.customer.country.name || '',
          Customer_email: booking.booking?.customer.email || '',
          Customer_phone: booking.booking?.customer.phones || '',
          Customer_age: age,
          Customer_last_name: booking.booking?.customer.last_name || ''
        });
      }

      this.generateBars();
    });
  }

  goBackward(type: string) {
    if(type === 'week'){
      const date = new Date(this.now.getTime() - (1000*60*60*24*7));
      this.now = date;
    } else if(type === 'month'){
      const date= prevMonth(this.now);
      this.now = date;
    }
  }

  // Go 1 week forward
  goForward(type: string) {
    if(type === 'week') {
      const date = new Date(this.now.getTime() + (1000*60*60*24*7));
      this.now = date;
    } else if (type === 'month') {
      const date = nextMonth(this.now);
      this.now = date;
    }
  }

  // Generate bars for the time chart
  generateBars() {
    this.bars = [];
    let auxBar!: TimeChartBar;
    const auxBars= [];

    // Generate bars
    for (const r of this.resources) {
      auxBar = new TimeChartBar();
      auxBar.id = r.Resource_id;
      auxBar.code = r.Resource_code;
      auxBar.info = r.Resource_info
      auxBar.style = Constants.types[r.Resource_type];
        auxBars.push(auxBar);
    }

    this.bars = JSON.parse(JSON.stringify(auxBars));

    // Generate lines
    for (const b of this.bookings) {
      // Dates
      let line: TimeChartLine = new TimeChartLine();
      line.datefrom = new Date(b.Booking_date_from);
      line.dateto = new Date(b.Booking_date_to);

      if (b.Booking_status === Constants.availableStatus) {
        line.lock = true;
        line.color = "rgba(100, 255, 100, 0.3)";
        line.type = Constants.availableStatus;
      }  else if (b.Booking_lock && !b.Booking_code) {
        line.lock = true;
        line.color = Constants.resourceNotAvailable.color
        line.type = Constants.resourceNotAvailable.type;
      } else if (b.Booking_lock) { // Locking booking
        line.lock = true;
        line.color = Constants.blockedResource.color;
        line.type = Constants.blockedResource.type;
      } else { // Real booking
        line.lock = false;
        line.code = b.Booking_code;
        line.color = Constants.colors[b.Booking_status];
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

    this.spinnerActive = false;
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
