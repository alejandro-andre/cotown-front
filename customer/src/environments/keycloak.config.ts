import { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
    url: 'https://experis.flows.ninja/auth',
    realm: 'airflows',
    clientId: 'airflows-private'
}

export default keycloakConfig;
