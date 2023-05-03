import { Component, EventEmitter, Output } from '@angular/core';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  @Output() onSelectOption: EventEmitter<string> = new EventEmitter();
  public navs = Constants.NAV_URLS;

  constructor() { }

  onSelect(data: string) {
    this.onSelectOption.next(data);
  }
}
