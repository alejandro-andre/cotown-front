import keycloakConfig from './keycloak.config';

export const environment = {
  production: false,
  graphqlURL: 'https://experis.flows.ninja/graphql',
  keycloak: keycloakConfig,
};