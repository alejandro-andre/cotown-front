// Core
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Sevices
import { AuthService } from 'src/app/auth/auth.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LookupService } from 'src/app/services/lookup.service';

// Models
import { ICustomer } from 'src/app/constants/Interface';
import { Constants } from 'src/app/constants/Constants';

// Queries
import { CUSTOMER_ID_QUERY, CUSTOMER_QUERY } from 'src/app/schemas/query-definitions/customer.query';
import { Customer } from 'src/app/models/Customer.model';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

  public userId: number | undefined;
  public isLoading = false;
  public isMobile: boolean = false;

  constructor(
    private authService: AuthService,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private apolloApi: ApolloQueryApi,
    private breakpointObserver: BreakpointObserver,
    private customerService: CustomerService,
    private lookupService: LookupService
  ) {
    breakpointObserver.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      Breakpoints.Medium
    ]).subscribe(result => {
      this.isMobile = !result.matches;
    });
  }

  ngOnInit(): void {
    this.authService.getAirflowsToken().then(async() => {
      this.lookupService.load();
      await this.load();
    })
  }

  // Load customer
  async load() {
    await this.loadUserId();
    if (this.userId !== undefined && this.userId !== null) {
      await this.loadCustomer();
    }
  }

  // Set app lang
  setAppLanguage(lang: string = Constants.defaultBaseLanguageForTranslation) {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(lang);
    if (lang === 'es') {
      this.dateAdapter.setLocale(Constants.SPANISH.locale);
    } else {
      this.dateAdapter.setLocale(Constants.ENGLISH.locale);
    }

  }

  // Get ID of logged user
  loadUserId(): Promise<void> {

    // Spinner
    this.isLoading = true;

    // Get data
    return new Promise((resolve) => {
      this.apolloApi.getData(CUSTOMER_ID_QUERY).subscribe((res) => {
        this.isLoading = false;
        if (res.data && res.data.data) {
          if (res.data.data.length == 1) {
            this.userId = res.data.data[0].id;
          } else {
            this.authService.logout();
          }
        }
        resolve();
      })
    });
  }

  loadCustomer(): void {

    // Spinner
    this.isLoading = true;

    // Get data
    const variables = { id: this.userId }
    this.apolloApi.getData(CUSTOMER_QUERY, variables).subscribe({

      next: (res) => {
        this.isLoading = false;
        const value = res.data;
        if (value && value.data && value.data.length) {
          const cust: ICustomer = value.data[0];
          this.setAppLanguage(cust.appLang);
          this.customerService.setCustomerData(new Customer(cust));
        }
      },

      error: (err) => {
        console.log(err);
        this.isLoading = false;
      } 
      
    });
  }

}
