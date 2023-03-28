import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { AccessTokenService } from '../../services/access-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public rates: any[] = [];
  public query = `   {
    Provider_ProviderList {
      id,
      Address_min,
      Created_at,
    }
  }`;
  loading = true;
  error: any;

  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi
  ) { }

  ngOnInit() {
    if (this.accessToken.token == '') {
      this.route.queryParams.subscribe(params => {
        this.accessToken.token = params['access_token'];
      });
      
      this.apolloApi.getData(this.query).subscribe((result: any) => {
        this.rates = result.data?.Provider_ProviderList;
        this.loading = result.loading;
        this.error = result.error;
      });
    }
  }

}
