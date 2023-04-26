import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakTokenParsed } from 'keycloak-js';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';

@Injectable()
export class AuthService {

  loggedIn: boolean = false;
  keycloakToken: string = '';
  airflowsToken: string = '';

  constructor(
    private keycloakService: KeycloakService,
    private apolloApi: ApoloQueryApi,
  ) {}

  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      const userDetails: KeycloakTokenParsed | undefined = this.keycloakService.getKeycloakInstance().idTokenParsed;
      return userDetails;
    } catch (e) {
      console.error("Exception", e);
      return undefined;
    }
  }

  public login() : void {
    this.keycloakService.login().then(() => {
      this.loggedIn = true;
      console.log("Logged in");
    })
    .catch(error => {
      this.loggedIn = false;
      console.error(error);
    });
  }

  public logout() : void {
    this.loggedIn = false;
    this.keycloakService.logout(window.location.origin).then(() => {
      console.log("Logged out");
    })
    .catch(error => {
      console.error(error);
    });;
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  public getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  public getAirflowsToken(): Promise<void> {
    return new Promise ((resolve, reject) => {
      this.keycloakService.getToken().then(token => {
        this.keycloakToken = token;
        this.loggedIn = true;
        console.log("Logged in");
        this.apolloApi.getData(`{ refreshToken(token:"${token}") }`).subscribe(res => {
          this.airflowsToken = res.data.refreshToken;
          this.apolloApi.token = res.data.refreshToken;
          resolve();
        });
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
    })

  }

}