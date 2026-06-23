import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { environment } from 'src/environments/environment';

import axiosApi from "src/app/services/api.service";
import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import { Building, City } from "src/app/constants/Interfaces";
import { CITIES_QUERY } from "src/app/schemas/query-definitions/city.query";
import { BUILDINGS_BY_LOCATION_QUERY, BUILDINGS_QUERY } from "src/app/schemas/query-definitions/building.query";
import { Constants } from "src/app/constants/Constants";
import { FormControl, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { DatePipe } from "@angular/common";
import { LanguageService } from "src/app/services/language.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DOCUMENT_APPROVE_UPDATE } from "src/app/schemas/query-definitions/documents.query";
import { DocumentDialogComponent } from "./document-dialog.component";

@Component({
  selector: "app-dashboard-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class DocumentsDashboardComponent implements OnInit {
  // Parent
  private parent: any = null;

  // Operation
  public op = 'upload';
  public dashboards: any[] = [
    {op: 'upload',  name: 'Documentos pendientes de subir'},
    {op: 'approve', name: 'Documentos pendientes de aprobar'},
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
  public header: { key: string, value: string, sort: string, type: string, group: boolean } [] = [];
  public headerFields: { key: string, value: string, sort: string, type: string, filter: string[], group: boolean }[] = [
    { key:"Booking",      value:"Reserva", sort:"", type: "number",   filter: [],          group: true  },
    { key:"Booking_type", value:"Tipo",    sort:"", type: "text",     filter: [],          group: true  },
    { key:"Status",   value:"Estado",    sort:"", type: "status",     filter: [],          group: true  },
    { key:"Dates",    value:"Fechas",    sort:"", type: "text",       filter: [],          group: true  },
    { key:"Deadline", value:"Entrega máx.", sort:"", type: "date",     filter: [],          group: true  },
    { key:"Resource", value:"Recurso",   sort:"", type: "text",       filter: [],          group: true  },
    { key:"Customer", value:"Cliente",   sort:"", type: "text",       filter: [],          group: true  },
    { key:"Document", value:"Documento", sort:"", type: "document",   filter: [],          group: false },
    { key:"Approved", value:"Aprobado",  sort:"", type: "bool",       filter: ["approve"], group: false },
  ];

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private language: LanguageService,
    private adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private apollo: ApolloQueryApi,
    private dialog: MatDialog
  ) {
    this.reset();
    this.adapter.setLocale(this.language.lang.substring(0, 2));
  }

  async ngOnInit() {
    // Get cities, buildings and labels
    const token = localStorage.getItem('access_token') || '';
    this.isLoading  = true;
    await this.getCities();
    await this.getBuildings();
    await axiosApi.getLabels(7, "es_ES", token).then((res) => {
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
    // Start date range: one year ago
    const start: Date = new Date();
    start.setFullYear(start.getFullYear() - 1);
    this.range.get("start")?.setValue(start);

    // End date range: 15 days from now
    const end: Date = new Date();
    end.setDate(end.getDate() + 15);
    this.range.get("end")?.setValue(end);

    // Columns
    this.rows = [];
    this.header = this.headerFields.filter(d => (d.filter.length == 0 || d.filter.includes(this.op)));
    this.getRecords();
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

  // Get records
  async getRecords() {
    // Spinner
    this.isLoading = true;

    // Clean
    this.rows = [];
    if (!this.op || !this.cityId) {
      this.isLoading = false;
      return;
    }

    // Params
    const params: any = this.get_params();
    const token = localStorage.getItem('access_token') || '';

    // Get documents
    await axiosApi.getDocuments(this.op, token, params).then((res) => {
      this.rows = res.data.map((o: any) => {
        return {
          "id": o.Booking_id,
          "Doc_id": o.id,
          "Booking": o.Booking_id,
          "Booking_type": o.Booking_type,
          "Status": o.Status,
          "Resource": o.Resource + "<br>" + o.Building,
          "Customer": o.Customer + "<br>" + (o.Email || "-") + (o.Phones ? "<br>" + o.Phones : ""),
          "Dates": this.formatDate(o.Date_from) + "<br>" + this.formatDate(o.Date_to),
          "Deadline": this.formatDate(o.Documentation_limit),
          "Warning": this.daysUntil(o.Date_from) < 14,
          "Document": o.Document,
          "Uploaded": o.Uploaded === true,
          "Approved": [o.Approved === true, o.Approved === true],
          "Changed": false,
        }
      });
    });

    // Group documents by booking
    this.groupByBooking();

    // Spinner
    this.isLoading  = false;
  }

  // Keep rows of the same booking contiguous and flag the first one of each
  // group (with its size) so the booking columns can span all its documents
  private groupByBooking() {
    const order: any[] = [];
    const map = new Map<any, any[]>();
    for (const r of this.rows) {
      if (!map.has(r.id)) {
        map.set(r.id, []);
        order.push(r.id);
      }
      map.get(r.id)?.push(r);
    }
    const grouped: any[] = [];
    for (const id of order) {
      const docs = map.get(id) || [];
      docs.forEach((r, i) => {
        r._first = (i === 0);
        r._span = docs.length;
      });
      grouped.push(...docs);
    }
    this.rows = grouped;
  }

  goRecord(id: string) {
    let link = "/admin/Booking.Booking/" + id + "/view";
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

  // View the uploaded document in a dialog
  async viewDocument(row: any) {
    if (!row.Uploaded)
      return;
    this.isLoading = true;
    const token = localStorage.getItem('access_token') || '';
    await axiosApi.getDocumentFile(row.Doc_id, "Document", token).then((res) => {
      const url = URL.createObjectURL(res.data);
      this.dialog.open(DocumentDialogComponent, {
        width: '80vw',
        maxWidth: '80vw',
        data: { title: row.Document, urls: [url] },
      });
    }).finally(() => {
      this.isLoading = false;
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

  // City change
  onCity(): void {
    // Clean
    this.buildingIds = [];
    this.rows = [];
    this.getBuildings();
    this.getRecords();
  }

  // Building change
  onBuilding(): void {
    this.getRecords();
  }

  // Dates change
  onDates(): void {
    this.getRecords();
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

    // Re-group so each booking's documents stay together after sorting
    this.groupByBooking();

  }

  formatDate(date: string) {
    if (date) {
      const d = new Date(date)
      return this.datePipe.transform(date, "dd/MM/yyyy")
    }
    return "-"
  }

  // Days from today until the given date (negative if already past)
  daysUntil(date: string): number {
    if (!date)
      return Infinity;
    const target = new Date(date);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  change(event: any, row: any) {
    row["Changed"] = true;
  }

  emitCheck(event: MatCheckboxChange, key: string, row: any) {
    row[key][0] = event.checked;
    row["Changed"] = row[key][0] != row[key][1];
    return row["Changed"];
  }

  save(row: any) {
    // GraphQL variables
    const variables: any = {
      id: row.Doc_id,
      approved: row["Approved"][0],
    }

    // Update
    this.isLoading = true;
    this.apollo.setData(DOCUMENT_APPROVE_UPDATE, variables).subscribe({
      next: (res) => {
        this.isLoading = false;
        row["Approved"][1] = row["Approved"][0];
        row["Changed"] = false;
        // Once approved, the document leaves the pending list
        if (row["Approved"][0])
          this.rows = this.rows.filter(r => r.Doc_id != row.Doc_id);
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }

  export() {
    const params: any = this.get_params();
    const token = localStorage.getItem('access_token') || '';
    let queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    return environment.backURL + '/report/' + this.op + '?access_token=' + token + '&' + queryString;
  }

}
