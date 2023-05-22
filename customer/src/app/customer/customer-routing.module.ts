// Core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { MyInvoiceComponent } from './myInvoice/myInvoice.component';
import { Constants } from '../constants/Constants';
import { MyBookingDetailComponent } from './myBookings/myBookingDetail/myBookingDetail.component';
import { MyTutorComponent } from './myTutor/myTutor.component';
import { InvoicePayComponent } from './myInvoice/invoicePay/invoicePay.component';
import { PaymentOkComponent } from './paymentOk/paymentOk.component';
import { AuthGuard } from '../auth/auth.guard';
import { PaymentkOComponent } from './paymentKO/paymentkO.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:  [
      {
        path: '',
        redirectTo:  Constants.DATA.url,
        pathMatch: 'full'
      },
      {
        path: Constants.DATA.url,
        component: MyDataComponent,
        canActivate: [AuthGuard],
      },
      {
        path: Constants.TUTOR.url,
        component: MyTutorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: Constants.CONTACTS.url,
        component: MyContactsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'cantacts/new',
        component: NewContactComponent,
        canActivate: [AuthGuard],
      },
      {
        path: Constants.DOCUMENTS.url,
        component: MyDocumentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: Constants.BOOKINGS.url,
        component: MyBookingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'booking-detail/:id',
        component: MyBookingDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: Constants.INVOICES.url,
        component: MyInvoiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'myInvoices/payment/:id',
        component: InvoicePayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customer/pago_ok',
        component: PaymentOkComponent
      },
      {
        path: 'customer/pago_ko',
        component: PaymentkOComponent
      },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})

export class CustomerRoutingModule { }
