import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TimeChartControlComponent } from './time-chart-control/time-chart-control.component';
import { SafeHtmlPipe } from '../plugins/safe-html.pipe';

@NgModule({
  declarations: [
    TimeChartControlComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  exports: [TimeChartControlComponent]
})
export class TimeChartModule { }
