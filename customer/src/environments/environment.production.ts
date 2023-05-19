import keycloakConfig from './keycloak.config';

export const environment = {
  production: true,
  backURL: 'https://pre.cotown.ciber.es/api/v1',
  graphqlURL: 'https://core.cotown.com/graphql',
  keycloak: keycloakConfig,
};