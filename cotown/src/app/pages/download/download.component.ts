import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { environment } from 'src/environments/environment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent {

    // Dates
    billDate = new FormControl(moment([2017, 0, 1]));
    paymentDate = new FormControl(moment([2017, 0, 1]));

    // Constructor
    constructor(
      private apolloApi: ApolloQueryApi,
    ) { }    

    // Link
    link(data: string) : string {
      return environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
    }
    
}