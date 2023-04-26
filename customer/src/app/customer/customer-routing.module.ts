import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { MyDataComponent } from './myData/myData.component';

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
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})

export class CustomerRoutingModule { }
