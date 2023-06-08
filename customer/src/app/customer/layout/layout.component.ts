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
import { Customer } from 'src/app/models/Customer.model';
import { CustomerInterface, DocFile, Document } from 'src/app/constants/Interface';
import { Constants } from 'src/app/constants/Constants';

// Queries
import { USER_ID, CUSTOMER_QUERY } from 'src/app/schemas/query-definitions/customer.query';
import { getAge } from 'src/app/utils/date.util';

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
    this.isLoading = true;
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
    return new Promise((resolve) => {
      this.apolloApi.getData(USER_ID).subscribe((resp) => {
        if (resp.data && resp.data.data && resp.data.data.length > 0) {
          this.userId = resp.data.data[0].id;
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
    this.apolloApi.getData(CUSTOMER_QUERY, variables).subscribe(

      (res) => {
        const value = res.data;
        if (value && value.data && value.data.length) {

          const {
            id, name , province, city, country, address, postal_code, document, email, phones,
            gender_id, language, origin, tutorId, birth_date, nationality, type_doc, school_id,
            bank, contacts, documents, bookings, invoices, payments, appLang, photo
          } = value.data[0];

          const birthDate = birth_date;
          const contactsToSend = contacts !== null ? contacts : [];
          const docToSend = this.loadDocuments(documents);
          const bookingsToSend = bookings !== null ? JSON.parse(JSON.stringify(bookings)) : [];
          const invoidesToSend = invoices !== null ? invoices : [];
          const paymentsToSend = payments !== null ? payments : [];

          const customer: CustomerInterface = {
            id, name, province, city, country, address, document, email, nationality, birthDate, appLang, photo,
            postalCode: postal_code,
            phone: phones,
            genderId: gender_id,
            languageId: language,
            originId:origin,
            tutorId: tutorId,
            typeDoc: type_doc,
            schoolOrCompany: school_id,
            bankAcount: bank,
            contacts: contactsToSend,
            documents: docToSend,
            bookings: bookingsToSend,
            invoices: invoidesToSend,
            payments: paymentsToSend,
          }

          const currentCustomer = new Customer(customer);
          const age = getAge(birthDate);
          this.setAppLanguage(appLang);
          this.customerService.setCustomerData(currentCustomer);
          if(age <= 18 && tutorId !== null) {
            // TO DO
          }
          this.isLoading = false;
        }
      }
    );
  }

  loadDocuments (documents: Document[]): Document[] {
    if (documents === null) {
      return [] as Document[];
    }

    const returnData: Document[] = [] ;
    documents.forEach((doc: Document) => {
      const numOfImages = doc.doctype.images;
      const images: DocFile[]= [];

      for (let i = 0; i < numOfImages; i++) {
        const docFile: DocFile = {
          file:  undefined,
          id: doc.id,
          index: i,
          name: '',
          oid: -1,
          type: ''
        }
        images.push(docFile)
      }

      if (doc.front && doc.front !== null && doc.front.oid !== null) {
        images[0].name = doc.front.name;
        images[0].oid = doc.front.oid
        images[0].type = Constants.DOCUMENT_TYPE_FRONT;
      }

      if (doc.back && doc.back !== null && doc.back.oid !== null) {
        images[1].name = doc.back.name;
        images[1].oid = doc.back.oid;
        images[1].type = Constants.DOCUMENT_TYPE_BACK;
      }

      const docObject = {
        expirity_date: doc.expirity_date,
        id: doc.id,
        formDateControl: new FormControl(doc.expirity_date),
        created_at: doc.created_at,
        doctype: {
          name: doc.doctype.name,
          images: doc.doctype.images,
          id: doc.doctype.id,
          arrayOfImages: images
        }
      };

      returnData.push(docObject);
    });

    return returnData;
  }

}
