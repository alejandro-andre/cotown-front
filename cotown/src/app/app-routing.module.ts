import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotownModal } from './pages/cotown-modal/cotown-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { SecondComponent } from './pages/second/second.component';

const routes: Routes = [
  { path: '', component: PlanningComponent },
  { path: 'home', component: HomeComponent },
  { path: 'second', component: SecondComponent },
  { path: 'cotown-modal', component: CotownModal}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
