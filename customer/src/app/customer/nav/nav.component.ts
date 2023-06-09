import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Constants } from 'src/app/constants/Constants';
import { Nav } from 'src/app/constants/Interface';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit{

  public urls = Constants.NAV_URLS;
  public selected: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setActiveRoute();
    }, 300);
  }

  setActiveRoute(): void {
    const url = this.router.url ? this.router.url : '';
    if (this.router.url && this.router.url !== '') {
      const urls = url.split('/');
      this.selected = urls[urls.length -1 ];
    }
  }

  onSelect(data: string) {
    if (data !== Constants.NAV_LOG_OUT.url) {
      this.selected = data;
      this.router.navigate([`${data}`]);
    } else {
      this.logout();
    }
  }

  get navUrls (): Nav[] {
    return this.urls;
  }

  public logout(): void {
    this.authService.logout();
  }
}
