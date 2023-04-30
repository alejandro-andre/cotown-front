import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApoloQueryApi {

  token: string = '';

  constructor(
    private apollo: Apollo
  ) {}

  getData(query: string, variables: any = undefined): Observable<any> {
    let  variablesToSend = {
      authorization: `${this.token}`
    };

    if (variables) {
      variablesToSend = {...variables, authorization: `${this.token}`}
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