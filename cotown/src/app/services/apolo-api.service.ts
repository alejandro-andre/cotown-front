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

  getData(query: string, variables: any = undefined): Observable<any> {
    console.log(variables);
    let  variablesToSend = {
      authorization: `${this.accessToken.token}`
    };

    if (variables) {
      variablesToSend = {...variables, authorization: `${this.accessToken.token}`}
    }

    return this.apollo.watchQuery({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'no-cache',
      variables: {
        ...variablesToSend
        },
    }).valueChanges;
  }

  // TODO only for develop!
  login() {
    const loginQuery = `mutation {login(username:"modelsadmin", password: "Ciber$2022")}`
    return this.apollo.mutate({
      mutation: gql`${loginQuery}`,
    })
  }
}