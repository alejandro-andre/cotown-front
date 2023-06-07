import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Constants } from 'src/app/constants/Constants';
import { Nav } from 'src/app/constants/Interface';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit{

  @Input() showTutor!: Observable<boolean>;
  public showTutorVariable = false;

  public urls = Constants.NAV_URLS;
  public TUTOR = Constants.TUTOR;
  public selected: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.showTutor) {
      this.showTutor.subscribe((ev:boolean ) => this.showTutorVariable = ev);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setActiveRoute();
    }, 300);
  }

  setActiveRoute(): void {
    const url = this.router.url ? this.router.url : '';
    if (this.router.url && this.router.url !== '') {
      const arrayOfSplitedUrls = url.split('/');
      this.selected = arrayOfSplitedUrls[arrayOfSplitedUrls.length -1 ];
    }
  }

  onSelect(data: string) {
    if (data !== Constants.LOG_OUT.url) {
      this.selected = data;
      this.router.navigate([`${data}`]);
    } else {
      this.logout();
    }
  }

  get navUrls (): Nav[] {
    if (this.showTutorVariable) {
      return this.urls;
    } else {
      return this.urls.filter((elem) => elem.name !== Constants.TUTOR.name);
    }
  }

  public logout(): void {
    this.authService.logout();
  }
}
