import { Injectable } from '@angular/core';
import axios from 'axios';

import { ApoloQueryApi } from './apolo-api.service';
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
    const url = `/document/Customer.Customer_doc/Document/${payload.id}/Documents/contents?access_token=${token}`;
    return axiosInstance.post(url, { file: payload.file })
  }

  getFile(id: number, type: string) {
    const token = this.apollo.token;
    const url = `wopi/files/Customer/Customer_doc/${id}/${type}/contents?access_token=${token}`;
    return axiosInstance.get(url);
  }
};