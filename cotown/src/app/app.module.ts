import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SecondComponent } from './pages/second/second.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { TimeChartModule } from './time-chart/time-chart.module';
import { PlanningComponent } from './pages/planning/planning.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SecondComponent,
    PlanningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    GraphQLModule,
    HttpClientModule,
    TimeChartModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
