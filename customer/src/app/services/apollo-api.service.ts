import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApolloQueryApi {

  token: string = '';

  private static c = 0;
  readonly instanceId = ++ApolloQueryApi.c;
  
  constructor(
    private apollo: Apollo
  ) {
    console.log('ApolloQueryApi ctor, instanceId=', this.instanceId);
  }

  getData(query: string, variables: any = undefined): Observable<any> {
    this.apollo.client.resetStore();
    return this.apollo.watchQuery({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'no-cache',
      variables: {...variables, authorization: `${this.token}`},
    }).valueChanges;
  }

  setData(query: string, variables: any):Observable<any> {
    this.apollo.client.resetStore();
    return this.apollo.mutate({
      mutation: gql`${query}`,
      variables: {...variables, authorization: `${this.token}`},
    })
  }
}