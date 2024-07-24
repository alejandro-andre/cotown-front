import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {default as _rollupMoment, Moment } from 'moment';
import { BUILDINGS_QUERY } from 'src/app/schemas/query-definitions/building.query';
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
    { name: 'propietarios',      cotown: true,  provider: false, icon: 'account_box',        filter: false, text: 'Propietarios' },
    { name: 'edificios',         cotown: true,  provider: false, icon: 'business',           filter: false, text: 'Edificios' },
    { name: 'recursos',          cotown: true,  provider: false, icon: 'apps',               filter: false, text: 'Recursos, precios, tarifas' },
    { name: 'inventario',        cotown: true,  provider: false, icon: 'art_track',          filter: false, text: 'Inventario' },
    { name: 'precios',           cotown: true,  provider: false, icon: 'monetization_on',    filter: false, text: 'Precios' },
    { name: 'weekly',            cotown: true,  provider: false, icon: 'blur_linear',        filter: false, text: 'Reservas PowerBI', url: 'export/weekly?fdesde=2020-01-01&fhasta=2099-12-31' },
    { name: 'devoluciones',      cotown: true,  provider: false, icon: 'cached',             filter: false, text: 'Devoluciones' },
    { name: 'occupancy',         cotown: true,  provider: false, icon: 'calendar_today',     filter: true,  text: 'Monthly'},
    { name: 'disponibilidad',    cotown: true,  provider: false, icon: 'hotel',              filter: true,  text: 'Disponibilidad'},
    { name: 'ac',                cotown: true,  provider: false, icon: 'send',               filter: true,  text: 'ActiveCampaign'},
    { name: 'rooming',           cotown: true,  provider: false, icon: 'people',             filter: true,  text: 'Rooming list' },
    { name: 'reservas',          cotown: true,  provider: false, icon: 'event',              filter: true,  text: 'Reservas' },
    { name: 'pagosemitidos',     cotown: true,  provider: false, icon: 'local_atm',          filter: true,  text: 'Pagos emitidos' },
    { name: 'pagosrecibidos',    cotown: true,  provider: false, icon: 'local_atm',          filter: true,  text: 'Pagos recibidos' },
    { name: 'sepa',              cotown: true,  provider: false, icon: 'account_balance',    filter: false, text: 'SEPA' },
    { name: 'ingresos',          cotown: true,  provider: true,  icon: 'receipt',            filter: true,  text: 'Ingresos' },
    { name: 'ingresos_prop',     cotown: false, provider: true,  icon: 'receipt',            filter: true,  text: 'Ingresos' },
    { name: 'contratos',         cotown: true,  provider: false, icon: 'playlist_add_check', filter: true,  text: 'Contratos' },
    { name: 'forecast',          cotown: true,  provider: false, icon: 'query_stats',        filter: true,  text: 'Plantilla Forecast' },
  ];
  down = [
    { name: 'downloadcontratos', cotown: true,  provider: true,  icon: 'attachment',         filter: true,  text: 'Contratos',           url: '/download/contratos' },
    { name: 'downloadfacturas',  cotown: true,  provider: true,  icon: 'attachment',         filter: true,  text: 'Facturas y recibos',  url: '/download/facturas' },
  ];
  selectedItem: any = null;

  // Spinner
  public isLoading: boolean = false;

  // Form controls
  public bookingIdControl = new FormControl<any>('', [ Validators.required ]);
  public providerControl  = new FormControl(-1);
  public buildingControl  = new FormControl(-1);
  public billDateControl  = new FormControl<any>('', [ Validators.required ]);
  public dateControl      = new FormControl<any>('', [ Validators.required ]);
  public dateRangeControl = new FormGroup({
    start: new FormControl<Date | null>(null, [ Validators.required ]),
    end: new FormControl<Date | null>(null, [ Validators.required ]),
  });
  
  // Providers
  public providers: {id:number, name:string}[] = [];
  public buildings: {id:number, name:string}[] = [];

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
    this.apolloApi.getData(BUILDINGS_QUERY).subscribe((res: any) => {
      this.buildings = res.data.data;
      this.buildingControl.setValue(this.buildings[0].id);
    });
  }    

  // Accesible reports
  get reports() {
    return this.reps.filter(r => this.providers && ((r.provider && this.providers.length == 1) || (r.cotown && this.providers.length > 1)));
  }
  get downloads() {
    return this.down.filter(r => this.providers && ((r.provider && this.providers.length == 1) || (r.cotown && this.providers.length > 1)));
  }

  // Report selected
  selectItem(item: any) {
    this.selectedItem = item.name;
    if (!item.filter) {
      this.report(environment.backURL + '/' + (item.url || item.name))
      this.selectedItem = null;
    }
  }

  // Check if report can be executed
  check (data: string) {
    if (data == "ac") {
      if (!this.dateControl.value)
        return true;
    } else if (data == "rooming") {
        if (!this.bookingIdControl.value)
          return true;
    } else if (data == "disponibilidad" || data == "occupancy" || data == "reservas" || data == "pagosrecibidos") {
      if (!this.dateRangeControl.value.start || !this.dateRangeControl.value.end)
        return true;
    } else if (data == "facturas") {
        if (this.billDateControl.value === '')
          return true;
    } else if (data == "ingresos" || data == "pagosemitidos" || data == "downloadcontratos") {
      if (!this.dateRangeControl.value.start || !this.dateRangeControl.value.end || 
          this.providerControl.value == null || this.providerControl.value < 0)
        return true
    } else if (data == "contratos") {
      if (!this.dateRangeControl.value.start || !this.dateRangeControl.value.end)
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

    // Rooming
    if (data == "rooming") {
    const id = this.bookingIdControl.value;
    l = environment.backURL + '/export/rooming?id=' + id + '&access_token=' + this.apolloApi.token;

    // AC
    } else if (data == 'ac') {
    const from = moment(this.dateControl.value);
    l = environment.backURL + '/export/' + data
      + '?fdesde=' + from.format('YYYY-MM-DD') 
      + '&access_token=' + this.apolloApi.token;

    // Reservas y contratos
  } else if (data == "disponibilidad" || data == "occupancy" || data == "reservas" || data == "pagosrecibidos" || data == "contratos" || data == "forecast") {
    const from = moment(this.dateRangeControl.value.start);
    const to = moment(this.dateRangeControl.value.end).add(1,'d');
    l = environment.backURL + '/export/' + data
      + '?fdesde=' + from.format('YYYY-MM-DD') 
      + '&fhasta=' + to.format('YYYY-MM-DD') 
      + '&access_token=' + this.apolloApi.token;

    // Pagos e ingresos
    } else if (data == "pagosemitidos" || data == "ingresos") {
      const from = moment(this.dateRangeControl.value.start);
      const to = moment(this.dateRangeControl.value.end).add(1,'d');
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
      const from = moment(this.dateRangeControl.value.start);
      const to = moment(this.dateRangeControl.value.end).add(1,'d');
      const prov_from = this.providerControl.value;
      const prov_to = prov_from || 99999; 
      const building_from = this.buildingControl.value;
      const building_to = building_from || 99999; 
      l = environment.backURL + '/download/contratos' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&bdesde=' + building_from
        + '&bhasta=' + building_to
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
    this.report(l);
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
  
  setMonthAndYear(value: Moment, rangepicker: MatDatepicker<Moment>, control: FormControl) {
    const m = moment(value);
    control.setValue(m);
    rangepicker.close();
  }
  
}