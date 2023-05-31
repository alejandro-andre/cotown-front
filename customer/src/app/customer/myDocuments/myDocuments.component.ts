import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';

import { DocFile, Document, PayloadFile } from 'src/app/constants/Interface';
import { UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_FULL_DOCUMENTS } from 'src/app/schemas/query-definitions/customer.query';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

@Component({
  selector: 'app-documents',
  templateUrl: './myDocuments.component.html',
  styleUrls: ['./myDocuments.component.scss']
})

export class MyDocumentsComponent implements OnInit {
  constructor(
    public customerService: CustomerService,
    private router: Router,
    private axiosApi: AxiosApi,
    private Apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {}

  public enabledButtons: number[] = [] as number[];
  public pdfSrc = '';
  public isLoading = false;
  public photo = '';

  ngOnInit(): void {
    this.documents.forEach((el: Document) => {
      if(el.expirity_date === null) {
        this.enabledButtons.push(el.id);
      } else {
        const finded = el.doctype.arrayOfImages?.filter(ev => ev.oid === -1);
        if (finded && finded.length > 0) {
          this.enabledButtons.push(el.id);
        }
      }
    });
  }
  viewDoc(doc: DocFile) {
    this.axiosApi.getFile(doc.id, doc.type).then((response: any) => {
      if (response.data && response.data.type ===  Constants.IMAGE_JPG || response.data.type ===  Constants.IMAGE_PNG) {
        this.pdfSrc = '';
        this.photo = URL.createObjectURL(response.data);
      } else {
        this.photo = '';
        this.pdfSrc = URL.createObjectURL(response.data);
      }
    })
  }

  upload(event: any, index: number, document: Document) {
    const payload: PayloadFile  = {
      id: document.id,
      file: event.target.files[0],
      document: index === 0 ? 'Document': 'Document_back',
    };

    this.axiosApi.uploadFile(payload).then((resp) => {
      const fileId = resp.data;
      const name = event.target.files[0].name;
      const type = event.target.files[0].type;
      if (document.doctype.arrayOfImages) {
        document.doctype.arrayOfImages[index].oid = fileId;
        document.doctype.arrayOfImages[index].name = name
        document.doctype.arrayOfImages[index].typeFile = type;
        document.doctype.arrayOfImages[index].type = index === 0 ? Constants.DOCUMENT_TYPE_FRONT : Constants.DOCUMENT_TYPE_BACK;
      }
    })
  }

  isViewEnabled(document: Document) {
    const finded = this.enabledButtons.find((el) => el === document.id);
    return finded === undefined;
  }

  uploadDataOnApollo(document: Document) {
    const query = document.doctype.images === 1 ? UPLOAD_CUSTOMER_DOCUMENT : UPLOAD_CUSTOMER_FULL_DOCUMENTS;
    const files = document.doctype.arrayOfImages;
    if (files) {
      let variables: any = {
        id: document.id,
        date:document.expirity_date,
        billFront: {
          name: files[0].name,
          oid: files[0].oid,
          type: files[0].typeFile
        }
      }

      if (files.length === 2) {
        variables.billBack = {
          name: files[1].name,
          oid: files[1].oid,
          type: files[1].typeFile
        }
      }

      this.Apollo.setData(query, variables).subscribe((response) => {
        const value = response.data;
        if (value && value.data && value.data.length && value.data[0].id) {
          this.isLoading = false;
          const newArray = this.enabledButtons.filter((elem) => elem !== document.id);
          this.enabledButtons = [ ...newArray];
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
      })
    }
  }

  isButtonOfDocDisabled(document: Document) {
    const finded = this.enabledButtons.find((el) => el === document.id);
    if(finded) {
      if (document.doctype.arrayOfImages) {
        const filtered = document.doctype.arrayOfImages.filter(ev => ev.oid !== -1 && ev.file !== '')

        if(filtered && filtered.length === document.doctype.images) {
          return false;
        } else {
          return true;
        }
      }
    }

    return true;
  }

  save(document: Document) {
    this.isLoading = true;
    document.expirity_date = this.formatDate(document.formDateControl.value);
    this.uploadDataOnApollo(document);
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

  get documents(): Document[] {
    return this.customerService.customer.documents;
  }
}
