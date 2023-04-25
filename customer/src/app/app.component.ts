import { Component } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';

import { AuthService } from './auth/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

}
