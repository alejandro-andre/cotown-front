import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    RouterModule
  ],
  exports: [
    LayoutComponent
  ]
})

export class CustomerModule { }
