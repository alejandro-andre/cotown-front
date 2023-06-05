import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './pages/planning/planning.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DownloadComponent } from './pages/download/download.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard' ,  pathMatch: 'full' },
  { path: 'planning', component: PlanningComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'download', component: DownloadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
