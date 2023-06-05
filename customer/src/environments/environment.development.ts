import keycloakConfig from './keycloak.config';

export const environment = {
  production: false,
  backURL: 'https://dev.cotown.ciber.es/api/v1',
  graphqlURL: 'https://experis.flows.ninja/graphql',
  keycloak: keycloakConfig,
};