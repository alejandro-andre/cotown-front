import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DocFile, Document, PayloadFile } from 'src/app/constants/Interface';
import { UPDATE_EXPERITY_DATE, UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_DOCUMENT_BACK } from 'src/app/schemas/query-definitions/customer.query';
import { ApoloQueryApi } from 'src/app/services/Apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

@Component({
  selector: 'app-documents',
  templateUrl: './myDocuments.component.html',
  styleUrls: ['./myDocuments.component.scss']
})

export class MyDocumentsComponent  {
  constructor(
    public customerService: CustomerService,
    private router: Router,
    private axiosApi: AxiosApi,
    private Apollo: ApoloQueryApi,
    private modalService: ModalService
  ) {}
  public disabledButtons: number[] = [] as number[];
  public pdfSrc = '';
  public isLoading = false;

  viewDoc(doc: DocFile) {
    this.axiosApi.getFile(doc.id, doc.type).then((response: any) => {
      this.pdfSrc = URL.createObjectURL(response.data);
    })
  }

  upload(event: any, doc: any, index: number) {
    const payload: PayloadFile  = {
      id: doc.id,
      file: doc.file,
      document: index === 0 ? 'front': 'back',
    };

    this.axiosApi.uploadFile(payload).then((resp) => {
      const fileId = resp.data;
      const name = event.target.files[0].name;
      const variables = {
        id: doc.id,
        bill: {
          name,
          oid: fileId,
          type: 'application/pdf'
        }
      };

      const query = index === 0 ? UPLOAD_CUSTOMER_DOCUMENT : UPLOAD_CUSTOMER_DOCUMENT_BACK;
      this.Apollo.setData(query, variables).subscribe((response) => {
        const value = response.data;
        if (value && value.data && value.data.length && value.data[0].id) {
          console.log('Subida realizada con exito: ', value.data[0]);
        } else {
          // Something wrong but not know what
          this.isLoading = false;
          const body = {
            title: 'Error',
            message: 'uknownError'
          };
          this.modalService.openModal(body);
        }
      },
      err => {
        // Apollo error !!
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang)
        this.isLoading = false;
        this.modalService.openModal(bodyToSend);
      });
    })
  }

  isButtonOfDocDisabled(document: Document) {
    const finded = this.disabledButtons.find((el) => el === document.id);
    return finded === undefined;
  }

  save(document: Document) {
    this.isLoading = true;
    document.expirity_date = this.formatDate(document.formDateControl.value);
    const newArray = this.disabledButtons.filter((elem) => elem !== document.id);
    this.disabledButtons = [ ...newArray];
    const variables = {
      id: document.id,
      value: document.expirity_date
    }

    this.Apollo.setData(UPDATE_EXPERITY_DATE, variables).subscribe(async(response) => {
      this.isLoading = false;
      console.log('The response is: ', response);
    }, err => {
      this.isLoading = false;
      const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang);
      this.modalService.openModal(bodyToSend);
    })
  }


  formatDate(date: Date) {
    if (date !== null) {
      const year = date.getFullYear();
      const day = date.getDate();
      const month = date.getMonth() + 1;

      return `${year}-${month}-${day}`;
    }

    return null;
  }

  inputDate(document: Document) {
    this.disabledButtons.push(document.id);
  }

  get documents(): Document[] {
    return this.customerService.customer.documents;
  }
}
