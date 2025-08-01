import { DatePipe, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import localeEN from '@angular/common/locales/en';
import localeES from '@angular/common/locales/es';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TimeChartModule } from './time-chart/time-chart.module';
import { GraphQLModule } from './graphql.module';
import { SpinnerModule } from './spinner/spinner.module';
import { CustomDateAdapter } from './plugins/custom-date-adapter';
import { MonthYearPickerFormatDirective } from './plugins/month-year-picker-format-directive';

import { PlanningComponent } from './pages/planning/planning.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { LauDashboardComponent } from './pages/dashboard/lau/lau.component';
import { AdmonDashboardComponent } from './pages/dashboard/admon/admon.component';
import { OperationsDashboardComponent } from './pages/dashboard/operations/operations.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { GeneralDashboardComponent } from './pages/dashboard/general/general.component';
import { SharedModule } from './shared/shared.module';

registerLocaleData(localeES, 'es-ES');
registerLocaleData(localeEN, 'en-US');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    GeneralDashboardComponent,
    OperationsDashboardComponent,
    LauDashboardComponent,
    AdmonDashboardComponent,
    ReportsComponent,
    ConfirmationComponent,
    MonthYearPickerFormatDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    GraphQLModule,
    TimeChartModule,
    SharedModule,
    SpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})

export class AppModule { }
