import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessTokenService } from '../../services/access-token.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss']
})
export class SecondComponent {

  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService
  ) { }

  ngOnInit() {
    if (this.accessToken.token == '') {
      this.route.queryParams.subscribe(params => {
        this.accessToken.token = params['access_token'];
      });
    }
  }

}
