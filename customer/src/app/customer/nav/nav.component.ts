import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit{
  @Output() onSelectOption: EventEmitter<string> = new EventEmitter();
  public navs = Constants.NAV_URLS;
  public selected: string = '';

  constructor(
    private _router: Router
  ) {}
  ngOnInit(): void {

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
    this.onSelectOption.next(data);
  }
}
