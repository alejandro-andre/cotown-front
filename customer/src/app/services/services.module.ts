import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

import { ApoloQueryApi } from './apolo-api.service';
import { ContactTypeService } from './contactType.service';
import { CountryService } from './country.service';
import { LanguageService } from './languages.service';
import { CustomerService } from './customer.service';
import { IdentificationDocTypesService } from './identificationDocTypes.service';
import { schoolOrCompaniesService } from './schoolOrCompanies.service';
import { TutorService } from './tutor.service'

/**
 * Modulo que incorpora todos los servicios globales de la página.
 * Al dar de alta un nuevo servicio global, este tendrá que ser exportado al final de este fichero
 * ejemplo: export * from './loading/loading.service';
 */
@NgModule({
  imports: [CommonModule],
  declarations: [],
  entryComponents: [],
  providers: [
    ApoloQueryApi,
    ContactTypeService,
    CountryService,
    LanguageService,
    CustomerService,
    IdentificationDocTypesService,
    schoolOrCompaniesService,
    TutorService,
    TranslateService,
    HttpClientModule,
  ],
  exports: [],
})
export class ServicesModule {}

export * from './apolo-api.service';
export * from './contactType.service';
export * from './country.service';
export * from './customer.service';
export * from './gender.service';
export * from './identificationDocTypes.service';
export * from './languages.service';
export * from './tutor.service';
