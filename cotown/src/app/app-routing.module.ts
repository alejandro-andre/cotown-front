import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './pages/planning/planning.component';
import { GeneralDashboardComponent } from './pages/dashboard/general/general.component';
import { DownloadComponent } from './pages/download/download.component';
import { CheckinDashboardComponent } from './pages/dashboard/checkin/checkin.component';
import { CheckoutDashboardComponent } from './pages/dashboard/checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard' ,  pathMatch: 'full' },
  { path: 'planning', component: PlanningComponent },
  { path: 'dashboard', component: GeneralDashboardComponent },
  { path: 'checkindashboard', component: CheckinDashboardComponent },
  { path: 'checkoutdashboard', component: CheckoutDashboardComponent },
  { path: 'download', component: DownloadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
