import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {default as _rollupMoment, Moment } from 'moment';
import { PROVIDERS_QUERY } from 'src/app/schemas/query-definitions/lookup.query';

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

  reps = [
    { name: 'propietarios',      provider: false, icon: 'account_box',        filter: false, text: 'Propietarios',     url: '/export/propietarios' },
    { name: 'edificios',         provider: false, icon: 'business',           filter: false, text: 'Edificios',        url: '/export/edificios' },
    { name: 'recursos',          provider: false, icon: 'hotel',              filter: false, text: 'Recursos, precios, tarifas', url: '/export/recursos' },
    { name: 'precios',           provider: false, icon: 'monetization_on',    filter: false, text: 'Precios',          url: '/export/precios' },
    { name: 'weekly',            provider: false, icon: 'blur_linear',        filter: false, text: 'Reservas PowerBI', url: '/export/weekly?fdesde=2020-01-01&fhasta=2099-12-31' },
    { name: 'occupancy',         provider: false, icon: 'calendar_today',     filter: false, text: 'Monthy',           url: '/occupancy?fdesde=2023-10-01&fhasta=2024-12-31' },
    { name: 'ac',                provider: false, icon: 'send',               filter: false, text: 'ActiveCampaign',   url: '/export/ac' },
    { name: 'rooming',           provider: false, icon: 'people',             filter: true,  text: 'Rooming list' },
    { name: 'reservas',          provider: false, icon: 'event',              filter: true,  text: 'Reservas' },
    { name: 'pagos',             provider: false, icon: 'local_atm',          filter: true,  text: 'Pagos' },
    { name: 'ingresos',          provider: true,  icon: 'receipt',            filter: true,  text: 'Ingresos' },
    { name: 'contratos',         provider: false, icon: 'playlist_add_check', filter: true,  text: 'Contratos' },
  ];
  downloads = [
    { name: 'downloadcontratos', provider: false, icon: 'attachment',         filter: true,  text: 'Contratos', url: '/download/contratos' },
    { name: 'downloadfacturas',  provider: true,  icon: 'attachment',         filter: true,  text: 'Facturas y recibos',  url: '/download/facturas' },
  ];
  selectedItem: any = null;

  // Spinner
  public isLoading: boolean = false;

  // Form controls
  public bookingIdControl = new FormControl<any>('', [ Validators.required ]);
  public providerControl  = new FormControl(-1);
  public billDateControl  = new FormControl<any>('', [ Validators.required ]);
  public dateControl      = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });
  
  // Providers
  public providers: {id:number, name:string}[] = [];

  // Constructor
  constructor(
    private apolloApi: ApolloQueryApi,
    private adapter: DateAdapter<any>,
    private language: LanguageService
  ) { 
    this.adapter.setLocale(this.language.lang.substring(0,2));
    this.apolloApi.getData(PROVIDERS_QUERY).subscribe((res: any) => {
      this.providers = res.data.data;
      this.providerControl.setValue(this.providers[0].id);
    });
  }    

  // Accesible reports
  get reports() {
    return this.reps.filter(r => this.providers && (r.provider || this.providers.length > 1));
  }

  // Report selected
  selectItem(item: any) {
    this.selectedItem = item.name;
    if (!item.filter) {
      this.report(environment.backURL + item.url)
      this.selectedItem = null;
    }
  }

  // Check if report can be executed
  check (data: string) {
    if (data == "rooming") {
        if (!this.bookingIdControl.value)
          return true;
    } else if (data == "reservas") {
        if (!this.dateControl.value.start || !this.dateControl.value.end)
          return true;
    } else if (data == "facturas") {
        if (this.billDateControl.value === '')
          return true;
    } else if (data == "ingresos") {
        if (!this.dateControl.value.start || !this.dateControl.value.end || 
            this.providerControl.value == null || this.providerControl.value < 0)
          return true
    } else if (data == "pagos") {
        if (!this.dateControl.value.start || !this.dateControl.value.end || 
            this.providerControl.value == null || this.providerControl.value < 0)
          return true
    } else if (data == "contratos") {
        if (!this.dateControl.value.start || !this.dateControl.value.end)
          return true
    } else if (data == "downloadcontratos") {
        if (!this.dateControl.value.start || !this.dateControl.value.end || 
            this.providerControl.value == null || this.providerControl.value < 0)
          return true
    } else if (data == "downloadfacturas") {
        if (this.billDateControl.value === '' || 
            this.providerControl.value == null || this.providerControl.value < 0)
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

    // Reservas y contratos
    } else if (data == "reservas" || data == "contratos") {
    const from = moment(this.dateControl.value.start);
    const to = moment(this.dateControl.value.end).add(1,'d');
    l = environment.backURL + '/export/' + data
      + '?fdesde=' + from.format('YYYY-MM-DD') 
      + '&fhasta=' + to.format('YYYY-MM-DD') 
      + '&access_token=' + this.apolloApi.token;

    // Pagos e ingresos
    } else if (data == "pagos" || data == "ingresos") {
      const from = moment(this.dateControl.value.start);
      const to = moment(this.dateControl.value.end).add(1,'d');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/export/' + data
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Contratos PDF
    } else if (data == "downloadcontratos") {
      const from = moment(this.dateControl.value.start);
      const to = moment(this.dateControl.value.end).add(1,'d');
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
      const from = moment(this.billDateControl.value);
      const to = moment(from).add(1, 'M');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      l = environment.backURL + '/download/facturas' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;
    }

    // Report
    this.report(l)
  }

  report(url: string) {
    // Fetch link
    this.isLoading = true;
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        this.isLoading = false;
        link.click();
      })
      .catch(error => {
        this.isLoading = false;
      });
  }
  
  setMonthAndYear(value: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    const m = moment(value);
    control.setValue(m);
    datepicker.close();
  }
  
}