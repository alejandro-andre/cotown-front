import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'

import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MyDataComponent } from './myData/myData.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    LayoutComponent,
    MyDataComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [
    LayoutComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CustomerModule { }
