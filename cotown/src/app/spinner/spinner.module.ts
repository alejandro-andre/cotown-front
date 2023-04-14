import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerControlComponent } from './spinner-control/spinner-control.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SpinnerControlComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [SpinnerControlComponent]
})
export class SpinnerModule { }
