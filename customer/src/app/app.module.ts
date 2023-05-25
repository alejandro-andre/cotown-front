// Core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules
import { CustomerModule } from './customer/customer.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from './graphql.module';

// Components
import { AppComponent } from './app.component';
import { ViewErrorComponent } from './customer/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    GraphQLModule,
    BrowserAnimationsModule,
    CustomerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ViewErrorComponent]
})

export class AppModule { }
