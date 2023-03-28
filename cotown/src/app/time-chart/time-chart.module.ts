import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeChartControlComponent } from './time-chart-control/time-chart-control.component';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@NgModule({
  declarations: [
    TimeChartControlComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [TimeChartControlComponent]
})
export class TimeChartModule { }
