import { Injectable } from '@angular/core';
import axios from 'axios';

import { ApolloQueryApi } from './apollo-api.service';
import { PayloadFile } from '../constants/Interface';

const axiosInstance = axios.create({
  baseURL: 'https://experis.flows.ninja/'
});

const secondInstance = axios.create({
  baseURL: 'https://dev.cotown.ciber.es/api/v1',
});

@Injectable({
  providedIn: 'root'
})

export class AxiosApi {
  constructor(private apollo: ApolloQueryApi){}

  uploadFile(payload: PayloadFile) {
    const token = this.apollo.token;
    const url = `/document/Customer/Customer_doc/${payload.id}/${payload.document}/contents?access_token=${token}`;
    return axiosInstance.post(url, { file: payload.file }, { headers: { 'Content-Type': 'multipart/form-data' } } )
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
    return axiosInstance.post(url, { file: payload.file }, { headers: { 'Content-Type': 'multipart/form-data' } } )
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

  discartBooking(id: number) {
    const token = this.apollo.token;
    return secondInstance.get(`/booking/${id}/status/descartada?access_token=${token}`);
  }
};
