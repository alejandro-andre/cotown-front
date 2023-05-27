import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApolloQueryApi as ApolloQueryApi } from 'src/app/services/apollo-api.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent {

    public excelUrl: SafeUrl | undefined;

    // Constructor
    constructor(
      private http: HttpClient,
      private apolloApi: ApolloQueryApi,
      private sanitizer: DomSanitizer
    ) { }    

    // Download excel
    link(data: string) : boolean {
      console.log(data)
      const url = environment.backURL + '/export/' + data + '?access_token=' + this.apolloApi.token;
      this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
        this.excelUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
      });
      return false;
    }    
}


