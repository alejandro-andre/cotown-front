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

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children:  [
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "data",
        component: MyDataComponent
      },
      {
        path: "cantacts",
        component: MyContactsComponent
      },
      {
        path: "cantacts/new",
        component: NewContactComponent
      },
      {
        path: "documents",
        component: MyDocumentsComponent
      },
      {
        path: "bookings",
        component: MyBookingsComponent
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})

export class CustomerRoutingModule { }
