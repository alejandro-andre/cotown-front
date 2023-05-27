import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApolloQueryApi as ApolloQueryApi } from 'src/app/services/apollo-api.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent {

    // Constructor
    constructor(
      private apolloApi: ApolloQueryApi,
    ) { }    

    // Link
    link(data: string) : string {
      return environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
    }    
}


