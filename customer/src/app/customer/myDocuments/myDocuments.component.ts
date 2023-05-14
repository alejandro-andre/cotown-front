import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Document, PayloadFile } from 'src/app/constants/Interface';
import { UPLOAD_CUSTOMER_DOCUMENT, UPLOAD_CUSTOMER_DOCUMENT_BACK } from 'src/app/schemas/query-definitions/customer.query';
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

  upload(event: any, doc: any, index: number) {
    console.log(index);
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

  get documents(): Document[] {
    return this.customerService.customer.documents;
  }
}
