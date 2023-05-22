// Core
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// Sevices
import { AuthService } from 'src/app/auth/service/auth.service';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { CountryService } from 'src/app/services/country.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';
import { IdentificationDocTypesService } from 'src/app/services/identificationDocTypes.service';
import { LanguageService } from 'src/app/services/languages.service';
import { schoolOrCompaniesService } from 'src/app/services/schoolOrCompanies.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { TutorService } from 'src/app/services/tutor.service';

// Models
import { Customer } from 'src/app/models/Customer.model';
import { CustomerInterface, Document } from 'src/app/constants/Interface';
import { Constants } from 'src/app/constants/Constants';
import { Tutor } from 'src/app/models/Tutor.model';

// Queries
import { identificationDocTypesQuery } from 'src/app/schemas/query-definitions/IdentificationDocTypes.query';
import { countryQuery } from 'src/app/schemas/query-definitions/countries.query';
import { USER_ID, customerQuery } from 'src/app/schemas/query-definitions/customer.query';
import { genderQuery } from 'src/app/schemas/query-definitions/gender.query';
import { languageQuery } from 'src/app/schemas/query-definitions/languages.query';
import { schoolOrCompaniesQuery } from 'src/app/schemas/query-definitions/schoolOrCompanies.query';
import { contactTypeQuery } from 'src/app/schemas/query-definitions/contactType.query';
import { TUTOR_QUERY } from 'src/app/schemas/query-definitions/tutor.query';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
  public showTutor: Subject<boolean> = new Subject<any>();
  private _mobileQueryListener: () => void;
  public isLoading = false;
  public userId: number | undefined;

  constructor(
    private elRef:ElementRef,
    private authService: AuthService,
    private apolloApi: ApoloQueryApi,
    private customerService: CustomerService,
    private genderService: GenderService,
    private countryService: CountryService,
    private languageSerice: LanguageService,
    private identificationTypes: IdentificationDocTypesService,
    private schoolOrCompaniesService: schoolOrCompaniesService,
    private contactTypeService: ContactTypeService,
    private translate: TranslateService,
    private tutorService: TutorService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  /**
   * Started config of nav
   */
  public mobileQuery!: MediaQueryList;
  public navWidth: number = 160;

  get getStyles(): any {
    if(this.mobileQuery.matches) {
      return {
        width: `${this.navWidth}px`
      };
    }
  }

  setAppLanguage(lang: string = Constants.defaultBaseLanguageForTranslation) {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(lang);
  }

  ngAfterViewInit() {
    const snav = this.elRef.nativeElement.querySelector('#snav');
    this.navWidth = snav.offsetWidth;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /**
   * Endded the configuration of nav
  */
  loadIdentificationDocTypes() {
    this.apolloApi.getData(identificationDocTypesQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.types) {
        this.identificationTypes.setTypesData(value.types);
      }
    });
  }

  loadLanguages() {
    this.apolloApi.getData(languageQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.languages) {
        this.languageSerice.setLanguageData(value.languages);
      }
    });
  }

  loadGenders() {
    this.apolloApi.getData(genderQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.genders) {
        this.genderService.setGenderData(value.genders);
      }
    });
  }

  loadCountries() {
    this.apolloApi.getData(countryQuery).subscribe((res) => {
      const value = res.data;

      if (value && value.countries && value.countries.length) {
        this.countryService.setCountryData(value.countries);
      }
    });
  }

  loadSchoolOrCompanies() {
    this.apolloApi.getData(schoolOrCompaniesQuery).subscribe((res) => {
      const value = res.data;
      if(value && value.data && value.data.length) {
        this.schoolOrCompaniesService.setSchoolOrCompaniesData(value.data);
      }
    });
  }

  loadContactTypes() {
    this.apolloApi.getData(contactTypeQuery).subscribe((res) => {
      const value = res.data;
      if(value && value.contacts && value.contacts.length) {
        this.contactTypeService.setContactTypesData(value.contacts);
      }
    });
  }

  loadDocuments (documents: Document[]): Document[] {
    if (documents === null) {
      return [] as Document[];
    }

    const returnData: Document[] = [] ;

    documents.forEach((doc: Document) => {
      const numOfImages = doc.doctype.images;
      const images = [];

      for(let i = 0; i < numOfImages; i++) {
        images.push({
          file: '',
          id: doc.id,
          index: i,
          name: '',
          oid: -1,
          type: ''
        })
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

  loadData() {
    this.authService.getAirflowsToken().then( async() => {
      await this.loadUserId();
      if (this.userId !== undefined && this.userId !== null) {
        this.loadIdentificationDocTypes();
        this.loadLanguages();
        this.loadGenders();
        this.loadCountries();
        this.loadSchoolOrCompanies();
        this.loadContactTypes();
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

  loadCustomer(): void {
    const variables = {
      id: this.userId
    }

    this.apolloApi.getData(customerQuery, variables).subscribe((res) => {
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
        // TODO: may be is not the better way to do it
        const now = new Date().getTime();
        const birthWithTime = birthDate?.getTime() || 0;
        const diff = now - birthWithTime;
        const diffParsed = (diff / 31536000000).toFixed(0);

        this.setAppLanguage(appLang);
        this.customerService.setCustomerData(currentCustomer);
        this.isLoading = false;

        if(parseInt(diffParsed) <= 18 && tutorId !== null) {
          this.showTutor.next(true);
          this.loadTutor(tutorId);
        }
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadData();
  }
}
