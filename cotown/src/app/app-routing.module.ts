import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './pages/planning/planning.component';
import { DownloadComponent } from './pages/download/download.component';
import { GeneralDashboardComponent } from './pages/dashboard/general/general.component';
import { OperationsDashboardComponent } from './pages/dashboard/operations/operations.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard' ,  pathMatch: 'full' },
  { path: 'planning', component: PlanningComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'dashboard', component: GeneralDashboardComponent },
  { path: 'dashboard/nextin', component: OperationsDashboardComponent, data: { op: 'nextin'} },
  { path: 'dashboard/checkin', component: OperationsDashboardComponent, data: { op: 'checkin'} },
  { path: 'dashboard/issues', component: OperationsDashboardComponent, data: { op: 'issues'} },
  { path: 'dashboard/nextout', component: OperationsDashboardComponent, data: { op: 'nextout'} },
  { path: 'dashboard/checkout', component: OperationsDashboardComponent, data: { op: 'checkout'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
