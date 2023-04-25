import keycloakConfig from './keycloak.config';

export const environment = {
  production: true,
  graphqlURL: 'https://core.cotown.com/graphql',
  keycloak: keycloakConfig,
};
