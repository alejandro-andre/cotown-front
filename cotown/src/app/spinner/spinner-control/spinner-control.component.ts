import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-spinner-control',
  templateUrl: './spinner-control.component.html',
  styleUrls: ['./spinner-control.component.scss']
})

export class SpinnerControlComponent {

  public strokeWidth = 4;
  public color: ThemePalette = 'accent';
  public diameter: number = 40;

  constructor() {}
}
