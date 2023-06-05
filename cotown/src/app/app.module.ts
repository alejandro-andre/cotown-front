import { registerLocaleData } from '@angular/common';
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

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TimeChartModule } from './time-chart/time-chart.module';
import { GraphQLModule } from './graphql.module';
import { SpinnerModule } from './spinner/spinner.module';
import { CustomDateAdapter } from './plugins/custom-date-adapter';
import { MonthYearPickerFormatDirective } from './plugins/month-year-picker-format-directive';
import { PlanningComponent } from './pages/planning/planning.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';

import localeEN from '@angular/common/locales/en';
import localeES from '@angular/common/locales/es';
import { DownloadComponent } from './pages/download/download.component';

registerLocaleData(localeES, 'es-ES');
registerLocaleData(localeEN, 'en-US');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    DashboardComponent,
    DownloadComponent,
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
    GraphQLModule,
    TimeChartModule,
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
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})

export class AppModule { }
