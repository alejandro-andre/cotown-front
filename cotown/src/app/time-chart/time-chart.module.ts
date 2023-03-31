import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

import { TimeChartControlComponent } from './time-chart-control/time-chart-control.component';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@NgModule({
  declarations: [
    TimeChartControlComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    MatRadioModule
  ],
  exports: [TimeChartControlComponent]
})
export class TimeChartModule { }
