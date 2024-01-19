import { Component, OnInit, ViewEncapsulation, LOCALE_ID, Inject } from "@angular/core";
import { DateAdapter } from "@angular/material/core";

import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";
import { Building, City, Holiday } from "src/app/constants/Interfaces";
import { CityListQuery } from "src/app/schemas/query-definitions/city.query";
import { BuildingListByLocationQuery, BuildingListQuery } from "src/app/schemas/query-definitions/building.query";
import { Constants } from "src/app/constants/Constants";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { LanguageService } from "src/app/services/language.service";
import { ActivatedRoute } from "@angular/router";
import { HolidayListQuery } from "src/app/schemas/query-definitions/lookup.query";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({ 
  selector: "app-dashboard-checkin",
  templateUrl: "./operations.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class OperationsDashboardComponent implements OnInit { 
  // Operation
  public op!: string;

  // Cities
  public cities: City [] = [] as City[]; // Cities
  public cityId: number = Constants.allStaticNumericValue; // Current city

  // Buildings
  public buildings: Building[] = [] as Building[]; // Buildings
  public buildingId: number = Constants.allStaticNumericValue; // Selected building

  // Date management
  public today!: string;
  public lastmonth!: string;
  public holidays: Holiday[] = [] as Holiday[];
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Spinner
  public isLoading: boolean = true;

  // Labels
  public labels: any = null;
  public status: string = "";

  // Table info
  public rows: any[] = [];
  public header: { key: string, value: string, sort: string, type: string } [] = [];
  public headerFields: { key: string, value: string, sort: string, type: string, filter: string[] }[] = [
    { key:"id",                   value:"#",                  sort:"", type: "text",   filter: [] },
    { key:"Name",                 value:"Residente",          sort:"", type: "text",   filter: [] },
    { key:"Status",               value:"Estado",             sort:"", type: "status", filter: [] },
    { key:"Date",                 value:"",                   sort:"", type: "date",   filter: ["---"] }, 
    { key:"Date_in",              value:"Fecha entrada",      sort:"", type: "date",   filter: ["nextin","checkin","issues"] }, 
    { key:"Date_out",             value:"Fecha salida",       sort:"", type: "date",   filter: ["nextout","checkout"] }, 
    { key:"Dates",                value:"Fechas contrato",    sort:"", type: "text",   filter: [] }, 
    { key:"Resource",             value:"Recurso / Edificio", sort:"", type: "text",   filter: [] },
    { key:"Check_in_time",        value:"Hora check-in",      sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Arrival",              value:"Hora llegada",       sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Flight",               value:"Tren/Vuelo",         sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Option",               value:"Opción",             sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Issues",               value:"Incidencias",        sort:"", type: "text",   filter: ["issues"] },
    { key:"Damages",              value:"Daños",              sort:"", type: "input",  filter: ["checkout"] },
    { key:"Check_in_room_ok",     value:"Limpieza ok",        sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in_notice_ok",   value:"Aviso roomates",     sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in_keys_ok",     value:"Llaves   ok",        sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in_keyless_ok",  value:"Keyless ok",         sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_out_keys_ok",    value:"Llaves   ok",        sort:"", type: "bool",   filter: ["nextout","checkout"] },
    { key:"Check_out_keyless_ok", value:"Keyless ok",         sort:"", type: "bool",   filter: ["nextout","checkout"] },
  ];

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private language: LanguageService,
    private adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private apolloApi: ApolloQueryApi
  ) { 
    // Operation type
    this.route.data.subscribe((data: any) => {
      this.op = data.op;
    });

    // Set locale
    this.adapter.setLocale(this.language.lang.substring(0, 2));

    // Columns
    this.header = this.headerFields.filter(d => (d.filter.length == 0 || d.filter.includes(this.op)));

    // Today and one month ago
    const today: Date = new Date();
    this.today = this.datePipe.transform(today, "yyyy-MM-dd") || "";
    today.setDate(today.getDate() - 30);
    this.lastmonth = this.datePipe.transform(today, "yyyy-MM-dd") || "";
    
    // Start date range
    const start: Date = new Date();
    start.setDate(start.getDate() + 1);
    this.range.get("start")?.setValue(start);

    // End date range
    const end: Date = new Date();
    end.setDate(end.getDate() + (this.op == 'checkout' ? 30 : 15));
    this.range.get("end")?.setValue(end);
  }

  async ngOnInit() { 
    // Get cities, buildings and labels
    this.isLoading  = true;
    await this.getHolidays();
    await this.getCities();
    await this.getBuildings();
    await axiosApi.getLabels(7, "es_ES", this.apolloApi.token).then((res) => { 
      this.labels = res.data;
      this.isLoading  = false;
    });
  }

  // Load holidays
  async getHolidays() {
    await this.apolloApi.getData(HolidayListQuery).subscribe((result) => {
      this.holidays = result.data.data;
    })
  }

  // Load cities
  async getCities() {
    await this.apolloApi.getData(CityListQuery).subscribe((result) => {
      this.cities = result.data.data;
    })
  }

  // Load buildings
  async getBuildings() {
    if (this.cityId == Constants.allStaticNumericValue) {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
      });
    } else {
      this.apolloApi.getData(BuildingListByLocationQuery, { id: this.cityId }).subscribe(res => {
        this.buildings = res.data.data;
      });
    }
  }

  // Get bookings
  async getBookings() { 
    // Clean
    this.rows = [];
    const params: any = {};

    // City
    if (this.cityId != Constants.allStaticNumericValue)
      params["location"] = this.cityId;

    // Building
    if (this.buildingId != Constants.allStaticNumericValue)
      params["building"] = this.buildingId;

    // Date range
    params["date_from"] = this.datePipe.transform(this.range.get("start")?.value, "yyyy-MM-dd");
    params["date_to"] = this.datePipe.transform(this.range.get("end")?.value, "yyyy-MM-dd")

    // Ger bookings
    this.isLoading = true;
    axiosApi.getDashboardBookings(this.op, this.apolloApi.token, params).then((res) => { 
      // Get data
      this.rows = res.data.map((o: any) => { 
        let warning = false;
        if (this.op == "checkin") {
          warning = o.Date_in < this.today;
        }
        if (this.op == "checkout") {
          console.log(this.lastmonth);
          warning = o.Date_out < this.lastmonth;
        }
        return {
          "id": o.id,
          "Name": o.Name + "<br>" + (o.Email || "") + "<br>" + (o.Phones || ""),
          "Status": o.Status,
          "Date_in": this.formatDate(o.Date_in) + "<br>" + this.formatWeekday(o.Date_in),
          "Date_out": this.formatDate(o.Date_out) + "<br>" + this.formatWeekday(o.Date_out),
          "Date": ["nextin", "checkin", "issues"].includes(this.op) ? o.Date_in : o.Date_out,
          "Dates": this.formatDate(o.Date_from) + "<br>" + this.formatDate(o.Date_to),
          "Resource": o.Resource + "<br>" + o.Building,
          "Check_in_time": (o.Check_in_time || "--:--").substring(0, 5),
          "Arrival": (o.Arrival || "--:--").substring(0, 5),
          "Flight": (o.Flight || "-"),
          "Option": (o.Option || "-"),
          "Check_in_room_ok": [o.Check_in_room_ok, o.Check_in_room_ok],
          "Check_in_notice_ok": [o.Check_in_notice_ok, o.Check_in_notice_ok],
          "Check_in_keys_ok": [o.Check_in_keys_ok, o.Check_in_keys_ok],
          "Check_in_keyless_ok": [o.Check_in_keyless_ok, o.Check_in_keyless_ok],
          "Check_out_keys_ok": [o.Check_out_keys_ok, o.Check_out_keys_ok],
          "Check_out_keyless_ok": [o.Check_out_keyless_ok, o.Check_out_keyless_ok],
          "Issues": o.Issues || "-",
          "Damages": o.Damages || "-",
          "Warning": warning,
          "Changed": false
        }
      });
      this.isLoading  = false;

      // Sort
      if (["nextin", "checkin", "issues"].includes(this.op))
        this.sort("Date_in", "up")
      else
        this.sort("Date_out", "up")
    });      
  }

  goBooking(id: string) { 
    const link = "/admin/Booking.Booking/" + id + "/view";
    parent.history.pushState("", "", link);
    parent.history.go(-1);
    parent.history.go(1);
    parent.history.pushState("", "", link);
    parent.history.go(-1);
    parent.history.go(1);
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

  // City change
  onCity(): void {
    // Clean
    this.buildingId = Constants.allStaticNumericValue;
    this.rows = [];
    this.getBuildings();
    this.getBookings();
  }

  // Building change
  onBuilding(): void {
    this.getBookings();
  }

  // Dates change
  onDates(): void {
    this.getBookings();
  }

  // Sort table
  sort(key: string, dir: any) { 
    // Change sort
    let type = "";
    for (const h of this.header) { 
      if (h.key === key) { 
        type = h.type;
        if (!dir) {
          dir = h.sort != "up" ? "up" : "down";
        }
        h.sort = dir;
      } else { 
        h.sort = "";
      }
    }

    // Sort
    if (type == "date")
      key = "Date";
    this.rows = this.rows.sort((a:any, b:any) => { 
      const va = String(a[key]);
      const vb = String(b[key]);
      if (dir == "up")
        return va.localeCompare(vb);
      return vb.localeCompare(va);
    });

  }

  formatWeekday(date: string) {
    const d = new Date(date)
    return d.toLocaleDateString(this.language.lang, { weekday: "short" }); 
  }

  formatDate(date: string) {
    const d = new Date(date)
    return this.datePipe.transform(date, "dd/MM/yyyy")
  }

  isHoliday(date: string) {
    if (this.op == 'checkout')
      return false;
    const d = new Date(date);
    if (d.getDay() == 0 || d.getDay() == 6)
      return true;
    return this.holidays.find(h => (h.location == null || h.location == this.cityId) ? date == h.day : false); 
  }

  emitCheck(event: MatCheckboxChange, key: string, row: any) {
    row[key][0] = event.checked;
    row["Changed"] = false;
    if (row["Check_in_room_ok"][0]     != row["Check_in_room_ok"][1])     row["Changed"] = true;
    if (row["Check_in_notice_ok"][0]   != row["Check_in_notice_ok"][1])   row["Changed"] = true;
    if (row["Check_in_keys_ok"][0]     != row["Check_in_keys_ok"][1])     row["Changed"] = true;
    if (row["Check_in_keyless_ok"][0]  != row["Check_in_keyless_ok"][1])  row["Changed"] = true;
    if (row["Check_out_keys_ok"][0]    != row["Check_out_keys_ok"][1])    row["Changed"] = true;
    if (row["Check_out_keyless_ok"][0] != row["Check_out_keyless_ok"][1]) row["Changed"] = true;
    return row["Changed"];
  }

  save(row: any) {
    console.log(row);
    row["Changed"] = false;
 }

}