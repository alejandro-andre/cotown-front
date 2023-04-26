import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/service/auth.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './myData.component.html',
  styleUrls: ['./myData.component.scss']
})

export class MyDataComponent implements OnInit {

  constructor(
    private apolloApi: ApoloQueryApi
  ) { }

  ngOnInit(): void {
  }

}
