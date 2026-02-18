import { environment } from '../environments/environment';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';

const uri = environment.baseURL + 'graphql';

export function createApollo(httpLink: HttpLink, apolloQueryApi: ApolloQueryApi) {

  console.log('ApolloQueryApi instance used by Apollo:', apolloQueryApi.instanceId);

  const auth = setContext((operation, context) => {
    return {
      headers: {
        Accept: 'charset=utf-8',
        Authorization: apolloQueryApi.token ? `Bearer ${apolloQueryApi.token}` : '',
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