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
import { BuildingListByLocationQuery, BuildingListQuery } from 'src/app/schemas/query-definitions/building.query';
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
  public labels: any = null;

  // Filters
  public initDate!: Date;
  public endDate !: Date;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public selectedCityId: number = Constants.allStaticNumericValue; // Current city
  public selectedBuildingId: number = -99; // Selected building
  public selectedResourcePlaceTypeId = Constants.allStaticNumericValue;
  public selectedResourceFlatTypeId=  Constants.allStaticNumericValue;
  public initialPlaceTypeId = Constants.allStaticNumericValue;
  public initialFlatTypeId=  Constants.allStaticNumericValue;
  public initialResourcePlaceType: string = '';
  public initialResourceFlatType: string =  '';

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

    // Get labels
    axiosApi.getLabels(7, "es_ES", this.apolloApi.token).then((res) => { 
      this.labels = res.data;
      axiosApi.getLabels(13, "es_ES", this.apolloApi.token).then((res) => { 
        this.labels[0].push(...res.data[0])
        this.labels[1].push(...res.data[1])
        this.spinnerActive  = false;
      }); 
    }); 

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
        await this.initData(entity, entityIdParsed);
      }
    });

  }

  getLabel(code: string) {
    if (!this.labels)
      return "";
    const index = this.labels[0].indexOf(code);
    if (index === -1) { 
        return "";
    }
    return this.labels[1][index];
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

    let resource = null;

    // Radio
    if (this.sel == '1') {
      for (const elemento of this.rows) {
        if (elemento.checked) {
          resource = this.resources.find((e) => e.Resource_id === elemento.id);
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

    // Check if change
    if (resource && (resource.Resource_flat_type != this.initialFlatTypeId || resource.Resource_place_type!= this.initialPlaceTypeId)) {

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
      let date = new Date(this.now.getTime() - (1000*60*60*24*7));
      this.now = date;
    } else if (type === 'month'){
      let date= prevMonth(this.now);
      this.now = date;
    }
  }

  goForward(type: string) {
    if (type === 'week') {
      let date = new Date(this.now.getTime() + (1000*60*60*24*7));
      this.now = date;
    } else if (type === 'month') {
      let date = nextMonth(this.now);
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
        if (data.flat_type_id != undefined) {
          this.initialFlatTypeId = data.flat_type_id;
        }
        if (data.place_type_id != undefined) {
          this.initialPlaceTypeId = data.place_type_id;
        }
        this.initialResourceFlatType = this.resourceFlatTypes.find((e) => e.id == this.initialFlatTypeId)?.code || '';
        this.initialResourcePlaceType = this.resourcePlaceTypes.find((e) => e.id == this.initialPlaceTypeId)?.code || '';
        this.range.setValue({ start: new Date(data.date_from), end: new Date(data.date_to) });
        const finded = this.buildings.find((elem) => elem.id === this.selectedBuildingId);
        if (finded) {
          this.selectedCityId = finded.location.city.id;
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
  async getCities() {
    this.apolloApi.getData(CityListQuery).subscribe((result) => {
      this.cities = result.data.data;
    });
  }

  // Get all buildings
  async getBuildings(): Promise<void> {
    if (this.selectedCityId == Constants.allStaticNumericValue) {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
      });
    } else {
      const variables = { id: this.selectedCityId };
      this.apolloApi.getData(BuildingListByLocationQuery, variables).subscribe(res => {
        this.buildings = res.data.data;
      });
    }
  }

  // Get all flat types
  async getResourceFlatTypes(): Promise<void> {
    this.apolloApi.getData(ResourceFlatTypeQuery).subscribe(res => {
      this.resourceFlatTypes = res.data.data;
    });
  }

  // Get all place types
  async getResourcePlaceTypes(): Promise<void> {
    this.apolloApi.getData(ResourcePlaceTypeQuery).subscribe(res => {
      this.resourcePlaceTypes = res.data.data;
    });
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

    let params = '$cityId: Int';
    let where = ''

    if (this.selectedBuildingId > 0) {
      params += ' $buildingId: Int'
      where += ' Building_id: { EQ: $buildingId }'
    }

    if (this.selectedBuildingId > 0) {
      params += ' $buildingId: Int'
      where += ' Building_id: { EQ: $buildingId }'
    }

    if (this.selectedResourceFlatTypeId != Constants.allStaticNumericValue) {
      params += ' $resourceFlatTypeId: Int'
      where += ' Flat_type_id: { EQ: $resourceFlatTypeId }'
    }

    if (this.selectedResourcePlaceTypeId != Constants.allStaticNumericValue) {
      params += ' $resourcePlaceTypeId: Int'
      where += ' Place_type_id: { EQ: $resourcePlaceTypeId }'
    }

    if (where != '')
      where = 'where:{' + where + '}';

    if (params != '')  {
      this.spinnerActive = true;
      const q = 'query ResourceList(' + params + ') {data:Resource_ResourceList(orderBy: [{attribute: Code direction: ASC nullsGo: FIRST}] ' + where + ')' + ResourceListQuery + '}';
      await this.getResources(q, {
        cityId: this.selectedCityId,
        buildingId: this.selectedBuildingId,
        resourceFlatTypeId: this.selectedResourceFlatTypeId,
        resourcePlaceTypeId: this.selectedResourcePlaceTypeId
      });
    }
  }

  // Get filtered bookings
  queryBookings(): void {

    // One month ago
    const date = new Date();
    date.setTime(date.getTime() - 30 * 24 * 60 * 60 * 1000);

    // GraphQL params
    let params = '$date: String $cityId: Int';
    let where = 'Date_to: { GE: $date }'
    let whereplace = ''
    if (this.selectedBuildingId > 0) {
      params += ' $buildingId: Int'
      where += ' Building_id: { EQ: $buildingId }'
    }
    if (this.selectedResourceFlatTypeId != Constants.allStaticNumericValue) {
      params += ' $resourceFlatTypeId: Int'
      whereplace += 'Flat_type_id: { EQ: $resourceFlatTypeId }'
    }
    if (this.selectedResourcePlaceTypeId != Constants.allStaticNumericValue) {
      params += ' $resourcePlaceTypeId: Int'
      whereplace += 'Place_type_id: { EQ: $resourcePlaceTypeId }'
    }
    if (where != '')
      where = '(where: { ' + where + ' })';
    if (whereplace != '')
      whereplace = 'where: { ' + whereplace + ' }';
    if (params != '')  {
      const q = BookingListQuery
        .replace('[[params]]', params)
        .replace('[[where]]', where)
        .replace('[[whereplace]]', whereplace);
      const v = {
        date: formatDate(date, 'YMD'),
        cityId: this.selectedCityId,
        buildingId: this.selectedBuildingId,
        resourceFlatTypeId: this.selectedResourceFlatTypeId,
        resourcePlaceTypeId: this.selectedResourcePlaceTypeId
      };
      this.getBookings(q, v);
    }
  }

  // Get filtered resources
  async getResources(query: string, variables: ApolloVariables | undefined = undefined): Promise<void> {
    this.apolloApi.getData(query, variables).subscribe((res: any) => {
      for (const elem of res.data.data) {
        const type = elem.resource_type === 'piso' ? elem.flat_type.code : elem.place_type?.code;
        this.resources.push({
          Resource_id: elem.id,
          Resource_code: elem.code,
          Resource_type: elem.resource_type,
          Resource_flat_type: elem.flat_type.id,
          Resource_place_type: elem.place_type?.id || -1,
          Resource_info: type || '',
          Resource_notes: elem.notes || ''
        });
      }
    });
  }

  // Get filtered bookings
  getBookings(query: string, variables: ApolloVariables | undefined = undefined): void {
    this.bookings = [];
    this.apolloApi.getData(query, variables).subscribe((response: any) => {
      for (const booking of response.data.data) {

        // Bookings
        let age, email, phone, name, code;
        if (booking.booking && booking.booking.customer) {
          age = getAge(booking.booking.customer.birth_date);
          name = booking.booking?.customer.name;
          phone = booking.booking?.customer.phones;
          email = booking.booking?.customer.email;
          code = booking.booking_id
        }

        // Group bookings
        if (!booking.booking_id && booking.rooms && booking.group) {
          email = booking.group.customer?.email;
          phone = booking.group.customer?.phones;
          name = booking.group.customer?.name
          code = `G${booking.group.id}`
          if (booking.rooms && booking.rooms.name !== null) {
            const aux = `${name} (${booking.rooms.name})`;
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
          Booking_check_in: booking.booking?.check_in,
          Booking_check_out: booking.booking?.check_out,
          Booking_comments: booking.booking?.comments || '',
          Resource_id: booking.resource?.id || 0,
          Resource_code: booking.resource?.code || '',
          Customer_name: name || '',
          Customer_gender: booking.booking?.customer.gender?.code || '',
          Customer_country: booking.booking?.customer.country?.name || '',
          Customer_nationality: booking.booking?.customer.nationality?.name || '',
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
      auxRow.info = r.Resource_info;
      auxRow.notes = r.Resource_notes;
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

      // Initial status
      bar.lock = false;
      bar.available = true;

      // Resource is available (selecting candidates)
      if (b.Booking_status === Constants.availableStatus) { 
        bar.lock = true;
        bar.color = "rgba(100, 255, 100, 0.3)";
        bar.type = Constants.availableStatus;

      // Resource not available (Capex, Out...)
      } else if (b.Booking_lock && !b.Booking_code) { 
        bar.lock = true;
        bar.available = false;
        bar.code = b.Booking_status;
        bar.color = Constants.resourceNotAvailable.color
        bar.type = Constants.resourceNotAvailable.type;
      
      // Resource locked by a booking
      } else if (b.Booking_lock) {
        bar.lock = true;
        bar.color = Constants.blockedResource.color;
        bar.type = Constants.blockedResource.type;

      // Real booking        
      } else { 
        bar.code = b.Booking_code;
        bar.color = Constants.colors[b.Booking_status];
        if (b.Booking_check_in)
          bar.checkIn = new Date(b.Booking_check_in);
        if (b.Booking_check_out != null)
          bar.checkOut = new Date(b.Booking_check_out);
        if (!this.isSelectButtonVisible) {
          if (typeof bar.code != 'number')
            bar.link = "/admin/Booking.Booking_group/" + bar.code.substring(1) + "/view";
          else
            bar.link = "/admin/Booking.Booking/" + bar.code + "/view";
        }
        bar.text = b.Customer_name
          + ' - ' + b.Customer_age
          + ' - ' + b.Customer_gender
          + ' - ' + b.Customer_nationality
          + ' - ' + b.Booking_comments
        const dfrom = formatDate(new Date(b.Booking_date_from), 'DMY');
        const dto   = formatDate(new Date(b.Booking_date_to), 'DMY');
        const din   = b.Booking_check_in ? formatDate(new Date(b.Booking_check_in), 'DMY') : '--/--/----';
        const dout  = b.Booking_check_out ? formatDate(new Date(b.Booking_check_out), 'DMY') : '--/--/----';
        const tip = this.getLabel(b.Booking_status)
        bar.tooltip = `
          <table>
          <tr><td></td><td><span style="font-size: 1.1em;font-weight: 600;">${b.Booking_code}</span></td></tr>
          <tr><td><b>Status</b></td><td><span>${tip}</span></td></tr>
          <tr><td><b>Desde/Hasta</b></td><td>${dfrom} a ${dto}</td></tr>
          <tr><td><b>Check-in/out</b></td><td>${din} a ${dout}</td></tr>
          <tr><td><b>Nombre</b></td><td>${b.Customer_name}</td></tr>
          <tr><td><b>Género</b></td><td>${b.Customer_gender}</td></tr>
          <tr><td><b>Edad</b></td><td>${b.Customer_age}</td></tr>
          <tr><td><b>País</b></td><td>${b.Customer_nationality}</td></tr>
          <tr><td><b>Teléfono</b></td><td>${b.Customer_phone}</td></tr>
          <tr><td><b>Email</b></td><td>${b.Customer_email}</td></tr>
          </table>`
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

      // More than 1 bar in the row
      if (row.bars.length > 1) {

        // Split bookings and locks
        const bookings: TimeChartBar[] = row.bars.filter(bar => !bar.lock);
        const locks: TimeChartBar[] = row.bars.filter(bar => (bar.lock && bar.available && bar.type != Constants.availableStatus));
        const noavails: TimeChartBar[] = row.bars.filter(bar => (bar.lock && !bar.available));

        // Consolidte locks and add bookings
        row.bars = row.bars.filter(bar => bar.type == Constants.availableStatus);
        if (bookings.length > 0)
          row.bars.push(...bookings);
        if (locks.length > 0)
          row.bars.push(...this.consolidateIntervals(locks));
        if (noavails.length > 0)
          row.bars.push(...this.consolidateIntervals(noavails));
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
      if (intervals[i].datefrom <= new Date(currentInterval.dateto.getTime() + (1000 * 60 * 60 * 24))) {

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
    if (this.selectedCityId) {
      const finded = this.cities.find((cit) => cit.id === this.selectedCityId);
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
        date_from: formatDate(this.initDate, 'YMD'),
        date_to: formatDate(this.endDate, 'YMD'),
        building: this.selectedBuildingId,
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
      axiosApi.getAvailability(data, this.apolloApi.token).then((res) => {
        this.availableResources = res.data;
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
    this.getBuildings();
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
