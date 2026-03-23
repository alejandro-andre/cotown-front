import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApolloQueryApi {

  constructor(
    private apollo: Apollo
  ) {}

  getData(query: string, variables: any = undefined): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.apollo.watchQuery({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'no-cache',
      variables: {...variables, authorization: `${token}`},
    }).valueChanges;
  }

  setData(query: string, variables: any):Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.apollo.mutate({
      mutation: gql`${query}`,
      variables: {...variables, authorization: `${token}`},
    })
  }

  login(username: string, password: string): Observable<string> {
    return this.apollo.mutate<{ login: string }>({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password)
        }
      `,
      variables: { username, password }
    }).pipe(
      map(({ data }) => {
        const token = data?.login ?? '';
        localStorage.setItem('access_token', token);
        return token;
      })
    );
  }
}