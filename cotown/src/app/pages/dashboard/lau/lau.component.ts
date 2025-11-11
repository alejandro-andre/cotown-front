import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DateAdapter } from "@angular/material/core";

import axiosApi from "src/app/services/api.service";
import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import { Building, City } from "src/app/constants/Interfaces";
import { CITIES_QUERY } from "src/app/schemas/query-definitions/city.query";
import { BUILDINGS_BY_LOCATION_QUERY, BUILDINGS_QUERY } from "src/app/schemas/query-definitions/building.query";
import { Constants } from "src/app/constants/Constants";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { LanguageService } from "src/app/services/language.service";
import { ActivatedRoute } from "@angular/router";
import { BOOKING_OTHER_UPDATE_DEV } from "src/app/schemas/query-definitions/booking.query";
import { BOOKING_OTHER_UPDATE_ITP } from "src/app/schemas/query-definitions/booking.query";
import { BOOKING_OTHER_UPDATE_END } from "src/app/schemas/query-definitions/booking.query";

@Component({ 
  selector: "app-dashboard-lau",
  templateUrl: "./lau.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class LauDashboardComponent implements OnInit { 
  // Parent
  private parent: any = null;

  // Operation
  public op = 'dev';
  public dashboards: any[] = [
    {op: 'dev', name: 'Devoluciones de fianza'},
    {op: 'itp', name: 'Pagos ITP'},
    {op: 'end', name: 'Fin de contrato'},
  ];
  public dashboardId: number = 1;

  // Cities
  public cities: City [] = [] as City[]; // Cities
  public cityId: number = Constants.allStaticNumericValue; // Current city

  // Buildings
  public buildings: Building[] = [] as Building[]; // Buildings
  public buildingIds: number[] = []; // Selected building

  // Date management
  public today!: string;
  public lastmonth!: string;
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
    { key:"id",                    value:"#",                         sort:"", type: "text",    filter: [] },
    { key:"Resource",              value:"Recurso",                   sort:"", type: "text",    filter: [] }, 
    { key:"Customer",              value:"Inquilino",                 sort:"", type: "text",    filter: [] }, 
    { key:"Dates",                 value:"Fechas contrato",           sort:"", type: "date",    filter: [] },
    { key:"Deposit",               value:"Fianza depositada",         sort:"", type: "number",  filter: ["dev"] }, 
    { key:"Deposit_required",      value:"Fianza a devolver",         sort:"", type: "number",  filter: ["dev"] }, 
    { key:"Deposit_required_date", value:"Fecha prevista devolución", sort:"", type: "date",    filter: ["dev"] }, 
    { key:"Deposit_return_date",   value:"Fecha devolución",          sort:"", type: "control", filter: ["dev"] }, 
    { key:"Compensation",          value:"Indemnización",             sort:"", type: "number",  filter: ["itp"] }, 
    { key:"Compensation_date",     value:"Fecha indemnización",       sort:"", type: "date",    filter: ["itp"] }, 
    { key:"ITP_required_date",     value:"Fecha prevista ITP",        sort:"", type: "date",    filter: ["itp"] }, 
    { key:"ITP_date",              value:"Fecha ITP",                 sort:"", type: "control", filter: ["itp"] }, 
    { key:"Burofax_date",          value:"Fecha burofax",             sort:"", type: "control", filter: ["end"] }, 
  ];

  // Date control
  public dateControl = new FormControl<any>('');
  
  // Constructor
  constructor(
    private route: ActivatedRoute,
    private language: LanguageService,
    private adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private apollo: ApolloQueryApi
  ) { 
    this.reset();
    this.adapter.setLocale(this.language.lang.substring(0, 2));
  }

  async ngOnInit() { 
    // Get cities, buildings and labels
    this.isLoading  = true;
    await this.getCities();
    await this.getBuildings();
    await axiosApi.getLabels(7, "es_ES", this.apollo.token).then((res) => { 
      this.labels = res.data;
      this.isLoading  = false;
    });
  }

  // Load cities
  async getCities() {
    await this.apollo.getData(CITIES_QUERY).subscribe((result) => {
      this.cities = result.data.data;
    })
  }

  // Load buildings
  async getBuildings() {
    if (this.cityId == Constants.allStaticNumericValue) {
      this.apollo.getData(BUILDINGS_QUERY).subscribe(res => {
        this.buildings = res.data.data;
      });
    } else {
      this.apollo.getData(BUILDINGS_BY_LOCATION_QUERY, { id: this.cityId }).subscribe(res => {
        this.buildings = res.data.data;
      });
    }
  }

  reset() {
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
    end.setDate(end.getDate() + (["nextout", "checkout"].includes(this.op) ? 30 : 15));
    this.range.get("end")?.setValue(end);

    // Columns
    this.rows = [];
    this.header = this.headerFields.filter(d => (d.filter.length == 0 || d.filter.includes(this.op)));
    this.getBookings();
  }

  get_params() {
    // City
    const params: any = {};
    if (this.cityId != Constants.allStaticNumericValue)
      params["location"] = this.cityId;

    // Building
    if (this.buildingIds.length > 0)
      params["building"] = this.buildingIds;

    // Date range
    params["date_from"] = this.datePipe.transform(this.range.get("start")?.value, "yyyy-MM-dd");
    params["date_to"] = this.datePipe.transform(this.range.get("end")?.value, "yyyy-MM-dd")
    return params;
  }

  // Get bookings
  async getBookings() { 
    // Spinner
    this.isLoading = true;

    // Clean
    this.rows = [];
    if (!this.op || !this.cityId)
      return;

    // Get bookings
    const params: any = this.get_params();
    await axiosApi.getLauBookings(this.op, this.apollo.token, params).then((res) => { 
      this.rows = res.data.map((o: any) => { 

        // Return data
        return {
          "id": o.id,
          "Resource": o.Resource + "<br>" + o.Building,
          "Customer": o.Name + "<br>" + (o.Email || "") + "<br>" + (o.Phones || ""),
          "Dates": this.formatDate(o.Date_from) + "<br>" + this.formatDate(o.Date_to),
          "Date_estimated": this.formatDate(o.Date_estimated),
          "Deposit": this.formatAmount(o.Deposit),
          "Deposit_required": this.formatAmount(o.Deposit_Required),
          "Deposit_return_date": new FormControl<any>(o.Deposit_return_date),
          "Compensation": this.formatAmount(o.Compensation),
          "Compensation_date": this.formatDate(o.Compensation_date),
          "ITP_required_date": this.formatDate(o.ITP_required_date),
          "ITP_date": new FormControl<any>(o.ITP_date),
          "Burofax_date": new FormControl<any>(o.Burofax_date)
        }
      });
    });      

    // Spinner
    this.isLoading  = false;
  }

  goBooking(id: string) { 
    const link = "/admin/Booking.Booking_other/" + id + "/view";
    if (window.opener && !this.parent)
      this.parent = window.opener.parent;
    else if (parent && !this.parent)
      this.parent = parent;
    if (this.parent) {
      this.parent.history.pushState(null, "", link);
      this.parent.history.go(-1);
      this.parent.history.go(1);
      this.parent.history.pushState(null, "", link);
      this.parent.history.go(-1);
      this.parent.history.go(1);
    }
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
    this.buildingIds = [];
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
    this.rows = this.rows.sort((a:any, b:any) => {
      let va = String(a[key]);
      let vb = String(b[key]);
      if (type == "date") {
        va = va.substring(6, 10) + va.substring(3, 5) + va.substring(0, 2);
        vb = vb.substring(6, 10) + vb.substring(3, 5) + vb.substring(0, 2);
      }
      if (dir == "up")
        return va.localeCompare(vb);
      return vb.localeCompare(va);
    });

  }

  formatDate(date: string) {
    if (date) {
      const d = new Date(date)
      return this.datePipe.transform(date, "dd/MM/yyyy")
    }
    return "-"
  }

  formatAmount(amount: number | null): string {
    if (amount !== null && amount !== undefined) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return "-";
  }

  change(event: any, row: any) {
    row["Changed"] = true;
  }

  save(row: any) {
    // GraphQL variables
    const variables: any = {
      id: row.id,
      date: null,
    }
    let query = '';
    if (this.op == 'dev') {
      query = BOOKING_OTHER_UPDATE_DEV;
      variables.date = this.datePipe.transform(row.Deposit_return_date.value, "yyyy-MM-dd");
    } else if (this.op == 'itp') {
      query = BOOKING_OTHER_UPDATE_ITP;
      variables.date = this.datePipe.transform(row.ITP_date.value, "yyyy-MM-dd");
    } else {
      query = BOOKING_OTHER_UPDATE_END;
      variables.date = this.datePipe.transform(row.Burofax_date.value, "yyyy-MM-dd");
    }

    // Update
    this.isLoading = true;
    this.apollo.setData(query, variables).subscribe({
      next: (res) => {
        this.isLoading = false;
      }, 
      error: (err)  => {
        this.isLoading = false;
      }
    })
  }

}