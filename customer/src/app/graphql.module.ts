import { environment } from '../environments/environment';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloQueryApi } from './services/apollo-api.service';

const uri = environment.graphqlURL;

export function createApollo(httpLink: HttpLink, api: ApolloQueryApi) {

  const auth = setContext((operation, context) => {
    console.log('Token un setContext: ' + api.token);
    return {
      headers: {
        Accept: 'charset=utf-8',
        Authorization: api.token ? `Bearer ${api.token}` : '',
      },
    }
  });

  const link = ApolloLink.from([auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }
  };

  return {
    link,
    cache,
    defaultOptions: defaultOptions,
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ApolloQueryApi],
    }
  ],
})
export class GraphQLModule {}