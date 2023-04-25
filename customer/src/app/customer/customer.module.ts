import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})

export class CustomerModule { }
