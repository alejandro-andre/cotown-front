// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'

// Components
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';

// Routing
import { CustomerRoutingModule } from './customer-routing.module';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    LayoutComponent,
    MyDataComponent,
    MyContactsComponent,
    NewContactComponent,
    MyDocumentsComponent,
    MyBookingsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  exports: [
    LayoutComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CustomerModule { }
