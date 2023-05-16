import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Buffer} from 'buffer';

import { DocFile, Document, PayloadFile } from 'src/app/constants/Interface';
import { UPDATE_EXPERITY_DATE, UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_DOCUMENT_BACK } from 'src/app/schemas/query-definitions/customer.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { CustomerService } from 'src/app/services/customer.service';

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
    private apolo: ApoloQueryApi
  ) {}

  public disabledButtons: number[] = [] as number[];
  public pdfSrc = '';


  viewDoc(doc: DocFile) {
    this.axiosApi.getFile(doc.id, doc.type).then((response: any) => {
      this.pdfSrc = response.data;

      //debugger;
      //this.readFile(response.data);
    })
  }

  onFileSelected() {
    let $img: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };
  
      reader.readAsArrayBuffer($img.files[0]);
    }
  }
  readFile(file: any) {

    const base64Str = Buffer.from(file).toString('base64');
    const binaryString = window.atob(base64Str);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = base64Str.charCodeAt(i);
      bytes[i] = ascii;
    }

    const arrBuffer = bytes;
    const newBlob = new Blob([arrBuffer], { type: "application/pdf" });

    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Hello: ',e)
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc)
      };

      reader.readAsArrayBuffer(newBlob)
    }

    console.log(newBlob)
  }

  completed(){
    console.log('Carga completada \n')
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
      this.apolo.setData(query, variables).subscribe((response) => {
        const value = response.data;
        if (value && value.data && value.data.length && value.data[0].id) {
          console.log('Subida realizada con exito: ', value.data[0]);
        } else {
          console.log('Algo ha ido mal!!', response);
        }
      });

    })
  }

  isButtonOfDocDisabled(document: Document) {
    const finded = this.disabledButtons.find((el) => el === document.id);

    return finded === undefined;
  }

  save(document: Document) {
    document.expirity_date = this.formatDate(document.formDateControl.value);
    const newArray = this.disabledButtons.filter((elem) => elem !== document.id);
    this.disabledButtons = [ ...newArray];
    const variables = {
      id: document.id,
      value: document.expirity_date
    }

    this.apolo.setData(UPDATE_EXPERITY_DATE, variables).subscribe((response) => {
      console.log('The response is: ', response);
    })

    // SAVE SECTION
    console.log(document)
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
