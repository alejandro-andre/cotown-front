// Core
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import localeEN from '@angular/common/locales/en';
import localeES from '@angular/common/locales/es';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

// Components
import { LayoutComponent } from './layout/layout.component';
import { BaseComponent } from './base/base.component';
import { NavComponent } from './nav/nav.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { MyBookingDetailComponent } from './myBookings/myBookingDetail/myBookingDetail.component';
import { MyQuestionnairesComponent } from './myQuestionnaires/myQuestionnaires.component';
import { MyInvoicesComponent } from './myInvoices/myInvoices.component';
import { MyPaymentsComponent } from './myPayments/myPayments.component';
import { InvoicePayComponent } from './myPayments/invoicePay/invoicePay.component';
import { PdfsComponent } from './pdfs/pdfs.component';
import { HomeComponent } from './home/home.component';
import { PaymentOKComponent } from './paymentOK/paymentOK.component';
import { PaymentKOComponent } from './paymentKO/paymentKO.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

// Routing
import { CustomerRoutingModule } from './customer-routing.module';

// Other
import { SpinnerControlComponent } from './spinner/spinner-control.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from '../utils/date-adapter';
import { SafePipe } from '../services/safe.pipe';

// Config of translation
registerLocaleData(localeES, 'es-ES');
registerLocaleData(localeEN, 'en-US');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    NavComponent,
    LayoutComponent,
    BaseComponent,
    HomeComponent,
    MyDataComponent,
    MyContactsComponent,
    NewContactComponent,
    MyDocumentsComponent,
    MyBookingsComponent,
    MyBookingDetailComponent,
    MyQuestionnairesComponent,
    MyInvoicesComponent,
    MyPaymentsComponent,
    InvoicePayComponent,
    PdfsComponent,
    PaymentOKComponent,
    PaymentKOComponent,
    SpinnerControlComponent,
    SafePipe,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    PdfViewerModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    MatSliderModule,
    MatRadioModule,
    MatCheckboxModule,
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
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    TranslateModule,
    SafePipe
  ],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CustomerModule { }
