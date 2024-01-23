import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApolloQueryApi {

  token: string = '';

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

  setData(query: string, variables: any):Observable<any> {
    return this.apollo.mutate({
      mutation: gql`${query}`,
      variables: {...variables, authorization: `${this.token}`},
    })
  }
}