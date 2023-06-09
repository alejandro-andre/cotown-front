import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { IDocFile, IDocument, IPayloadFile } from 'src/app/constants/Interface';
import { Document } from 'src/app/models/Document.model';

import { UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_FULL_DOCUMENTS } from 'src/app/schemas/query-definitions/customer.query';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FileService } from 'src/app/services/file.service';
import { ModalService } from 'src/app/services/modal.service';
import { formatErrorBody } from 'src/app/utils/error.util';

@Component({
  selector: 'app-documents',
  templateUrl: './myDocuments.component.html',
  styleUrls: ['./myDocuments.component.scss']
})

export class MyDocumentsComponent implements OnInit {

  // Spinner
  public isLoading = false;

  // Documents
  public documents: IDocument[] = [];

  constructor(
    public customerService: CustomerService,
    private fileService: FileService,
    private datePipe: DatePipe,
    private router: Router,
    private dateAdapter: DateAdapter<any>,
    private axiosApi: AxiosApi,
    private Apollo: ApolloQueryApi,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.customerService.customer.appLang === 'es') {
      this.dateAdapter.setLocale(Constants.SPANISH.locale)
    } else {
      this.dateAdapter.setLocale(Constants.ENGLISH.locale)
    }
    this.getDocs();
  }
  
  getDocumentName(document: IDocument): string {
    if (this.customerService.customer.appLang === 'es')
      return document.doc_type?.name || '';
    return document.doc_type?.name_en || '';
  }

  // Show document or image
  getDocs() {

    // New array
    this.documents = [];

    // Loop thru documents
    this.customerService.customer.documents.forEach((doc) => {

      // Create object
      const document = new Document(doc);
      const images = document.doc_type?.images || 1;

      // Front doc
      if (document.front?.oid) {
        this.axiosApi.getFile(document.id, "Document").then((response: any) => {
          document.front = {
            id: document.id || 0,
            name: document.front?.name || '',
            oid: document.front?.oid || 0,
            type: response.data.type,
            size: response.data.size,
            thumbnail: null,
            content: URL.createObjectURL(response.data)
          }
        })
      }

      // Back doc
      if (document.back?.oid) {
        this.axiosApi.getFile(doc.id, "Document_back").then((response: any) => {
          document.back = {
            id: document.id || 0,
            name: document.back?.name || '',
            oid: document.back?.oid || 0,
            type: response.data.type,
            size: response.data.size,
            thumbnail: null,
            content: URL.createObjectURL(response.data)
          }
        })
      }

      // Push new document
      this.documents.push(document);
    });

  }

  async upload (event: any, field: string, document: IDocument) {
    
    console.log(document);
    
    // Read file
    const file = event.target.files[0] 
    const data = await this.fileService.readFile(file);

    // Thumbnail
    const uint8Array = new Uint8Array(data);
    const array = Array.from(uint8Array);
    const base64String = btoa(array.map(byte => String.fromCharCode(byte)).join(''));
    const imageSrc = `data:${file.type};base64,${base64String}`;

    // Show file on screen
    event.target.src = imageSrc;

    // Call API
    const payload: IPayloadFile  = {
      id: document.id,
      data: data,
      type: file.type,
    };
    this.axiosApi.uploadFile(payload, field).then((res) => {     
      const docFile: IDocFile = {
        id: document.id || 0,
        oid: res.data,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        content: imageSrc,
        thumbnail: file.type === Constants.DOCUMENT_PDF ? null : imageSrc
      }
      if (field === 'Document') {
        document.front = docFile;
      } else {
        document.back = docFile;
      }
    });
  }

  isReadOnly(document: IDocument) {
    if (document.front && !document.frontFile)
      return true;
    if (document.back && !document.backFile)
      return true;
    return false;
  }

  isSaveEnabled(document: IDocument) {
    if (!document.frontFile)
      return false;
    const images = document.doc_type?.images || 0;
    if (images > 1 && !document.backFile)
      return false;
    return true;
  }

  save (document: IDocument) {

    // Spinner
    this.isLoading = true;

    // Expiration date
    document.expiry_date = this.datePipe.transform(document.formDateControl.value, 'yyyy-MM-dd');

    // Query
    const query = document.doc_type?.images === 1 ? UPLOAD_CUSTOMER_DOCUMENT : UPLOAD_CUSTOMER_FULL_DOCUMENTS;
    let variables: any = {
      id: document.id,
      date:document.expiry_date
    }
    if (document.frontFile) {
      variables.fileFront = {
        name: document.front?.name,
        oid: document.front?.oid,
        type: document.front?.type,
        thumbnail: document.front?.thumbnail
      }
    }
    if (document.backFile) {
      variables.fileBack = {
        name: document.back?.name,
        oid: document.back?.oid,
        type: document.back?.type,
        thumbnail: document.back?.thumbnail
      }
    }
 
    this.Apollo.setData(query, variables).subscribe({

      next: (response) => {
        this.isLoading = false;
        const value = response.data;
        if (value && value.data && value.data.length && value.data[0].id) {
          delete document.frontFile;
          delete document.backFile;
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknownError'});
        }
      },

      error: (err) => {
        this.isLoading = false;
        const bodyToSend = formatErrorBody(err, this.customerService.customer.appLang || 'es')
        this.modalService.openModal(bodyToSend);
      }
    })
  }

}