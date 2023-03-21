import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AccessTokenService } from '../../services/access-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  rates: any[] = [];
  loading = true;
  error: any;

  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    if (this.accessToken.token == '') {
      this.route.queryParams.subscribe(params => {
        this.accessToken.token = params['access_token'];
        localStorage.setItem('token', this.accessToken.token);
      });

      this.apollo
      .watchQuery({
        query: gql`
          {
            Provider_ProviderList {
              id,
              Address_min,
              Created_at,
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.rates = result.data?.rates;
        this.loading = result.loading;
        this.error = result.error;

        console.log(result)
      });
    }
  }

}
