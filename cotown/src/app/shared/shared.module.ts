import { NgModule } from '@angular/core';
import { SafePipe } from '../services/safe.pipe';

@NgModule({
  declarations: [
    SafePipe
  ],
  exports: [
    SafePipe
  ],
})

export class SharedModule { }
