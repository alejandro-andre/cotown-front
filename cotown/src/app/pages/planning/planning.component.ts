import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

import axiosApi from 'src/app/services/api.service';

import { AccessTokenService } from 'src/app/services/access-token.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { TimeChartRow } from 'src/app/time-chart/models/time-chart-row.model';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';

import { BuildingListByCityNameQuery, BuildingListQuery } from 'src/app/schemas/querie-definitions/building.query';
import { CityListQuery } from 'src/app/schemas/querie-definitions/city.query';
import {
  BookingList,
  BookingListByBuildingIdAndResourceAndFlatTypeQuery,
  BookingListByBuildingIdAndResourceFlatTypeQuery,
  BookingListByBuildingIdAndResourceTypeQuery,
  BookingListByBuildingIdQuery,
  BookingListByResourceTypeAndFlatQuery,
  BookingListByResourceTypeFlatQuery,
  BookingListByResourceTypeQuery,
  getBuildingDataWithBooking
} from 'src/app/schemas/querie-definitions/booking.query';

import {
  ResourceFlatTypeQuery,
  ResourceListByBuildingIdAndResourceFlatTypeQuery,
  ResourceListByBuildingIdAndResourceTypeAndFlatQuery,
  ResourceListByBuildingIdAndResourceTypeQuery,
  ResourceListByBuldingIdQuery,
  ResourceListByResourceFlatTypeQuery,
  ResourceListByResourceTypeAndFlatQuery,
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
  Params,
  Resource,
  ResourceType
} from 'src/app/constants/Interfaces';
import {
  formatDate,
  getAge,
  nextMonth,
  prevMonth
} from 'src/app/utils/utils';
import { LanguageService } from 'src/app/services/language.service';
import { WindowRef } from 'src/app/services/window-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningComponent {
  public spinnerActive: boolean = false;
  public rows: TimeChartRow[] = []; // Rows
  public cities: City [] = [] as City[]; // Cities
  public selectedCity: number = Constants.allStaticNumericValue; // Current city
  public buildings: Building[] = [] as Building[]; // Buildings
  public selectedBuildingId: number = -99; // Selected building
  public selectedBuilding: Building = {} as Building;
  public now: Date = new Date(); // Current date
  public resourceTypes: ResourceType [] = [] as ResourceType []; // Type of resources
  public resourceTypesFlat: ResourceType [] = [] as ResourceType [];
  public selectedResouceTypeId = Constants.allStaticNumericValue;
  public selectedResouceTypeFlatId=  Constants.allStaticNumericValue;
  public selectedResourceType: ResourceType = {} as ResourceType;
  public availableResources: string[] = [];
  public initDate!: Date;
  public endDate !: Date;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private resources: Resource[] = [] as Resource[] ; // Resources
  private bookings: any [] = []; // Bookings
  private params: Params = {} as Params;


  // Constructor
  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi,
    private _adapter: DateAdapter<any>,
    private language: LanguageService,
    private windowRef: WindowRef
  ) {
    this.now = new Date();
    this._adapter.setLocale(this.language.lang.substring(0,2));
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
        this.rows = [];
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

        this.generateRows();
      })
    }
  }

  async initData(bookingId: number) {
    const variables = {
      id: bookingId,
    };

    this.apolloApi.getData(getBuildingDataWithBooking, variables).subscribe( async(res) =>{
      if(res.data.bookings && res.data.bookings.length) {
        const data = res.data?.bookings[0];
        this.selectedBuildingId = parseInt(data.building_id);
        const finded = this.buildings.find((elem) => elem.id === this.selectedBuildingId);

        if(finded) {
          this.selectedCity = finded.location.city.id;
        }

        this.range.setValue({ start: new Date(data.date_from), end: new Date(data.date_to) });
        this.now = new Date(data.date_from)
        await this.getResourcesAndBookings();
        this.onDateChange()
      }
    });
  }

  async getAllBuildings(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
        resolve();
      });
    })

  }

  async getCities(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(CityListQuery).subscribe((result) => {
        this.cities = result.data.data;
        resolve();
      });
    })

  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const {  entityId, entity, attribute } = params;
      await this.getCities();
      await this.getAllBuildings();

      if(entityId) {
        const entityIdParsed = parseInt(entityId);
        this.initData(entityIdParsed);
        this.params.entityId = entityIdParsed;
      }

      if(entity) {
        this.params.entity = entity;
      }

      if(attribute) {
        this.params.attribute = attribute;
      }
    });
  }

  /**Getters */
  get cityName(): string {
    if (this.selectedCity) {
      const finded = this.cities.find((cit) => cit.id === this.selectedCity);
      return finded ? finded.name : ''
    }

    return '';
  }

  get isSelectButtonActive(): boolean {
    if(this.params && this.params.entityId !== undefined && this.params.value !== undefined) {
      return true;
    }

    return false;
  }

  get isSelectButtonVisible(): boolean {
    if(this.params && this.params.entityId === undefined) {
      return false;
    }

    return true;
  }

  getResourceType() :void {
    this.apolloApi.getData(ResourceTypeQuery).subscribe(res => {
      this.resourceTypes = res.data.data;
    })
  }

  getResourceTypeFlat(): void {
    this.apolloApi.getData(ResourceFlatTypeQuery).subscribe(res => {
      this.resourceTypesFlat = res.data.data;
    });
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
    this.rows = [];
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

  async applyResourceTypeFlatFilter():Promise<void> {
    // Remove all data
    this.bookings = [];
    this.resources = [];
    const variables = {
      resourceTypeFlatId: this.selectedResouceTypeFlatId
    };

    // Apply to all buildings
    if (this.selectedBuildingId === Constants.allStaticNumericValue) {
      // There are one type of room selected
      if (this.selectedResouceTypeId !== Constants.allStaticNumericValue) {

        const toSend = {
          ...variables,
          resourceTypeId: this.selectedResouceTypeId
        }

        await this.getResourceList(ResourceListByResourceTypeAndFlatQuery, toSend);
        this.getBookings(BookingListByResourceTypeAndFlatQuery, variables);

      } else { // No type of room selected
        await this.getResourceList(ResourceListByResourceFlatTypeQuery, variables);
        this.getBookings(BookingListByResourceTypeFlatQuery, variables);
      }
    } else { // building selected
      const varToSend = {
        ...variables,
        buildingId: this.selectedBuildingId,
      };

      if (this.selectedResouceTypeId !== Constants.allStaticNumericValue) {
        const toSend = {
          ...varToSend,
          resourceTypeId: this.selectedResouceTypeId
        }

        await this.getResourceList(ResourceListByBuildingIdAndResourceTypeAndFlatQuery, toSend);
        this.getBookings(BookingListByBuildingIdAndResourceAndFlatTypeQuery, toSend);
      } else {

        await this.getResourceList(ResourceListByBuildingIdAndResourceFlatTypeQuery, varToSend);
        this.getBookings(BookingListByBuildingIdAndResourceFlatTypeQuery, varToSend);
      }
    }
  }

  onSelectResourceTypeFlat(): void {
    this.spinnerActive = true;
    this.rows = [];
    this.resources = [];
    this.bookings = [];
    if (this.selectedResouceTypeFlatId === Constants.allStaticNumericValue) { // Dont use filter
      if(this.selectedResouceTypeId !== Constants.allStaticNumericValue) {
        this.applyResourceTypeFilter();
      } else {
        this.getResourcesAndBookings();
      }

    } else {
      this.applyResourceTypeFlatFilter();
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
      this.buildings = res.data.data;
    });
  }

  onSelectCity():void {
    this.rows = [];
    this.resources = [];
    this.bookings = [];
    this.selectedBuildingId = -99;

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
        this.getResourceTypeFlat();
        const result = res.data.data;
        for(const elem of result) {

          const type = elem.resource_type === 'piso' ? elem.flat.code : elem.resource_place_type?.code;

          this.resources.push({
            Resource_id: elem.id,
            Resource_code: elem.code,
            Resource_type: elem.resource_type,
            Resource_info: type || ''
          });
        }

        resolve();
      });
    });
  }

  async onSelectBulding() {
    this.spinnerActive = true;
    this.rows = [];
    this.resources = [];
    this.bookings = [];

    if (this.selectedResouceTypeFlatId === Constants.allStaticNumericValue){
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
    } else {
      this.applyResourceTypeFlatFilter();
    }

    if (this.initDate && this.endDate) {
      this.onDateChange();
    }
  }

  async getResourcesAndBookingsOfAllBuildings() {
    this.spinnerActive = true;
    this.resources = [];
    this.bookings = [];
    this.rows = [];

    await this.getResourceList(ResourceListQuery);
    this.getBookings(BookingList);
  }

  async getResourcesAndBookings(): Promise<void> {
    this.resources = [];
    this.bookings = [];
    this.rows = [];

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

  onSelectAvailable(available: { Code: string, id: number }){
    this.params.value = available;
  }

  getBookings(query: string, variables: ApolloVariables | undefined = undefined): void {
    this.bookings = [];
    this.apolloApi.getData(query, variables).subscribe((response: any) => {
      const bookingList = response.data.data;
      for (const booking of bookingList) {
        let age, email, phone, name, code;
        if (booking.booking && booking.booking.customer) {
          age = getAge(booking.booking.customer.birth_date);
          name = booking.booking?.customer.name;
          phone = booking.booking?.customer.phones;
          email = booking.booking?.customer.email;
          code = booking.booking_id
        }

        if (!booking.booking_id && booking.rooming && booking.group) {
          email = booking.group.customer.email;
          phone = booking.group.customer.phones;
          name = booking.group.customer.name
          code = `G${booking.group_id}`

          if(booking.room_user && booking.room_user.name !== null) {
            const aux = `${name} (${booking.room_user.name})`;
            name = aux;
          }
        }

        this.bookings.push({
          Booking_code: code,
          Booking_lock: booking.lock,
          Booking_status: booking.status,
          Booking_date_from: booking.date_from,
          Booking_date_to: booking.date_to,
          Resource_code: booking.resource?.code || '',
          Customer_name: name || '',
          Customer_gender: booking.booking?.customer.gender?.code || '',
          Customer_country: booking.booking?.customer.country.name || '',
          Customer_email: email || '',
          Customer_phone: phone || '',
          Customer_age: age || '',
        });
      }

      this.generateRows();
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

  // Generate rows for the time chart
  generateRows() {
    this.rows = [];
    let auxRow!: TimeChartRow;
    const auxRows= [];

    // Generate rows
    for (const r of this.resources) {
      auxRow = new TimeChartRow();
      auxRow.id = r.Resource_id;
      auxRow.code = r.Resource_code;
      auxRow.info = r.Resource_info
      auxRow.style = Constants.types[r.Resource_type];
        auxRows.push(auxRow);
    }

    this.rows = JSON.parse(JSON.stringify(auxRows));

    // Generate bars
    for (const b of this.bookings) {
      // Dates
      let bar: TimeChartBar = new TimeChartBar();
      bar.datefrom = new Date(b.Booking_date_from);
      bar.dateto = new Date(b.Booking_date_to);

      if (b.Booking_status === Constants.availableStatus) {
        bar.lock = true;
        bar.color = "rgba(100, 255, 100, 0.3)";
        bar.type = Constants.availableStatus;
      } else if (b.Booking_lock && !b.Booking_code) {
        bar.lock = true;
        bar.color = Constants.resourceNotAvailable.color
        bar.type = Constants.resourceNotAvailable.type;
      } else if (b.Booking_lock) { // Locking booking
        bar.lock = true;
        bar.color = Constants.blockedResource.color;
        bar.type = Constants.blockedResource.type;
      } else { // Real booking
        bar.lock = false;
        bar.code = b.Booking_code;
        bar.color = Constants.colors[b.Booking_status];
        bar.text = b.Customer_name
          + ' - ' + b.Customer_age
          + ' - ' + b.Customer_gender
          + ' - ' + b.Customer_country
        bar.tooltip = `
          <div><span class="tiphead">${b.Booking_code}</span></div>
          <div><span class="tipfield">${b.Booking_status}</span></div>
          <div><span class="tipfield">${b.Booking_date_from} a ${b.Booking_date_to}</span></div>
          <div><span class="tipfield">Nombre: </span><span>${b.Customer_name}</span></div>
          <div><span class="tipfield">Género: </span><span>${b.Customer_gender}</span></div>
          <div><span class="tipfield">Edad: </span><span>${b.Customer_age}</span></div>
          <div><span class="tipfield">País: </span><span>${b.Customer_country}</span></div>
          <div><span class="tipfield">Teléfono: </span><span>${b.Customer_phone}</span></div>
          <div><span class="tipfield">Email: </span><span>${b.Customer_email}</span></div>`
      }

      // Add bar to proper row
      for (const row of this.rows) {
        if (row.code == b.Resource_code) {
          row.bars.push(bar);
          break;
        }
      }
    }

    // Consolidate bars
    for (const row of this.rows) {
      if (row.bars.length > 1 && row.bars[0].lock) {
        row.bars = this.consolidateIntervals(row.bars);
      }
    }

    this.spinnerActive = false;
  }

  // Consolidate bookings for lock types
  consolidateIntervals(intervals: TimeChartBar[]) {

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

  closeWindow() {
    const opener = this.windowRef.nativeWindow.opener;
    if (opener != null) {
      opener.postMessage(this.params, "*");
    }
    this.windowRef.nativeWindow.close();
  }
}
