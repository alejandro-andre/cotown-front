// Core
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Sevices
import { AuthService } from 'src/app/auth/auth.service';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';

import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { LanguageService } from 'src/app/services/languages.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { ContactTypeService } from 'src/app/services/contact-type.service';
import { TutorService } from 'src/app/services/tutor.service';

// Models
import { Customer } from 'src/app/models/Customer.model';
import { CustomerInterface, DocFile, Document } from 'src/app/constants/Interface';
import { Constants } from 'src/app/constants/Constants';
import { Tutor } from 'src/app/models/Tutor.model';

// Queries
import { ID_TYPE_QUERY } from 'src/app/schemas/query-definitions/id-type.query';
import { COUNTRY_QUERY } from 'src/app/schemas/query-definitions/countries.query';
import { USER_ID, CUSTOMER_QUERY } from 'src/app/schemas/query-definitions/customer.query';
import { GENDER_QUERY } from 'src/app/schemas/query-definitions/gender.query';
import { LANGUAGE_QUERY } from 'src/app/schemas/query-definitions/languages.query';
import { SCHOOL_QUERY } from 'src/app/schemas/query-definitions/school.query';
import { CONTACT_TYPE_QUERY } from 'src/app/schemas/query-definitions/contact-type.query';
import { TUTOR_QUERY } from 'src/app/schemas/query-definitions/tutor.query';
import { LookupService } from 'src/app/services/lookup.service';

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
    private tutorService: TutorService,
    private lookupService: LookupService
  ) {
    breakpointObserver.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      Breakpoints.Medium
    ]).subscribe(result => {
      this.isMobile = !result.matches;
      console.log(result);
      console.log(this.isMobile);
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadData();
  }

  setAppLanguage(lang: string = Constants.defaultBaseLanguageForTranslation) {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(lang);
  }

  loadData() {
    this.authService.getAirflowsToken().then(async() => {
      await this.loadUserId();
      if (this.userId !== undefined && this.userId !== null) {
        this.lookupService.loadIdTypes();
        this.lookupService.loadLanguages();
        this.lookupService.loadGenders();
        this.lookupService.loadCountries();
        this.lookupService.loadSchools();
        this.lookupService.loadContactTypes();
        this.loadCustomer();
      }
    })
  }

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

  loadTutor (tutorId: number): void {
    const variables = {
      id: tutorId
    };

    this.apolloApi.getData(TUTOR_QUERY, variables).subscribe((res) => {
      const value = res.data;
      if (value && value.data && value.data.length) {
        const {
          id, name, province, city, country, address, postal_code, document,
          email, phones, language, origin, birth_date, nationality, type_doc,
        } = value.data[0];

        const birthDate = birth_date !== null ? new Date(birth_date) : null;
        const tutor: CustomerInterface = {
          id, name, province, city, email, country, nationality, birthDate, address, document,
          phone: phones,
          postalCode: postal_code,
          languageId: language,
          originId: origin,
          typeDoc: type_doc,
        };

        const customerTutor = new Tutor(tutor);
        this.tutorService.setTutorData(customerTutor);
      }
    })
  }

  loadCustomer(): void {
    const variables = {
      id: this.userId
    }
    this.apolloApi.getData(CUSTOMER_QUERY, variables).subscribe((res) => {
      const value = res.data;
      if (value && value.data && value.data.length) {
        const {
          id, name , province, city, country, address, postal_code, document, email, phones,
          gender_id, language, origin, tutorId, birth_date, nationality, type_doc, school_id,
          bank, contacts, documents, bookings, invoices, payments, appLang, photo
        } = value.data[0];

        const birthDate = birth_date !== null ? new Date(birth_date) : null;
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
        const age = this.getAge(birthDate);
        this.setAppLanguage(appLang);
        this.customerService.setCustomerData(currentCustomer);
        if(age <= 18 && tutorId !== null) {
          // TO DO
        }
        this.isLoading = false;
      }
    });
  }

  // TODO: may be is not the better way to do it
  getAge(birthDate: Date | null): number {
    const now = new Date().getTime();
    const birthWithTime = birthDate?.getTime() || 0;
    const diff = now - birthWithTime;
    const diffParsed = (diff / 31536000000).toFixed(0);
    return parseInt(diffParsed);
  }

}
