// Core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './layout/layout.component';
import { MyDataComponent } from './myData/myData.component';
import { MyContactsComponent } from './myContacts/myContacts.component';
import { MyDocumentsComponent } from './myDocuments/myDocuments.component';
import { NewContactComponent } from './myContacts/newContacts/newContact.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { MyInvoicesComponent } from './myInvoices/myInvoices.component';
import { Constants } from '../constants/Constants';
import { MyBookingDetailComponent } from './myBookings/myBookingDetail/myBookingDetail.component';
import { InvoicePayComponent } from './myInvoices/invoicePay/invoicePay.component';
import { PaymentOkComponent } from './paymentOk/paymentOk.component';
import { PaymentkOComponent } from './paymentKO/paymentkO.component';
import { PdfsComponent } from './pdfs/pdfs.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:  [
      {
        path: '',
        redirectTo:  Constants.NAV_DATA.url,
        pathMatch: 'full'
      },
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
        path: 'invoices/payment/:id',
        component: InvoicePayComponent,
      },
      {
        path: 'pago_ok',
        component: PaymentOkComponent
      },
      {
        path: 'pago_ko',
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
