// Core
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPdf } from 'src/app/constants/Interface';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LookupService } from 'src/app/services/lookup.service';


@Component({
  selector: 'app-pdfs',
  templateUrl: './pdfs.component.html',
  styleUrls: ['./pdfs.component.scss']
})

export class PdfsComponent {

  // Spinner
  public isLoading = false;

  // Constructor
  constructor(
    public lookupService: LookupService,
    private customerService: CustomerService,
    private translate: TranslateService,
    private axiosApi: AxiosApi    
  ) { }

  getPdfName(pdf: IPdf): string {
    if (this.customerService.customer.appLang === 'es')
      return pdf.name || '';
    return pdf.name_en || '';
  }

  getPdfDescription(pdf: IPdf): string {
    if (this.customerService.customer.appLang === 'es')
      return pdf.description || '';
    return pdf.description_en || '';
  }

  download(pdf: any) {

    // Select by language
    let type = "Document";
    let name = pdf.name;
    if (this.customerService.customer.appLang !== 'es') {
      type = "Document_en";
      name = pdf.name_en;
    }

    // Get file
    this.axiosApi.getPdf(pdf.id, type).then((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(response.data);;
      link.download = name;
      link.click();
    })
    
  }

}