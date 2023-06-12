// Core
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Sevices
import { AuthService } from 'src/app/auth/auth.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LookupService } from 'src/app/services/lookup.service';

// Models
import { ICustomer, IDocFile, IDocument } from 'src/app/constants/Interface';
import { Constants } from 'src/app/constants/Constants';

// Queries
import { CUSTOMER_ID_QUERY, CUSTOMER_QUERY } from 'src/app/schemas/query-definitions/customer.query';
import { Customer } from 'src/app/models/Customer.model';

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
      await this.loadUserId();
      if (this.userId !== undefined && this.userId !== null) {
        this.lookupService.load();
        this.loadCustomer();
      }
    })
  }

  // Set app lang
  setAppLanguage(lang: string = Constants.defaultBaseLanguageForTranslation) {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(lang);
  }

  // Get ID of logged user
  loadUserId(): Promise<void> {
    this.isLoading = true;
    return new Promise((resolve) => {
      this.apolloApi.getData(CUSTOMER_ID_QUERY).subscribe((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          this.userId = res.data.data[0].id;
          this.isLoading = false;
        }
        resolve();
      })
    });
  }

  loadCustomer(): void {

    // GraphQL call variables
    const variables = {
      id: this.userId
    }

    // Get data
    this.isLoading = true;
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
        this.isLoading = false;
      } 
      
    });
  }

  loadDocuments (documents: IDocument[]): IDocument[] {
    if (documents === null) {
      return [] as IDocument[];
    }

    const returnData: IDocument[] = [] ;
    documents.forEach((doc: IDocument) => {
      const numOfImages = doc.doc_type?.images || 1;
      const images: IDocFile[]= [];

      for (let i = 0; i < numOfImages; i++) {
        const IDocFile: IDocFile = {
          id: doc.id,
          oid: -1,
          name: '',
          type: '',
          size: 0,
          content: '',
          thumbnail: ''
        }
        images.push(IDocFile)
      }

      if (doc.front && doc.front !== null && doc.front.oid !== null) {
        images[0].name = doc.front.name;
        images[0].oid = doc.front.oid
      }

      if (doc.back && doc.back !== null && doc.back.oid !== null) {
        images[1].name = doc.back.name;
        images[1].oid = doc.back.oid;
      }

      const docObject = {
        expiry_date: doc.expiry_date,
        id: doc.id,
        formDateControl: new FormControl(doc.expiry_date),
        doc_type: {
          id: doc.doc_type?.id || 0,
          name: doc.doc_type?.name,
          images: doc.doc_type?.images || 1,
          arrayOfImages: images
        }
      };

      //returnData.push(docObject);
    });

    return returnData;
  }

}
