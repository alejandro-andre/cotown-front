import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ApoloQueryApi {

  token = '';

  constructor(
    private apollo: Apollo
  ) {}

  getData(query: string, variables: any = undefined): Observable<any> {

    return this.apollo.watchQuery({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'no-cache',
      variables: {...variables, authorization: `${this.token}`},
    }).valueChanges;
    
  }

}