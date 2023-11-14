// Core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './layout/layout.component';
import { BaseComponent } from './base/base.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { MyInvoicesComponent } from './myInvoices/myInvoices.component';
import { Constants } from '../constants/Constants';
import { MyBookingDetailComponent } from './myBookings/myBookingDetail/myBookingDetail.component';
import { InvoicePayComponent } from './myPayments/invoicePay/invoicePay.component';
import { PaymentOKComponent } from './paymentOK/paymentOK.component';
import { PaymentKOComponent } from './paymentKO/paymentKO.component';
import { PdfsComponent } from './pdfs/pdfs.component';
import { MyPaymentsComponent } from './myPayments/myPayments.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children:  [
      {
        path: 'home',
        component: HomeComponent,
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children:  [
      {
        path: Constants.NAV_DATA.url,
        component: MyDataComponent,
      },
      {
        path: Constants.NAV_CONTACTS.url,
        component: MyContactsComponent,
      },
      {
        path: Constants.NAV_DOCUMENTS.url,
        component: MyDocumentsComponent,
      },
      {
        path: Constants.NAV_BOOKINGS.url,
        component: MyBookingsComponent,
      },
      {
        path: Constants.NAV_INVOICES.url,
        component: MyInvoicesComponent,
      },
      {
        path: Constants.NAV_PAYMENTS.url,
        component: MyPaymentsComponent,
      },
      {
        path: Constants.NAV_PDFS.url,
        component: PdfsComponent,
      },
      {
        path: 'cantacts/new',
        component: NewContactComponent,
      },
      {
        path: 'booking-detail/:id',
        component: MyBookingDetailComponent,
      },
      {
        path: 'payments/payment/:id',
        component: InvoicePayComponent,
      },
      {
        path: 'pago_ok',
        component: PaymentOKComponent
      },
      {
        path: 'pago_ko',
        component: PaymentKOComponent
      },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})

export class CustomerRoutingModule { }
