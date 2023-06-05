import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

import axiosApi from 'src/app/services/api.service';

import { LanguageService } from 'src/app/services/language.service';
import { WindowRef } from 'src/app/services/window-ref.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';

import { Constants } from 'src/app/constants/Constants';
import { formatDate, getAge, nextMonth, prevMonth } from 'src/app/utils/utils';

import { TimeChartRow } from 'src/app/time-chart/models/time-chart-row.model';
import { TimeChartBar } from 'src/app/time-chart/models/time-chart-bar.model';

import { CityListQuery } from 'src/app/schemas/query-definitions/city.query';
import { BuildingListByCityNameQuery, BuildingListQuery } from 'src/app/schemas/query-definitions/building.query';
import { ResourceFlatTypeQuery, ResourceListQuery, ResourcePlaceTypeQuery } from 'src/app/schemas/query-definitions/resource.query';
import { BookingListQuery, BuildingDataViaBooking, BuildingDataViaBookingGroup } from 'src/app/schemas/query-definitions/booking.query';

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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-home',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PlanningComponent {

  // Lists
  public cities: City [] = [] as City[]; // Cities
  public buildings: Building[] = [] as Building[]; // Buildings
  public resourcePlaceTypes: ResourceType [] = [] as ResourceType []; // Type of resources
  public resourceFlatTypes: ResourceType [] = [] as ResourceType [];
  public availableResources: number[] = [];
  public rooms: string [] = []; // Rooms
  private resources: Resource[] = [] as Resource[] ; // Resources
  private bookings: any [] = []; // Bookings

  // Selection params
  private params: Params = {} as Params;
  public sel: string = '';
  public max: number = 1;

  // Spinner
  public spinnerActive: boolean = false;

  // Planning
  public now: Date = new Date(); // Current date
  public rows: TimeChartRow[] = []; // Rows

  // Filters
  public initDate!: Date;
  public endDate !: Date;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public selectedCity: number = Constants.allStaticNumericValue; // Current city
  public selectedBuildingId: number = -99; // Selected building
  public selectedResourcePlaceTypeId = Constants.allStaticNumericValue;
  public selectedResourceFlatTypeId=  Constants.allStaticNumericValue;
  public initialResourcePlaceTypeId = Constants.allStaticNumericValue;
  public initialResourceFlatTypeId=  Constants.allStaticNumericValue;

  public selectedBuilding: Building = {} as Building;
  public selectedResourceType: ResourceType = {} as ResourceType;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private apolloApi: ApolloQueryApi,
    private adapter: DateAdapter<any>,
    private language: LanguageService,
    private windowRef: WindowRef,
    public dialog: MatDialog
  ) {
    // Current date
    this.now = new Date();

    // Set locale
    this.adapter.setLocale(this.language.lang.substring(0,2));
  }

  // On Init
  async ngOnInit() {

    // Get cities, buildings and types
    await this.getCities();
    await this.getBuildings();
    await this.getResourceFlatTypes();
    await this.getResourcePlaceTypes();

    // Get params
    this.route.queryParams.subscribe(async (params) => {
      const { sel, entityId, entity, attribute } = params;
      if (sel) {
        this.sel = sel;
      }
      if (entity) {
        this.params.entity = entity;
      }
      if (attribute) {
        this.params.attribute = attribute;
      }
      if (entityId) {
        const entityIdParsed = parseInt(entityId);
        this.params.entityId = entityIdParsed;
        this.initData(entity, entityIdParsed);
      }
    });

  }

  // ??
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

  // ************************************
  // Send selection to opener
  // ************************************

  closeWindow() {

    // Radio
    if (this.sel == '1') {
      for (const elemento of this.rows) {
        if (elemento.checked) {
          this.params.value = {id: elemento.id, Code: elemento.code};
          break;
        }
      }

    // Check
    } else  {
      this.params.value = [];
      for (const elemento of this.rows) {
        if (elemento.checked) {
          this.params.value.push(elemento.code);
        }
      }
    }

    console.log(this.params.value);
    
    // Check if change
    if (this.selectedResourceFlatTypeId != this.initialResourceFlatTypeId || this.selectedResourcePlaceTypeId != this.initialResourcePlaceTypeId) {

      // Type changed
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '450px',
      });   

      // Confimed
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const opener = this.windowRef.nativeWindow.opener;
          if (opener != null) {
            opener.postMessage(this.params, "*");
          }
          this.windowRef.nativeWindow.close();
          return;
        }
      });

    // Type not changed
    } else {
      const opener = this.windowRef.nativeWindow.opener;
      if (opener != null) {
        opener.postMessage(this.params, "*");
      }
      this.windowRef.nativeWindow.close();
    }

  }
  
  // Count selected items
  countSelected(): number {

    let n = 0;
    for (const elemento of this.rows) {
      if (elemento.checked)
        n = n + 1;
    }
    return n;

  }
  
  // ************************************
  // Move planning
  // ************************************

  goBackward(type: string) {
    if (type === 'week'){
      const date = new Date(this.now.getTime() - (1000*60*60*24*7));
      this.now = date;
    } else if (type === 'month'){
      const date= prevMonth(this.now);
      this.now = date;
    }
  }

  goForward(type: string) {
    if (type === 'week') {
      const date = new Date(this.now.getTime() + (1000*60*60*24*7));
      this.now = date;
    } else if (type === 'month') {
      const date = nextMonth(this.now);
      this.now = date;
    }
  }

  // ************************************
  // Get data functions
  // ************************************

  // Initialize data
  async initData(entity: string, bookingId: number) {

    // Query (single o group booking)
    let q =  BuildingDataViaBooking;
    if (entity == 'Booking.Booking_group') {
      q =  BuildingDataViaBookingGroup;
    }

    // Get data
    this.selectedResourceFlatTypeId = Constants.allStaticNumericValue;
    this.selectedResourcePlaceTypeId = Constants.allStaticNumericValue;
    this.apolloApi.getData(q, { id: bookingId, }).subscribe( async(res) =>{
      if (res.data.data && res.data.data.length) {
        const data = res.data?.data[0];

        // Set filters
        this.selectedBuildingId = parseInt(data.building_id);
        if (data.flat_type_id != undefined)
          this.selectedResourceFlatTypeId = parseInt(data.flat_type_id);
        if (data.place_type_id != undefined)
          this.selectedResourcePlaceTypeId = parseInt(data.place_type_id);
        this.initialResourceFlatTypeId = this.selectedResourceFlatTypeId;
        this.initialResourcePlaceTypeId = this.selectedResourcePlaceTypeId;
        this.range.setValue({ start: new Date(data.date_from), end: new Date(data.date_to) });
        const finded = this.buildings.find((elem) => elem.id === this.selectedBuildingId);
        if (finded) {
          this.selectedCity = finded.location.city.id;
        }
        this.now = new Date(data.date_from)
        if (data.rooms)
          this.rooms = data.rooms;
        this.max = data.max;

        // Load resources and bookings
        await this.getResourcesAndBookings();

        // Move to current date
        this.onDateChange()
      }
    });
  }

  // Load all cities
  async getCities(): Promise<void> {

    return new Promise<void>((resolve) => {
      this.apolloApi.getData(CityListQuery).subscribe((result) => {
        this.cities = result.data.data;
        resolve();
      });
    })

  }

  // Get all buildings
  async getBuildings(): Promise<void> {

    return new Promise<void>((resolve) => {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
        resolve();
      });
    })

  }

  // Get city buildings
  getBuildingsByCityName():void {

    const variables = { cityName: this.cityName };
    this.apolloApi.getData(BuildingListByCityNameQuery, variables).subscribe(res => {
      this.buildings = res.data.data;
    });

  }

  // Get all flat types
  getResourceFlatTypes(): void {

    this.apolloApi.getData(ResourceFlatTypeQuery).subscribe(res => {
      this.resourceFlatTypes = res.data.data;
    });

  }

  // Get all place types
  getResourcePlaceTypes() :void {

    this.apolloApi.getData(ResourcePlaceTypeQuery).subscribe(res => {
      this.resourcePlaceTypes = res.data.data;
    })

  }

  // Load all resources and bookings
  async getResourcesAndBookings(): Promise<void> {

    // Clean
    this.resources = [];
    this.bookings = [];
    this.rows = [];

    // Query
    await this.queryResources();
    this.queryBookings();
  }

  // Get filtered resources
  async queryResources() {

    let params = '';
    let where = ''

    if (this.selectedBuildingId > 0) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$buildingId: Int'
      where += 'Building_id: { EQ: $buildingId }'
    }

    if (this.selectedResourceFlatTypeId != Constants.allStaticNumericValue) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$resourceFlatTypeId: Int'
      where += 'Flat_type_id: { EQ: $resourceFlatTypeId }'
    }

    if (this.selectedResourcePlaceTypeId != Constants.allStaticNumericValue) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$resourcePlaceTypeId: Int'
      where += 'Place_type_id: { EQ: $resourcePlaceTypeId }'
    }

    if (params != '')  {
      this.spinnerActive = true;
      const q = 'query ResourceList(' + params + ') {data:Resource_ResourceList(orderBy: [{attribute: Code, direction:ASC, nullsGo: FIRST}],where:{' + where + '})' + ResourceListQuery + '}';
      await this.getResources(q, {
        buildingId: this.selectedBuildingId,
        resourceFlatTypeId: this.selectedResourceFlatTypeId,
        resourcePlaceTypeId: this.selectedResourcePlaceTypeId
      });
    }
  }

  // Get filtered bookings
  queryBookings(): void {

    let params = '';
    let where = ''

    if (this.selectedBuildingId > 0) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$buildingId: Int'
      where += 'Building_id: { EQ: $buildingId }'
    }

    if (this.selectedResourceFlatTypeId != Constants.allStaticNumericValue) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$resourceFlatTypeId: Int'
      where += 'Flat_type_id: { EQ: $resourceFlatTypeId }'
    }

    if (this.selectedResourcePlaceTypeId != Constants.allStaticNumericValue) {
      if (params != '') params += ','
      if (where != '') where += ','
      params += '$resourcePlaceTypeId: Int'
      where += 'Place_type_id: { EQ: $resourcePlaceTypeId }'
    }

    if (params != '')  {
      const q = 'query BookingList(' + params + ') {data:Booking_Booking_detailList(where:{' + where + '})' + BookingListQuery + '}';
      this.getBookings(q, {
        buildingId: this.selectedBuildingId,
        resourceFlatTypeId: this.selectedResourceFlatTypeId,
        resourcePlaceTypeId: this.selectedResourcePlaceTypeId
      });
    }
  }

  // Get filtered resources
  async getResources(query: string, variables: ApolloVariables | undefined = undefined): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apolloApi.getData(query, variables).subscribe((res: any) => {
        for (const elem of res.data.data) {
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

  // Get filtered bookings
  getBookings(query: string, variables: ApolloVariables | undefined = undefined): void {
    this.bookings = [];
    this.apolloApi.getData(query, variables).subscribe((response: any) => {
      for (const booking of response.data.data) {
        let age, email, phone, name, code;

        // Bookings
        if (booking.booking && booking.booking.customer) {
          age = getAge(booking.booking.customer.birth_date);
          name = booking.booking?.customer.name;
          phone = booking.booking?.customer.phones;
          email = booking.booking?.customer.email;
          code = booking.booking_id
        }

        // Group bookings
        if (!booking.booking_id && booking.rooming && booking.group) {
          email = booking.group.customer.email;
          phone = booking.group.customer.phones;
          name = booking.group.customer.name
          code = `G${booking.group_id}`
          if (booking.room_user && booking.room_user.name !== null) {
            const aux = `${name} (${booking.room_user.name})`;
            name = aux;
          }
        }

        // Store each booking
        this.bookings.push({
          Booking_code: code,
          Booking_lock: booking.lock,
          Booking_status: booking.status,
          Booking_date_from: booking.date_from,
          Booking_date_to: booking.date_to,
          Resource_id: booking.resource?.id || 0,
          Resource_code: booking.resource?.code || '',
          Customer_name: name || '',
          Customer_gender: booking.booking?.customer.gender?.code || '',
          Customer_country: booking.booking?.customer.country?.name || '',
          Customer_email: email || '',
          Customer_phone: phone || '',
          Customer_age: age || '',
        });
      }

      // Generate planning rows
      this.generateRows();

    });
  }

  // ************************************
  // Planning functions
  // ************************************

  // Generate rows for the time chart
  generateRows() {

    this.rows = [];
    const auxRows= [];
    let auxRow!: TimeChartRow;

    // Generate rows
    for (const r of this.resources) {
      auxRow = new TimeChartRow();
      auxRow.id = r.Resource_id;
      auxRow.code = r.Resource_code;
      auxRow.info = r.Resource_info
      auxRow.style = Constants.types[r.Resource_type];
      if (this.rooms.includes(r.Resource_code)) {
        auxRow.selected = true;
        auxRow.checked = true;
      }
      auxRows.push(auxRow);
    }

    this.rows = JSON.parse(JSON.stringify(auxRows));

    // Generate bars
    for (const b of this.bookings) {
      // Dates
      let bar: TimeChartBar = new TimeChartBar();
      bar.datefrom = new Date(b.Booking_date_from);
      bar.dateto = new Date(b.Booking_date_to);

      if (b.Booking_status === Constants.availableStatus) { // Resource is available
        bar.lock = true;
        bar.color = "rgba(100, 255, 100, 0.3)";
        bar.type = Constants.availableStatus;
      } else if (b.Booking_lock && !b.Booking_code) { // Resource lock
        bar.lock = true;
        bar.code = b.Booking_status;
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
        if (!this.isSelectButtonVisible) {
          if (typeof bar.code != 'number')
            bar.link = "/admin/Booking.Booking_group/" + bar.code.substring(1) + "/view";
          else
            bar.link = "/admin/Booking.Booking/" + bar.code + "/view";
        }
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

  // ************************************
  // Getters
  // ************************************

  get cityName(): string {
    if (this.selectedCity) {
      const finded = this.cities.find((cit) => cit.id === this.selectedCity);
      return finded ? finded.name : ''
    }
    return '';
  }

  get isSelectButtonActive(): boolean {
    if (this.params && this.params.entityId !== undefined && (this.sel == 'n' || this.countSelected() > 0)) {
      return true;
    }
    return false;
  }

  get isSelectButtonVisible(): boolean {
    if (this.params && this.params.entityId === undefined) {
      return false;
    }
    return true;
  }

  // ************************************
  // Event handlers
  // ************************************

  // Date range change
  onDateChange() {

    if (this.range.valid && this.range.value &&this.range.value.start && this.range.value.end ) {

      // Clean
      this.cleanBookings();
      this.initDate = new Date(this.range.value.start);
      this.endDate = new Date(this.range.value.end);

      // Availability payload
      const data: AvailabilityPayload = {
        date_from: formatDate(this.initDate),
        date_to: formatDate(this.endDate),
        building: this.selectedBuildingId,
        flat_type: 0,
        place_type: 0
      };
      if (this.selectedResourceFlatTypeId !== Constants.allStaticNumericValue) {
        data.flat_type = this.selectedResourceFlatTypeId
      }
      if (this.selectedResourcePlaceTypeId !== Constants.allStaticNumericValue) {
        data.place_type = this.selectedResourcePlaceTypeId
      }

      // Get availability
      axiosApi.getAvailability(data, this.apolloApi.token).then((resp) => {
        this.availableResources = resp.data;
        this.rows = [];
        for (const available of this.availableResources) {
          const finded: number = this.bookings.findIndex((elem: Booking) => elem.Resource_id === available);
          if (finded >= 0){
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

        // Generate planning
        this.generateRows();
      })
    }

  }

  // City change
  onSelectCity():void {

    // Clean
    this.selectedBuildingId = -99;
    this.resources = [];
    this.bookings = [];
    this.rows = [];

    // Filter
    if (this.selectedCity === Constants.allStaticNumericValue) {
      this.getBuildings();
    } else {
      this.getBuildingsByCityName();
    }
  }

  // Building change
  async onChangeFilter() {

    // Filter
    this.getResourcesAndBookings();

    // Move to date
    if (this.initDate && this.endDate) {
      this.onDateChange();
    }
  }

}
