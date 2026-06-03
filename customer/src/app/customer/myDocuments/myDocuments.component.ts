import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/Constants';
import { IDocFile, IDocument, IPayloadFile } from 'src/app/constants/Interface';
import { Document } from 'src/app/models/Document.model';

import { CREATE_CUSTOMER_DOCUMENT, CREATE_CUSTOMER_FULL_DOCUMENTS, UPDATE_CUSTOMER_DOC_OPTION, UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_FULL_DOCUMENTS } from 'src/app/schemas/query-definitions/customer.query';
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
    private readonly fileService: FileService,
    private readonly datePipe: DatePipe,
    private readonly router: Router,
    private readonly axiosApi: AxiosApi,
    private readonly Apollo: ApolloQueryApi,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getDocs();
  }

  // Check current language
  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }

  getDocumentName(document: IDocument): string {
    if (this.customerService.customer.appLang === Constants.SPANISH.id)
      return document.doc_type?.name || '';
    return document.doc_type?.name_en || '';
  }

  // Show document or image
  getDocs() {

    // New array
    this.documents = [];


    console.log(this.customerService.customer.documents);
    
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

    this.documents.sort((a, b) => (a.doc_type?.id || 0) - (b.doc_type?.id || 0));

  }

  async upload (event: any, field: string, document: IDocument) {
    
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
      this.customerService.customer.documents = this.documents;
    });
  }

  isReadOnly(document: IDocument) {
    return !!document.approved;
  }

  canAddMore(document: IDocument): boolean {
    if (!document.doc_type?.multiple) return false;
    if (!document.id || !document.front?.oid) return false;
    return !this.documents.some(d => d.doc_type?.id === document.doc_type?.id && !d.id);
  }

  addMore(document: IDocument): void {
    this.documents.push(new Document({
      id: 0,
      expiry_date: null,
      doc_type: document.doc_type,
      booking_id: document.booking_id
    } as IDocument));
  }

  subtypeChanged(document: IDocument): boolean {
    return document.doc_option_id !== document.original_doc_option_id;
  }

  isSaveEnabled(document: IDocument) {
    const hasExisting = !!document.front?.oid;
    const subtypeOnly = hasExisting && this.subtypeChanged(document);
    if (!document.frontFile && !subtypeOnly)
      return false;
    const images = document.doc_type?.images || 0;
    if (images > 1 && !document.backFile && !subtypeOnly)
      return false;
    if ((document.doc_type?.options?.length || 0) >= 2 && !document.doc_option_id)
      return false;
    if (document.doc_type?.expires && !document.formDateControl.value)
      return false;
    return true;
  }

  save (document: IDocument) {

    // Expiration date
    document.expiry_date = this.datePipe.transform(document.formDateControl.value, 'yyyy-MM-dd');

    const isNew = !document.id;
    const isFull = (document.doc_type?.images || 1) > 1;

    let query;
    let variables: any;
    if (isNew) {
      query = isFull ? CREATE_CUSTOMER_FULL_DOCUMENTS : CREATE_CUSTOMER_DOCUMENT;
      variables = { customer_id: this.customerService.customer.id, doc_type_id: document.doc_type?.id, booking_id: document.booking_id ?? null, date: document.expiry_date, doc_option_id: document.doc_option_id ?? null };
    } else if (document.frontFile) {
      query = isFull ? UPLOAD_CUSTOMER_FULL_DOCUMENTS : UPLOAD_CUSTOMER_DOCUMENT;
      variables = { id: document.id, date: document.expiry_date, doc_option_id: document.doc_option_id ?? null };
    } else {
      query = UPDATE_CUSTOMER_DOC_OPTION;
      variables = { id: document.id, date: document.expiry_date, doc_option_id: document.doc_option_id ?? null };
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

    this.isLoading = true;
    this.Apollo.setData(query, variables).subscribe({

      next: (response) => {
        this.isLoading = false;
        const value = response.data;
        const result = Array.isArray(value?.data) ? value.data[0] : value?.data;
        if (result?.id) {
          if (isNew) document.id = result.id;
          document.frontFile = undefined;
          document.original_doc_option_id = document.doc_option_id;
        } else {
          this.modalService.openModal({title: 'Error', message: 'unknown_error', type: 'ok' });
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