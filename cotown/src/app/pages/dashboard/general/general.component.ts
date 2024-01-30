import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { environment } from 'src/environments/environment';
import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";

@Component({ 
  selector: "app-dashboard-general",
  templateUrl: "./general.component.html",
  styleUrls: ["../dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class GeneralDashboardComponent implements OnInit { 

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

  public headerFields: { key: string, value: string, sort: string, filter: string[] }[] = [
    { key:"id",                   value:"#",           sort:"", filter:[] },
    { key:"Name",                 value:"Residente",   sort:"", filter:[] },
    { key:"Status",               value:"Estado",      sort:"", filter:["next", "nextout", "ok"] },
    { key:"Date_from",            value:"Fecha desde", sort:"", filter:[] }, 
    { key:"Date_to",              value:"Fecha hasta", sort:"", filter:[] },
    { key:"Check_in",             value:"Check-in",    sort:"", filter:["next", "nextout", "ok", "checkin", "checkout", "devolvergarantia"] },
    { key:"Check_out",            value:"Check-out",   sort:"", filter:["next", "nextout", "ok", "checkin", "checkout", "devolvergarantia"] },
    { key:"Building",             value:"Edificio",    sort:"", filter:[] },
    { key:"Resource",             value:"Recurso",     sort:"", filter:["next", "nextout", "ok", "pendientepago", "confirmada", "checkin", "checkout", "devolvergarantia", "caducada"] },
    { key:"Arrival",              value:"Llegada",     sort:"", filter:["next"] },
    { key:"Flight",               value:"Tren/Vuelo",  sort:"", filter:["next"] },
    { key:"Option",               value:"Opción",      sort:"", filter:["next"] },
    { key:"Check_in_room_ok",     value:"Lim",         sort:"", filter:["next", "checkin"] },
    { key:"Check_in_keys_ok",     value:"Lla",         sort:"", filter:["next", "checkin"] },
    { key:"Check_in_keyless_ok",  value:"Kls",         sort:"", filter:["next", "checkin"] }, 
    { key:"Check_out_keys_ok",    value:"Lla",         sort:"", filter:["nextout", "checkout"] },
    { key:"Check_out_keyless_ok", value:"Kls",         sort:"", filter:["nextout", "checkout"] }
  ];

  public header: { key: string, value: string, sort: string } [] = [];

  // Constructor
  constructor(    
    private apolloApi: ApolloQueryApi,
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
      this.rows = res.data;
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

 }
