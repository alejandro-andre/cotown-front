// Core
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import localeEN from '@angular/common/locales/en';
import localeES from '@angular/common/locales/es';

// Material
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Components
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { MyBookingDetailComponent } from './myBookings/myBookingDetail/myBookingDetail.component';
import { MyInvoiceComponent } from './myInvoice/myInvoice.component';
import { MyTutorComponent } from './myTutor/myTutor.component';

// Routing
import { CustomerRoutingModule } from './customer-routing.module';

// Config of translation
registerLocaleData(localeES, 'es-ES');
registerLocaleData(localeEN, 'en-US');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    LayoutComponent,
    MyDataComponent,
    MyContactsComponent,
    NewContactComponent,
    MyDocumentsComponent,
    MyBookingsComponent,
    MyBookingDetailComponent,
    MyInvoiceComponent,
    MyTutorComponent,
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
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
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
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CustomerModule { }
