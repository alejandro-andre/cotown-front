import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/service/auth.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private apolloApi: ApoloQueryApi
  ) { }

  ngOnInit(): void {
    this.authService.getAirflowsToken();
  }

  public login(): void {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }

}
