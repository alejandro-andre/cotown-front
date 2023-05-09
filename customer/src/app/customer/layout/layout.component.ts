// Core
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

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

// Models
import { Customer } from 'src/app/models/Customer.model';
import { Document } from 'src/app/constants/Interface';

// Queries
import { identificationDocTypesQuery } from 'src/app/schemas/query-definitions/IdentificationDocTypes.query';
import { countryQuery } from 'src/app/schemas/query-definitions/countries.query';
import { customerQuery } from 'src/app/schemas/query-definitions/customer.query';
import { genderQuery } from 'src/app/schemas/query-definitions/gender.query';
import { languageQuery } from 'src/app/schemas/query-definitions/languages.query';
import { schoolOrCompaniesQuery } from 'src/app/schemas/query-definitions/schoolOrCompanies.query';
import { contactTypeQuery } from 'src/app/schemas/query-definitions/contactType.query';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
  private _mobileQueryListener: () => void;
  constructor(
    private elRef:ElementRef,
    private authService: AuthService,
    private router: Router,
    private apolloApi: ApoloQueryApi,
    private customerService: CustomerService,
    private genderService: GenderService,
    private countryService: CountryService,
    private languageSerice: LanguageService,
    private identificationTypes: IdentificationDocTypesService,
    private schoolOrCompaniesService: schoolOrCompaniesService,
    private contactTypeService: ContactTypeService,
    private translate: TranslateService,
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

  // TODO this function is temporal set spanish as default language
  setAppLanguage() {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use('es');
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

  onSelectOption(data: string): void {
    this.router.navigate([`customer/${data}`]);
  }

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
          index: i
        })
      }

      const docObject = {
        expirity_date: doc.expirity_date,
        id: doc.id,
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

  loadCustomer() {
    const variables = {
      id: 916
    }

    this.apolloApi.getData(customerQuery, variables).subscribe((res) => {
      const value = res.data;
      if (value && value.data && value.data.length) {
        const {
          name , province, city, country, address, postal_code, document, email, phones,
          gender_id, language, origin,tutor, birth_date, nationality, type_doc, school_id,
          bank, contacts, documents, bookings, invoices, payments
        } = value.data[0];

        const birthDate = birth_date !== null ? new Date(birth_date) : null;
        const contactsToSend = contacts !== null ? contacts : [];
        const docToSend = this.loadDocuments(documents);

        const bookingsToSend = bookings !== null ? bookings : [];
        const invoidesToSend = invoices !== null ? invoices : [];
        const paymentsToSend = payments !== null ? payments : [];

        const customer = new Customer(
          name, province, city, country, address, postal_code, document, email, phones, gender_id,
          language, origin, nationality, tutor?.name || '', birthDate, type_doc, school_id, bank,
          contactsToSend, docToSend, bookingsToSend, invoidesToSend, paymentsToSend
        );

        this.customerService.setCustomerData(customer);
      }
    });
  }

  ngOnInit(): void {
    this.setAppLanguage();
    this.authService.getAirflowsToken().then(() => {
      this.loadIdentificationDocTypes();
      this.loadLanguages();
      this.loadGenders();
      this.loadCountries();
      this.loadSchoolOrCompanies();
      this.loadContactTypes();
      this.loadCustomer();
    })
  }
}
