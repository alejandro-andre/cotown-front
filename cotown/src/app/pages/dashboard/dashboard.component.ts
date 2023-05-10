import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import axiosApi from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  public spinnerActive: boolean = true;

  public dashboard: any = null;
  public rows: any = null;

  public labels: any = null;

  public status: string = '';
  public select = [
    {'key':'solicitud', 'value': 'No pagadas'},
    {'key':'solicitudpagada', 'value': 'Pagadas'},
    {'key':'alternativas', 'value': 'No pagadas'},
    {'key':'alternativaspagada', 'value': 'Pagadas'},
    {'key':'caducada', 'value': 'Caducadas'},
    {'key':'pendientepago', 'value': 'Aceptadas'},
    {'key':'confirmada', 'value': 'Preconfirmadas'},
    {'key':'ok', 'value': 'Confirmadas'},
    {'key':'next', 'value': 'Próximas'},
    {'key':'checkin', 'value': 'Llegada'},
    {'key':'checkout', 'value': 'Salida'},
    {'key':'devolvergarantia', 'value': 'Devolver garantía'},
  ]


  // Constructor
  constructor() { }

  ngOnInit(): void {
    this.spinnerActive  = true;
    axiosApi.getDashboard().then((resp) => {
      this.dashboard = resp.data;
      console.log(resp.data);
      axiosApi.getLabels(7, "es_ES").then((resp) => {
        console.log(resp.data);
        this.labels = resp.data;
        this.spinnerActive  = false;
      }); 
    })       
  }

  getBookings(status: string): void {
    this.status = status;
    this.rows = null;
    axiosApi.getBookings(this.status).then((resp) => {
      console.log(resp.data);
      this.rows = resp.data;
      this.spinnerActive  = false;
    });      
  }

  goBooking(id: string) {
    const link = '/admin/Booking.Booking/' + id + '/view';
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
  
}
