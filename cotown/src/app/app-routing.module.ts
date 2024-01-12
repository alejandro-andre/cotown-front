import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './pages/planning/planning.component';
import { DownloadComponent } from './pages/download/download.component';
import { GeneralDashboardComponent } from './pages/dashboard/general/general.component';
import { NextinDashboardComponent } from './pages/dashboard/nextin/nextin.component';
import { NextoutDashboardComponent } from './pages/dashboard/nextout/nextout.component';
import { CheckinDashboardComponent } from './pages/dashboard/checkin/checkin.component';
import { IssuesDashboardComponent } from './pages/dashboard/issues/issues.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard' ,  pathMatch: 'full' },
  { path: 'planning', component: PlanningComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'dashboard', component: GeneralDashboardComponent },
  { path: 'dashboard/nextin', component: NextinDashboardComponent },
  { path: 'dashboard/nextout', component: NextoutDashboardComponent },
  { path: 'dashboard/checkin', component: CheckinDashboardComponent },
  { path: 'dashboard/issues', component: IssuesDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
