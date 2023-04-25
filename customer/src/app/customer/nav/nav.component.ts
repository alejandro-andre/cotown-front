import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  @Output() onSelectOption: EventEmitter<string> = new EventEmitter();

  constructor() { }


  onSelect(data: string) {
    console.log('IM on select');
    this.onSelectOption.next(data);
  }
}
