import { Component, OnInit, ViewEncapsulation, LOCALE_ID, Inject } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { environment } from 'src/environments/environment';

import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";
import { Building, City, Holiday } from "src/app/constants/Interfaces";
import { CITIES_QUERY } from "src/app/schemas/query-definitions/city.query";
import { BUILDINGS_BY_LOCATION_QUERY, BUILDINGS_QUERY } from "src/app/schemas/query-definitions/building.query";
import { Constants } from "src/app/constants/Constants";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { LanguageService } from "src/app/services/language.service";
import { ActivatedRoute } from "@angular/router";
import { HOLIDAYS_QUERY } from "src/app/schemas/query-definitions/lookup.query";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { BOOKING_UPDATE } from "src/app/schemas/query-definitions/booking.query";

@Component({ 
  selector: "app-dashboard-checkin",
  templateUrl: "./operations.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class OperationsDashboardComponent implements OnInit { 
  // Parent
  private parent: any = null;

  // Operation
  public op!: string;
  public dashboards: any[] = [
    {op: 'nextin', name: 'Próximas entradas'},
    {op: 'checkin', name: 'Entradas'},
    {op: 'issues', name: 'Incidencias en entradas'},
    {op: 'nextout', name: 'Próximas salidas'},
    {op: 'checkout', name: 'Salidas'},
    {op: 'revision', name: 'Revisiones'},
    {op: 'ecoext', name: 'Early checkout/Extensiones'},
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
  public prevnext: any[][] = [];
  public header: { key: string, value: string, sort: string, type: string } [] = [];
  public headerFields: { key: string, value: string, sort: string, type: string, filter: string[] }[] = [
    { key:"ids",                   value:"#",                  sort:"", type: "text",   filter: [] },
    { key:"Confirmation_date",     value:"Fecha confirmación", sort:"", type: "date",   filter: ["nextin"] }, 
    { key:"Name",                  value:"Residente",          sort:"", type: "text",   filter: [] },
    { key:"Status",                value:"Estado",             sort:"", type: "status", filter: [] },
    { key:"Date_in",               value:"Fecha entrada",      sort:"", type: "date",   filter: ["nextin","checkin","issues"] }, 
    { key:"Date_out",              value:"Fecha salida",       sort:"", type: "date",   filter: ["nextout","checkout","revision","ecoext"] }, 
    { key:"Prev",                  value:"Salida anterior",    sort:"", type: "text",   filter: ["nextin"] },
    { key:"Next",                  value:"Entrada siguiente",  sort:"", type: "text",   filter: ["nextout"] },
    { key:"New_check_out",         value:"Nueva salida",       sort:"", type: "date",   filter: ["ecoext"] }, 
    { key:"Old_check_out",         value:"Antigua salida",     sort:"", type: "date",   filter: ["ecoext"] }, 
    { key:"Dates",                 value:"Fechas contrato",    sort:"", type: "text",   filter: [] }, 
    { key:"Resource",              value:"Recurso / Edificio", sort:"", type: "text",   filter: [] },
    { key:"Check_in_time",         value:"Hora check-in",      sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Arrival",               value:"Hora llegada",       sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Flight",                value:"Tren/Vuelo",         sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Option",                value:"Opción/Comentarios", sort:"", type: "text",   filter: ["nextin","checkin"] },
    { key:"Issues",                value:"Incidencias",        sort:"", type: "text",   filter: ["issues"] },
    { key:"Issues_ok",             value:"Gestionadas",        sort:"", type: "boll",   filter: ["issues"] },
    { key:"Check_in_payed",        value:"Check-in pagado",    sort:"", type: "check",  filter: ["nextin","checkin"] },
    { key:"Check_in_notice_ok",    value:"Aviso comp.",        sort:"", type: "check",  filter: ["nextin","checkin"] },
    { key:"Check_in_room_ok",      value:"Limpieza ok",        sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in_keys_ok",      value:"Llaves ok",          sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in_keyless_ok",   value:"Keyless ok",         sort:"", type: "bool",   filter: ["nextin","checkin"] },
    { key:"Check_in",              value:"Check-in",           sort:"", type: "bool",   filter: ["checkin"] },
//¿    { key:"Check_out_keys_ok",     value:"Llaves ok",          sort:"", type: "bool",   filter: ["nextout","checkout"] },
//¿    { key:"Check_out_keyless_ok",  value:"Keyless ok",         sort:"", type: "bool",   filter: ["nextout","checkout"] },
   { key:"Check_out_keys_ok",     value:"Llaves ok",          sort:"", type: "bool",   filter: ["revision"] },
   { key:"Check_out_keyless_ok",  value:"Keyless ok",         sort:"", type: "bool",   filter: ["checkout"] },
    { key:"Check_out",             value:"Check-out",          sort:"", type: "bool",   filter: ["checkout"] },
    { key:"Eco_ext_keyless_ok",    value:"Keyless ok",         sort:"", type: "bool",   filter: ["ecoext"] },
    { key:"Eco_ext_change_ok",     value:"ECO/EXT ok",         sort:"", type: "bool",   filter: ["ecoext"] },
//¿    { key:"Damages",               value:"Desperfectos",       sort:"", type: "input",  filter: ["nextout","checkout","revision","ecoext"] },
//¿    { key:"Damages_ok",            value:"Gestionados",        sort:"", type: "bool",   filter: ["nextout","checkout","revision","ecoext"] },
//¿    { key:"Check_out_revision_ok", value:"Revisión ok",        sort:"", type: "bool",   filter: ["checkout","revision"] },
   { key:"Damages",               value:"Desperfectos",       sort:"", type: "input",  filter: ["revision","ecoext"] },
   { key:"Damages_ok",            value:"Gestionados",        sort:"", type: "bool",   filter: ["revision","ecoext"] },
   { key:"Check_out_revision_ok", value:"Revisión ok",        sort:"", type: "bool",   filter: ["revision"] },
  ];

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
    await this.getHolidays();
    await this.getCities();
    await this.getBuildings();
    await axiosApi.getLabels(7, "es_ES", this.apollo.token).then((res) => { 
      this.labels = res.data;
      this.isLoading  = false;
    });
  }

  // Load holidays
  async getHolidays() {
    await this.apollo.getData(HOLIDAYS_QUERY).subscribe((result) => {
      this.holidays = result.data.data;
    })
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
    await axiosApi.getDashboardBookings(this.op, this.apollo.token, params).then((res) => { 
      this.rows = res.data.map((o: any) => { 

        // Warning style
        let warning = false;
        if (this.op == "checkin") {
          warning = o.Date_in < this.today;
        }
        if (this.op == "checkout") {
          warning = o.Date_out < this.lastmonth;
        }

        // CHA/ECO/EXT indicator
        let indicator = "";
        if (o.Origin_id != null && (this.op == 'checkin' || this.op == 'nextin' || this.op == 'issues'))
          indicator = "<br><strong style='color:teal;'>" + (o.Cha_ext||'').toUpperCase() + "</strong><br>" + o.Origin_id;
        if (o.Destination_id != null && (this.op == 'checkout' || this.op == 'nextout'))
          indicator = "<br><strong style='color:teal;'>" + (o.Cha_ext||'').toUpperCase() + "</strong><br>" + o.Destination_id;
        if (o.Old_check_out && o.New_check_out < o.Old_check_out && !o.Eco_ext_change_ok) 
          indicator = "<br><strong style='color:teal;'>ECO</strong><br>";
        if (o.Old_check_out && o.New_check_out > o.Old_check_out && !o.Eco_ext_change_ok) 
          indicator = "<br><strong style='color:teal;'>EXT</strong><br>";

        // Asterisks
        let c_in  = (o.Check_in  != null) ? "" : " <b>*</b>";
        let c_out = (o.Check_out != null) ? "" : " <b>**</b>";

        // Holiday check
        let holiday;
        if (this.op == "nextin" || this.op == "checkin") {
          holiday = o.Date_in
        }
        if (this.op == "nextout" || this.op == "checkout") {
          holiday = o.Date_out
        }

        // Return data
        return {
          "id": o.id,
          "ids": o.id + indicator,
          "Name": o.Name + "<br>" + (o.Email || "") + "<br>" + (o.Phones || ""),
          "Status": o.Status,
          "Date": holiday,
          "D_in": new Date(o.Date_in),
          "D_out": new Date(o.Date_out),
          "Date_in": this.formatDate(o.Date_in) + "<br>" + this.formatWeekday(o.Date_in) + c_in,
          "Date_out": this.formatDate(o.Date_out) + "<br>" + this.formatWeekday(o.Date_out) + c_out,
          "New_check_out": this.formatDate(o.New_check_out) + "<br>" + this.formatWeekday(o.New_check_out),
          "Old_check_out": this.formatDate(o.Old_check_out) + "<br>" + this.formatWeekday(o.Old_check_out),
          "Confirmation_date": this.formatDate(o.Confirmation_date),
          "Dates": this.formatDate(o.Date_from) + "<br>" + this.formatDate(o.Date_to),
          "Resource": o.Resource + "<br>" + o.Building,
          "Check_in_time": (o.Check_in_time || "--:--").substring(0, 5),
          "Arrival": (o.Arrival || "--:--").substring(0, 5),
          "Flight": (o.Flight || "-"),
          "Option": (o.Option || "-") + "<br>" + (o.Comments || ""),
          "Check_in_payed": o.Payment_id ? o.Payment_date != null : null,
          "Check_in_notice_ok": o.Check_in_notice_ok,
          "Check_in_room_ok": [o.Check_in_room_ok, o.Check_in_room_ok],
          "Check_in_keys_ok": [o.Check_in_keys_ok, o.Check_in_keys_ok],
          "Check_in_keyless_ok": [o.Check_in_keyless_ok, o.Check_in_keyless_ok],
          "Check_out_keys_ok": [o.Check_out_keys_ok, o.Check_out_keys_ok],
          "Check_out_keyless_ok": [o.Check_out_keyless_ok, o.Check_out_keyless_ok],
          "Check_out_revision_ok": [o.Check_out_revision_ok, o.Check_out_revision_ok],
          "Eco_ext_keyless_ok": [o.Eco_ext_keyless_ok, o.Eco_ext_keyless_ok],
          "Eco_ext_change_ok": [o.Eco_ext_change_ok, o.Eco_ext_change_ok],
          "Issues": o.Issues || "-",
          "Issues_ok": [o.Issues_ok, o.Issues_ok],
          "Damages": o.Damages || "-",
          "Damages_ok": [o.Damages_ok, o.Damages_ok],
          "Warning": warning,
          "Cha_ext": o.Cha_ext,
          "Check_in": [false, false],
          "Check_out": [false, false],
          "Changed": false,
          "Prev": "",
          "Next": "",
          "Days": ""
        }
      });
    });      

    // Get previous and next bookings
    await axiosApi.getDashboardPrevNext(this.apollo.token, params).then((res) => {
      this.rows.forEach((row: any) => {

        // Previous bookings
        if (this.op == "nextin") {
          const prev = res.data[0].find((d: any) => (d.id == row.id));
          if (prev) {
            const d = new Date(prev.Prev_date);
            let labordays = 0;
            while (d < row.D_in) {
              if (d.getDay() > 0 && d.getDay() < 6 && !this.holidays.find(h => (h.location == null || h.location == this.cityId) ? prev.Prev_date == h.day : false))
                labordays += 1;
              d.setDate(d.getDate() + 1);
              }
            if (labordays < 2)
              row.Warning = true;
            row.Prev = this.formatDate(prev.Prev_date) + "<br>" + labordays + " días<br>" + prev.Prev_id ;
          }
        }

        // Next bookings
        if (this.op == "nextout") {
          const next = res.data[1].find((d: any) => (d.id == row.id));
          if (next) {
            const d = new Date(next.Next_date);
            let labordays = 0;
            while (d > row.D_out) {
              if (d.getDay() > 0 && d.getDay() < 6 && !this.holidays.find(h => (h.location == null || h.location == this.cityId) ? next.Next_date == h.day : false))
                labordays += 1;
              d.setDate(d.getDate() - 1);
              }
            if (labordays < 2)
              row.Warning = true;
            row.Next = this.formatDate(next.Next_date) + "<br>" + labordays + " días<br>" + next.Next_id ;
          }
        }

      })
    });

    // Spinner
    this.isLoading  = false;

    // Sort
    if (["nextin", "checkin", "issues"].includes(this.op))
      this.sort("Date_in", "up")
    else
      this.sort("Date_out", "up")
  }

  goBooking(id: string) { 
    const link = "/admin/Booking.Booking/" + id + "/view";
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

  formatWeekday(date: string) {
    const d = new Date(date)
    return d.toLocaleDateString(this.language.lang, { weekday: "short" }); 
  }

  formatDate(date: string) {
    const d = new Date(date)
    return this.datePipe.transform(date, "dd/MM/yyyy")
  }

  isHoliday(date: string) {
    const d = new Date(date);
    if (d.getDay() == 0 || d.getDay() == 6)
      return true;
    return this.holidays.find(h => (h.location == null || h.location == this.cityId) ? date == h.day : false); 
  }

  emitCheck(event: MatCheckboxChange, key: string, row: any) {
    row[key][0] = event.checked;
    row["Changed"] = false;
    if (row["Check_in_room_ok"][0]      != row["Check_in_room_ok"][1])      row["Changed"] = true;
    if (row["Check_in_keys_ok"][0]      != row["Check_in_keys_ok"][1])      row["Changed"] = true;
    if (row["Check_in_keyless_ok"][0]   != row["Check_in_keyless_ok"][1])   row["Changed"] = true;
    if (row["Check_out_keys_ok"][0]     != row["Check_out_keys_ok"][1])     row["Changed"] = true;
    if (row["Check_out_keyless_ok"][0]  != row["Check_out_keyless_ok"][1])  row["Changed"] = true;
    if (row["Check_out_revision_ok"][0] != row["Check_out_revision_ok"][1]) row["Changed"] = true;
    if (row["Eco_ext_keyless_ok"][0]    != row["Eco_ext_keyless_ok"][1])    row["Changed"] = true;
    if (row["Eco_ext_change_ok"][0]     != row["Eco_ext_change_ok"][1])     row["Changed"] = true;
    if (row["Issues_ok"][0]             != row["Issues_ok"][1])             row["Changed"] = true;
    if (row["Damages_ok"][0]            != row["Damages_ok"][1])            row["Changed"] = true;
    if (row["Check_in"][0]              != row["Check_in"][1])              row["Changed"] = true;
    if (row["Check_out"][0]             != row["Check_out"][1])             row["Changed"] = true;
    return row["Changed"];
  }

  save(row: any) {
    // Check-in?
    if (row["Status"] == "checkin" && row["Check_in"][0] && !row["Check_in"][1]) {
      row["Status"] = "inhouse";
    }

    // Check-out?
    else if (["checkout", "revision"].includes(row["Status"]) && row["Check_out"][0] && !row["Check_out"][1]) {
      row["Status"] = "revision";
    }

    // Revision Ok?
    else if (["checkout", "revision"].includes(row["Status"]) && row["Check_out_revision_ok"][0] && !row["Check_out_revision_ok"][1]) {
      row["Status"] = "devolvergarantia";
    }

    // GraphQL variables
    const variables: any = {
      id: row.id,
      status: row["Status"],
      checkinroomok: row.Check_in_room_ok[0],
      checkinkeysok: row.Check_in_keys_ok[0],
      checkinkeylessok: row.Check_in_keyless_ok[0],
      checkoutkeysok: row.Check_out_keys_ok[0],
      checkoutkeylessok: row.Check_out_keyless_ok[0],
      eco_ext_keyless_ok: row.Eco_ext_keyless_ok[0],
      eco_ext_change_ok: row.Eco_ext_change_ok[0],
      issues_ok: row.Issues_ok[0],
      damages_ok: row.Damages_ok[0]
    }
    
    // Update
    this.isLoading = true;
    this.apollo.setData(BOOKING_UPDATE, variables).subscribe({
      next: (res) => {
        this.isLoading = false;
        row["Check_in_room_ok"][1]     = row["Check_in_room_ok"][0];
        row["Check_in_keys_ok"][1]     = row["Check_in_keys_ok"][0];
        row["Check_in_keyless_ok"][1]  = row["Check_in_keyless_ok"][0];
        row["Check_out_keys_ok"][1]    = row["Check_out_keys_ok"][0];
        row["Check_out_keyless_ok"][1] = row["Check_out_keyless_ok"][0];
        row["Eco_ext_keyless_ok"][1]   = row["Eco_ext_keyless_ok"][0];
        row["Eco_ext_change_ok"][1]    = row["Eco_ext_change_ok"][0];
        row["Issues_ok"][1]            = row["Issues_ok"][0];
        row["Damages_ok"][1]           = row["Damages_ok"][0];   
        if (this.op == "checkin" && row["Status"] == "inhouse") {
          this.rows = this.rows.filter(r => r.id != row.id)
        }
        if (this.op == "checkout" && row["Status"] != "checkout") {
          this.rows = this.rows.filter(r => r.id != row.id)
        }
        row["Changed"] = false;
      }, 
      error: (err)  => {
        this.isLoading = false;
      }
    })
  }

  link() {
    if (!this.op || !this.cityId)
      return;
    const params: any = this.get_params();
    let queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    return environment.backURL + '/report/' + this.op + '?access_token=' + this.apollo.token + '&' + queryString;
  }

}