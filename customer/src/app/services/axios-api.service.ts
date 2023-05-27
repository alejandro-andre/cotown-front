import { Injectable } from '@angular/core';
import axios from 'axios';

import { ApoloQueryApi } from './Apollo-api.service';
import { PayloadFile } from '../constants/Interface';

const axiosInstance = axios.create({
  baseURL: 'https://experis.flows.ninja/'
});

@Injectable({
  providedIn: 'root'
})

export class AxiosApi {
  constructor(private apollo: ApoloQueryApi){}

  uploadFile(payload: PayloadFile) {
    const token = this.apollo.token;
    const url = `/document/Customer_doc/Document/${payload.id}/Document/contents?access_token=${token}`;
    return axiosInstance.post(url, { file: payload.file })
  }

  get(url: string) {
    const params: any = {
      token: this.apollo.token
    }

    return axios.get(url, params);
  }


  uploadImage(payload: PayloadFile) {
    const token = this.apollo.token;
    const url = `/document/Customer/Customer/${payload.id}/Photo/contents?access_token=${token}`;
    return axiosInstance.post(url, { file: payload.file })
  }

  getFile(id: number, type: string) {
    const token = this.apollo.token;
    const url = `wopi/files/Customer/Customer_doc/${id}/${type}/contents?access_token=${token}`;
    return axiosInstance.get(url, { responseType: 'blob' });
  }

  getInvoice(id: number) {
    const token = this.apollo.token;
    const url = `wopi/files/Billing/Invoice/${id}/Document/contents?access_token=${token}`;
    return axiosInstance.get(url, { responseType: 'blob' });
  }

  getContract(id: number, type: string) {
    const token = this.apollo.token;
    const url = `wopi/files/Booking/Booking/${id}/${type}/contents?access_token=${token}`;
    return axiosInstance.get(url, { responseType: 'blob' });
  }
};
