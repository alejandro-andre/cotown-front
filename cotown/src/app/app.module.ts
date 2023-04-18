import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PlanningComponent } from './pages/planning/planning.component';
import { TimeChartModule } from './time-chart/time-chart.module';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerModule } from './spinner/spinner.module';
import { CustomDateAdapter } from './plugins/CustomDateAdapter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en-GB';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es-ES');
registerLocaleData(localeEN, 'en-GB');


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    GraphQLModule,
    HttpClientModule,
    TimeChartModule,
    SpinnerModule,
    ReactiveFormsModule,
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
