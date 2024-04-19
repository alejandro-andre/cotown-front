import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { environment } from 'src/environments/environment';
import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";
import { DatePipe } from "@angular/common";

@Component({ 
  selector: "app-dashboard-general",
  templateUrl: "./general.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class GeneralDashboardComponent implements OnInit { 

  // Parent
  private parent: any = null;

  public isLoading: boolean = true;

  public dashboard: any = null;
  public rows: any = null;

  public labels: any = null;

  public status: string = "";
  public select: { key: string, value: string }[] = [
    { key:"solicitud",          value: "No pagadas" },
    { key:"solicitudpagada",    value: "Pagadas" },
    { key:"alternativas",       value: "No pagadas" },
    { key:"alternativaspagada", value: "Pagadas" },
    { key:"descartadapagada",   value: "Pagadas" },
    { key:"caducada",           value: "Caducadas" },
    { key:"pendientepago",      value: "Aceptadas" },
    { key:"confirmada",         value: "Preconfirmadas" },
    { key:"ok",                 value: "Confirmadas" },
    { key:"next",               value: "Próximas" },
    { key:"checkin",            value: "Llegada" },
    { key:"nextout",            value: "Próximas" },
    { key:"checkout",           value: "Salida" },
    { key:"devolvergarantia",   value: "Devolver garantía" },
  ];

  public headerFields: { key: string, value: string, sort: string, type: string, filter: string[] }[] = [
    { key:"id",                   value:"#",           sort:"", type:"text", filter:[] },
    { key:"Name",                 value:"Residente",   sort:"", type:"text", filter:[] },
    { key:"Status",               value:"Estado",      sort:"", type:"text", filter:["next", "nextout", "ok"] },
    { key:"Date_from",            value:"Fecha desde", sort:"", type:"date", filter:[] }, 
    { key:"Date_to",              value:"Fecha hasta", sort:"", type:"date", filter:[] },
    { key:"Check_in",             value:"Check-in",    sort:"", type:"date", filter:["next", "nextout", "ok", "checkin", "checkout", "devolvergarantia"] },
    { key:"Check_out",            value:"Check-out",   sort:"", type:"date", filter:["next", "nextout", "ok", "checkin", "checkout", "devolvergarantia"] },
    { key:"Building",             value:"Edificio",    sort:"", type:"text", filter:[] },
    { key:"Resource",             value:"Recurso",     sort:"", type:"text", filter:["next", "nextout", "ok", "pendientepago", "confirmada", "checkin", "checkout", "devolvergarantia", "caducada"] },
    { key:"Arrival",              value:"Llegada",     sort:"", type:"text", filter:["next"] },
    { key:"Flight",               value:"Tren/Vuelo",  sort:"", type:"text", filter:["next"] },
    { key:"Option",               value:"Opción",      sort:"", type:"text", filter:["next"] },
    { key:"Check_in_room_ok",     value:"Lim",         sort:"", type:"text", filter:["next", "checkin"] },
    { key:"Check_in_keys_ok",     value:"Lla",         sort:"", type:"text", filter:["next", "checkin"] },
    { key:"Check_in_keyless_ok",  value:"Kls",         sort:"", type:"text", filter:["next", "checkin"] }, 
    { key:"Check_out_keys_ok",    value:"Lla",         sort:"", type:"text", filter:["nextout", "checkout"] },
    { key:"Check_out_keyless_ok", value:"Kls",         sort:"", type:"text", filter:["nextout", "checkout"] }
  ];

  public header: { key: string, value: string, sort: string, type: string } [] = [];

  // Constructor
  constructor(    
    private apolloApi: ApolloQueryApi,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void { 
    this.isLoading  = true;
    axiosApi.getDashboard(this.apolloApi.token).then((res) => { 
      this.dashboard = res.data;
      axiosApi.getLabels(7, "es_ES", this.apolloApi.token).then((res) => { 
        this.labels = res.data;
        this.isLoading  = false;
      }); 
    })       
  }

  getBookings(status: string): void { 
    this.status = status;
    this.rows = null;
    axiosApi.getDashboardBookings(this.status, this.apolloApi.token, {}).then((res) => { 
      this.rows = res.data.map((o: any) => { 
        return {
          "id": o.id,
          "Name": o.Name,
          "Status": o.Status,
          "Date_from": this.formatDate(o.Date_from),
          "Date_to": this.formatDate(o.Date_to),
          "Check_in": this.formatDate(o.Check_in),
          "Check_out": this.formatDate(o.Check_out),
          "Building": o.Building,
          "Resource": o.Resource,
          "Arrival": o.Arrival,
          "Flight": o.Flight,
          "Option": o.Option,
          "Check_in_room_ok": o.Check_in_room_ok,
          "Check_in_keys_ok": o.Check_in_keys_ok,
          "Check_in_keyless_ok": o.Check_in_keyless_ok,
          "Check_out_keys_ok": o.Check_out_keys_ok,
          "Check_out_keyless_ok": o.Check_out_keysless_ok,
        }
      });
      if (this.rows.length) { 
        const keys = Object.keys(this.rows[0]);
        this.header = this.headerFields.filter(d => keys.includes(d.key) && (d.filter.length == 0 || d.filter.includes(this.status)));
      }
      this.isLoading  = false;
    });      
  }

  link() { 
    // No status
    if (!this.status)
      return "javascript:void(0);";

    // Next checkins
    if (this.status == 'next') 
      return environment.backURL + '/export/dashboardnext?access_token=' + this.apolloApi.token;

    // Next checkouts
    if (this.status == 'nextout') 
      return environment.backURL + '/export/dashboardnextout?access_token=' + this.apolloApi.token;

    // Confirmed bookings
    if (this.status == 'ok') 
      return environment.backURL + '/export/dashboard?status=firmacontrato,contrato,checkinconfirmado&access_token=' + this.apolloApi.token;

    // Rest of status
    return environment.backURL + '/export/dashboard?status=' + this.status + ',' + this.status + '&access_token=' + this.apolloApi.token;
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

  formatDate(date: string) {
    const d = new Date(date)
    return this.datePipe.transform(date, "dd/MM/yyyy")
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

}
