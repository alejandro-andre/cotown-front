import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

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
  billDate = new FormControl(moment());
  paymentDate = new FormControl(moment());

  // Constructor
  constructor(
    private apolloApi: ApolloQueryApi,
    private adapter: DateAdapter<any>,
    private language: LanguageService,
  ) { 
    this.adapter.setLocale(this.language.lang.substring(0,2));
  }    

  // Link
  link(data: string) : string {
    if (data == "facturas") {
      const from = moment(this.billDate.value);
      const to = moment(from).add(1, 'M');
      return environment.backURL + '/export/facturas' 
        + '?desde=' + from.format('YYYY-MM-DD') 
        + '&hasta=' + to.format('YYYY-MM-DD') 
        + '&access_token=' + this.apolloApi.token;
    }
    if (data == "pagos") {
      const to = moment(this.paymentDate.value);
      return environment.backURL + '/export/pagos?' 
        + 'fecha=' + to.format('YYYY-MM-DD') 
        + '&access_token=' + this.apolloApi.token;
    }
    return environment.backURL + '/export/' + data 
        + '?access_token=' + this.apolloApi.token;
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