import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TimeChartControlComponent } from './time-chart-control/time-chart-control.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TimeChartControlComponent
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    SharedModule
  ],
  exports: [TimeChartControlComponent]
})
export class TimeChartModule { }
