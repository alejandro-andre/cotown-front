import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { environment } from 'src/environments/environment';
import { ApolloQueryApi } from "src/app/services/apollo-api.service";
import axiosApi from "src/app/services/api.service";

@Component({ 
  selector: "app-home",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
 })

export class DashboardComponent implements OnInit { 

  public spinnerActive: boolean = true;

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
    { key:"checkout",           value: "Salida" },
    { key:"devolvergarantia",   value: "Devolver garantía" },
  ];

  public headerFields: { key: string, value: string, sort: string }[] = [
    { key:"Name",      value:"Residente",   sort:"" },
    { key:"Status",    value:"Estado",      sort:"" },
    { key:"Date_from", value:"Fecha desde", sort:"" }, 
    { key:"Date_to",   value:"Fecha hasta", sort:"" },
    { key:"Check_in",  value:"Check-in",    sort:"" },
    { key:"Check_out", value:"Check-out",   sort:"" },
    { key:"Building",  value:"Edificio",    sort:"" },
    { key:"Resource",  value:"Recurso",     sort:"" },
    { key:"Arrival",   value:"Llegada",     sort:"" },
    { key:"Flight",    value:"Tren/Vuelo",  sort:"" },
    { key:"Option",    value:"Opción",      sort:"" },
  ];

  public header: { key: string, value: string, sort: string } [] = [];

  // Constructor
  constructor(    
    private apolloApi: ApolloQueryApi,
  ) { }

  ngOnInit(): void { 
    this.spinnerActive  = true;
    axiosApi.getDashboard(this.apolloApi.token).then((res) => { 
      this.dashboard = res.data;
      axiosApi.getLabels(7, "es_ES", this.apolloApi.token).then((res) => { 
        this.labels = res.data;
        this.spinnerActive  = false;
      }); 
    })       
  }

  getBookings(status: string): void { 
    this.status = status;
    this.rows = null;
    axiosApi.getDashboardBookings(this.status, this.apolloApi.token).then((res) => { 
      this.rows = res.data;
      if (this.rows.length) { 
        console.log(this.rows)
        const keys = Object.keys(this.rows[0]);
        this.header = this.headerFields.filter(d => keys.includes(d.key));
      }
      this.spinnerActive  = false;
    });      
  }

  link() { 
    if (this.status)
      return environment.backURL + '/dashboard/export/' + this.status + '?access_token=' + this.apolloApi.token;
    return "javascript:void(0);";
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
