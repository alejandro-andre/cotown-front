import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  get navUrls (): Nav[] {
    if (this.showTutorVariable) {
      return this.urls;
    }else {
      return this.urls.filter((elem) => elem.name !== Constants.TUTOR.name);
    }
  }

  public selected: string = '';

  constructor(
    private _router: Router
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
    const url = this._router.url ? this._router.url : '';
    if (this._router.url && this._router.url !== '') {
      const arrayOfSplitedUrls = url.split('/');
      this.selected = arrayOfSplitedUrls[arrayOfSplitedUrls.length -1 ];
    }
  }

  onSelect(data: string) {
    this.selected = data;
    this._router.navigate([`customer/${data}`]);
  }
}
