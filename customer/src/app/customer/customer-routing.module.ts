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



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:  [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: Constants.DATA.url,
        component: MyDataComponent
      },
      {
        path: Constants.CONTACTS.url,
        component: MyContactsComponent
      },
      {
        path: 'cantacts/new',
        component: NewContactComponent
      },
      {
        path: Constants.DOCUMENTS.url,
        component: MyDocumentsComponent
      },
      {
        path: Constants.BOOKINGS.url,
        component: MyBookingsComponent
      },
      {
        path: Constants.INVOICES.url,
        component: MyInvoiceComponent
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})

export class CustomerRoutingModule { }
