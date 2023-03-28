import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { AccessTokenService } from './access-token.service';

@Injectable({
  providedIn: 'root'
})

export class ApoloQueryApi {
  constructor(
    private accessToken: AccessTokenService,
    private apollo: Apollo
  ) {}

  getData(query: string): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`${query}`,
      variables: {
          authorization: `${this.accessToken.token}`
        }
    }).valueChanges;
  }
}