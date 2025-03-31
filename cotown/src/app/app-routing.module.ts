import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './pages/planning/planning.component';
import { GeneralDashboardComponent } from './pages/dashboard/general/general.component';
import { OperationsDashboardComponent } from './pages/dashboard/operations/operations.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { LauDashboardComponent } from './pages/dashboard/lau/lau.component';
import { AdmonDashboardComponent } from './pages/dashboard/admon/admon.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard' ,  pathMatch: 'full' },
  { path: 'planning', component: PlanningComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'dashboard', component: GeneralDashboardComponent },
  { path: 'operations', component: OperationsDashboardComponent },
  { path: 'lau', component: LauDashboardComponent },
  { path: 'admon', component: AdmonDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
