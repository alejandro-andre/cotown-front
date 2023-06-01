import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {default as _rollupMoment, Moment, unitOfTime} from 'moment';

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

  // Dates
  billDate = new FormControl();
  paymentDate = new FormControl();

  // Constructor
  constructor(
    private apolloApi: ApolloQueryApi,
    private adapter: DateAdapter<any>,
    private language: LanguageService,
    private sanitizer:DomSanitizer
  ) { 
    this.adapter.setLocale(this.language.lang.substring(0,2));
  }    

  // Link
  link(data: string) : SafeUrl {

    // Default
    let l = 'javascript:void(0)';

    // Facturas
    if (data == "facturas") {
      if (this.billDate.value) {
        const from = moment(this.billDate.value);
        const to = moment(from).add(1, 'M');
        l = environment.backURL + '/export/facturas' 
          + '?desde=' + from.format('YYYY-MM-DD') 
          + '&hasta=' + to.format('YYYY-MM-DD') 
          + '&access_token=' + this.apolloApi.token;
      }

    // Pagos
    } else if (data == "pagos") {
      if (this.paymentDate.value) {
        const to = moment(this.paymentDate.value);
        l =  environment.backURL + '/export/pagos?' 
          + 'fecha=' + to.format('YYYY-MM-DD') 
          + '&access_token=' + this.apolloApi.token;
      }

    // Resto
    } else {
      l = environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
    }

    // Return
    return this.sanitizer.bypassSecurityTrustUrl(l);
  }

  setMonthAndYear(value: Moment, datepicker: MatDatepicker<Moment>) {
    const m = moment(value);
    this.billDate.setValue(m);
    datepicker.close();
  }

  showMonth() {
    console.log(this.billDate.value!);
  }
  
}