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

  // Form controls
  public billDateControl    = new FormControl<any>('', [ Validators.required ]);
  public providerControl    = new FormControl();
  public paymentDateControl = new FormGroup({
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

  // Execute report
  execute (data: string) {

    // Default
    let l = 'javascript:void(0)';

    // Facturas
    if (data == "facturas") {
      const from = moment(this.billDateControl.value);
      const prov_from = this.providerControl.value;
      let prov_to = 99;
      if (prov_from != 0)
        prov_to = prov_from; 
      const to = moment(from).add(1, 'M');
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
      let prov_to = 99;
      if (prov_from != 0)
        prov_to = prov_from; 
      l = environment.backURL + '/export/pagos' 
        + '?fdesde=' + from.format('YYYY-MM-DD') 
        + '&fhasta=' + to.format('YYYY-MM-DD') 
        + '&pdesde=' + prov_from
        + '&phasta=' + prov_to
        + '&access_token=' + this.apolloApi.token;

    // Resto
    } else {
      l = environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
    }

    // Link
    const link = document.createElement('a');
    link.href = l;
    link.click();
  }
  
  setMonthAndYear(value: Moment, datepicker: MatDatepicker<Moment>) {
    const m = moment(value);
    this.billDateControl.setValue(m);
    datepicker.close();
  }

  showMonth() {
    console.log(this.billDateControl.value!);
  }
  
}