import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import {default as _rollupMoment, Moment } from 'moment';
import { ProviderListQuery } from 'src/app/schemas/query-definitions/lookup.query';

import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';

const moment = _rollupMoment;

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})

export class DownloadComponent {

  // Spinner
  public spinnerActive: boolean = false;

  // Form controls
  public bookingIdControl        = new FormControl<any>('', [ Validators.required ]);
  public providerControl         = new FormControl(-1);
  public billDateControl         = new FormControl<any>('', [ Validators.required ]);
  public providerDownloadControl = new FormControl(-1);
  public billDownloadDateControl = new FormControl<any>('', [ Validators.required ]);

  public incomeDateControl = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });

  public paymentDateControl = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });

  public contractDateControl      = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });

  public bookingDateControl      = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });
  
  // Providers
  public providers: {id:number, name:string}[] = [];

  // Constructor
  constructor(
    private apolloApi: ApolloQueryApi,
    private adapter: DateAdapter<any>,
    private language: LanguageService,
    private sanitizer: DomSanitizer
  ) { 
    this.adapter.setLocale(this.language.lang.substring(0,2));
    this.apolloApi.getData(ProviderListQuery).subscribe(res => {
      this.providers = res.data.data;
    });
  }    

  // Check if report can be executed
  check (data: string) {

    if (data == "rooming") {
      if (!this.bookingIdControl.value)
      return true;
    } else if (data == "reservas") {
      if (!this.bookingDateControl.value.start || !this.bookingDateControl.value.end)
      return true;
    } else if (data == "facturas") {
      if (this.billDateControl.value === '')
        return true;
    } else if (data == "ingresos") {
        if (!this.incomeDateControl.value.start || !this.incomeDateControl.value.end || 
            this.providerControl.value == null || this.providerControl.value < 0)
          return true
    } else if (data == "pagos") {
        if (!this.paymentDateControl.value.start || !this.paymentDateControl.value.end || 
            this.providerControl.value == null || this.providerControl.value < 0)
          return true
    } else if (data == "downloadcontratos") {
      if (!this.contractDateControl.value.start || !this.contractDateControl.value.end)
        return true
    } else if (data == "downloadfacturas") {
      if (this.billDownloadDateControl.value === '')
        return true
    }
  return false;
  }

  // Execute report
  execute (data: string) {

    // Default
    let l = 'javascript:void(0)';

    // occupancy
    if (data == "occupancy") {
      l = environment.backURL + '/occupancy?fdesde=2023-10-01&fhasta=2024-12-31' + '&access_token=' + this.apolloApi.token;
    
    // Weekly report
    } else if (data == "weekly") {
      l = environment.backURL + '/export/weekly?fdesde=2020-01-01&fhasta=2099-12-31' + '&access_token=' + this.apolloApi.token;
  
    // Rooming
    } else if (data == "rooming") {
    const id = this.bookingIdControl.value;
    l = environment.backURL + '/export/rooming?id=' + id + '&access_token=' + this.apolloApi.token;

    // Reservas
    } else if (data == "reservas") {
    const from = moment(this.bookingDateControl.value.start);
    const to = moment(this.bookingDateControl.value.end).add(1,'d');
    l = environment.backURL + '/export/reservas' 
      + '?fdesde=' + from.format('YYYY-MM-DD') 
      + '&fhasta=' + to.format('YYYY-MM-DD') 
      + '&access_token=' + this.apolloApi.token;

    // Facturas
    } else if (data == "facturas") {
      const from = moment(this.billDateControl.value);
      const to = moment(from).add(1, 'M');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/export/facturas' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Pagos
    } else if (data == "pagos") {
      const from = moment(this.paymentDateControl.value.start);
      const to = moment(this.paymentDateControl.value.end).add(1,'d');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/export/pagos' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Ingresos
    } else if (data == "ingresos") {
      const from = moment(this.incomeDateControl.value.start);
      const to = moment(this.incomeDateControl.value.end).add(1,'d');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/export/ingresos' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Contratos PDF
    } else if (data == "downloadcontratos") {
      const from = moment(this.contractDateControl.value.start);
      const to = moment(this.contractDateControl.value.end).add(1,'d');
      const prov_from = this.providerControl.value; 
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/download/contratos' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Facturas PDF
    } else if (data == "downloadfacturas") {
      const from = moment(this.billDownloadDateControl.value);
      const to = moment(from).add(1, 'M');
      const prov_from = this.providerControl.value; 
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/download/facturas' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Resto
    } else {
      l = environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
    }

    // Fetch link
    this.spinnerActive = true;
    fetch(l)
      .then(response => response.blob())
      .then(blob => {
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        this.spinnerActive = false;
        link.click();
      })
      .catch(error => {
        this.spinnerActive = false;
      });
  }
  
  setMonthAndYear(value: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    const m = moment(value);
    control.setValue(m);
    datepicker.close();
  }
  
}