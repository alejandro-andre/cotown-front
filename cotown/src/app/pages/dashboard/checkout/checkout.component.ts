import { Component, OnInit, ViewEncapsulation, LOCALE_ID, Inject } from "@angular/core";
import { DateAdapter } from '@angular/material/core';

import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";
import { Building, City } from "src/app/constants/Interfaces";
import { CityListQuery } from "src/app/schemas/query-definitions/city.query";
import { BuildingListByLocationQuery, BuildingListQuery } from "src/app/schemas/query-definitions/building.query";
import { Constants } from "src/app/constants/Constants";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { LanguageService } from "src/app/services/language.service";

@Component({ 
  selector: "app-dashboard-checkin",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class CheckoutDashboardComponent implements OnInit { 

  // Cities
  public cities: City [] = [] as City[]; // Cities
  public selectedCityId: number = Constants.allStaticNumericValue; // Current city

  // Buildings
  public buildings: Building[] = [] as Building[]; // Buildings
  public selectedBuildingId: number = Constants.allStaticNumericValue; // Selected building

  // Date range
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Spinner
  public spinnerActive: boolean = true;

  // Labels
  public labels: any = null;
  public status: string = "";

  // Table info
  public rows: any[] = [];
  public header: { key: string, value: string, sort: string } [] = [
    { key:"id",                   value:"#",             sort:"" },
    { key:"Name",                 value:"Residente",     sort:"" },
    { key:"Status",               value:"Estado",        sort:"" },
    { key:"Date_out",             value:"Fecha salida",  sort:"" }, 
    { key:"Date_out_wd",          value:"Día semana",    sort:"" }, 
    { key:"Date_to",              value:"Fecha fin",     sort:"" }, 
    { key:"Building",             value:"Edificio",      sort:"" },
    { key:"Resource",             value:"Recurso",       sort:"" },
    { key:"Check_out_keys_ok",    value:"Lla",           sort:"" },
    { key:"Check_out_keyless_ok", value:"Kls",           sort:"" }, 
  ];

  // Constructor
  constructor(    
    private language: LanguageService,
    private adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private apolloApi: ApolloQueryApi
  ) { 
    // Set locale
    console.log(this.language.lang.substring(0, 2));
    this.adapter.setLocale(this.language.lang.substring(0, 2));

    // Dates
    const start: Date = new Date();
    start.setDate(start.getDate() + 1);
    this.range.get('start')?.setValue(start);

    const end: Date = new Date();
    end.setDate(end.getDate() + 15);
    this.range.get('end')?.setValue(end);
  }

  async ngOnInit() { 
    // Get cities, buildings and labels
    this.spinnerActive  = true;
    await this.getCities();
    await this.getBuildings();
    await axiosApi.getLabels(7, "es_ES", this.apolloApi.token).then((res) => { 
      this.labels = res.data;
      this.spinnerActive  = false;
    });
  }

  // Load cities
  async getCities() {
    await this.apolloApi.getData(CityListQuery).subscribe((result) => {
      this.cities = result.data.data;
    })
  }

  // Load buildings
  async getBuildings() {
    if (this.selectedCityId == Constants.allStaticNumericValue) {
      this.apolloApi.getData(BuildingListQuery).subscribe(res => {
        this.buildings = res.data.data;
      });
    } else {
      this.apolloApi.getData(BuildingListByLocationQuery, { id: this.selectedCityId }).subscribe(res => {
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
    if (this.selectedCityId != Constants.allStaticNumericValue)
      params["location"] = this.selectedCityId;

    // Building
    if (this.selectedBuildingId != Constants.allStaticNumericValue)
      params["building"] = this.selectedBuildingId;

    // Date range
    params['date_from'] = this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-dd');
    params['date_to'] = this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-dd')

    // Ger bookings
    axiosApi.getDashboardBookings("nextout", this.apolloApi.token, params).then((res) => { 
      this.rows = res.data.map((o: any) => { return {
        "id": o.id,
        "Name": o.Name,
        "Status": o.Status,
        "Date_out": this.formatDate(o.Date_out),
        "Date_out_wd": this.formatWeekday(o.Date_out),
        "Date_to": this.formatDate(o.Date_to),
        "Building": o.Building,
        "Resource": o.Resource,
        "Check_out_keys_ok": o.Check_out_keys_ok,
        "Check_out_keyless_o": o.Check_out_keyless_ok
      } });
      this.spinnerActive  = false;
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
    this.selectedBuildingId = Constants.allStaticNumericValue;
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
  sort(key: string) { 
    for (const h of this.header) { 
      if (h.key === key) { 
        if (h.sort != "up") { 
          h.sort = "up";
          this.rows = this.rows.sort((a:any, b:any) => { 
            const va = String(a[key]);
            const vb = String(b[key]);
            return va.localeCompare(vb);
          });
        } else { 
          h.sort = "down";
          this.rows = this.rows.sort((a:any, b:any) => { 
            const va = String(a[key]);
            const vb = String(b[key]);
            return vb.localeCompare(va);
          });
        }
      } else { 
        h.sort = "";
      }
    }
  }

  formatWeekday(date: string) {
    const d = new Date(date)
    const n = (d.getDay() + 6) % 7 + 1;
    return n + "-" + d.toLocaleDateString(this.language.lang, { weekday: 'long' }); 
  }

  formatDate(date: string) {
    const d = new Date(date)
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

}
