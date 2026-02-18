import { Injectable } from '@angular/core';
import axios from 'axios';

import { IPayloadFile } from '../constants/Interface';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

const airflowsInstance = axios.create({
  baseURL: environment.baseURL
});

const backendInstance = axios.create({
  baseURL: environment.backURL
});

@Injectable({
  providedIn: 'root'
})

export class AxiosApi {
  constructor(private tokenService: TokenService){}

  uploadFile(payload: IPayloadFile, field: string) {
    const token = this.tokenService.token;
    const url = `/document/Customer/Customer_doc/${payload.id}/${field}/contents?access_token=${token}`;
    return airflowsInstance.post(url, payload.data, { headers: { 'Content-Type': payload.type } } )
  }

  get(url: string) {
    const params: any = {
      token: this.tokenService.token
    }
    return axios.get(url, params);
  }

  uploadImage(payload: IPayloadFile) {
    const token = this.tokenService.token;
    const url = `/document/Customer/Customer/${payload.id}/Photo/contents?access_token=${token}`;
    return airflowsInstance.post(url, payload.data, { headers: { 'Content-Type': payload.type } } )
  }

  getFile(id: number, type: string) {
    const token = this.tokenService.token;
    const url = `wopi/files/Customer/Customer_doc/${id}/${type}/contents?access_token=${token}`;
    return airflowsInstance.get(url, { responseType: 'blob' });
  }

  getFileFromUrl(url: string) {
    const token = this.tokenService.token;
    url += `?access_token=${token}`;
    return backendInstance.get(url, { responseType: 'blob' });
  }

  getPdf(id: number, type: string) {
    const token = this.tokenService.token;
    const url = `wopi/files/Booking/Booking_doc/${id}/${type}/contents?access_token=${token}`;
    return airflowsInstance.get(url, { responseType: 'blob' });
  }

  getInvoice(id: number) {
    const token = this.tokenService.token;
    const url = `wopi/files/Billing/Invoice/${id}/Document/contents?access_token=${token}`;
    return airflowsInstance.get(url, { responseType: 'blob' });
  }

  getContract(id: number, type: string) {
    const token = this.tokenService.token;
    const url = `wopi/files/Booking/Booking/${id}/${type}/contents?access_token=${token}`;
    return airflowsInstance.get(url, { responseType: 'blob' });
  }

  validateIBAN(code: string): any {
    code = code.replace(/\//g, "_");
    return backendInstance.get(`/iban/${code}`);
  }

  validateSWIFT(code: string): any {
    code = code.replace(/\//g, "_");
    return backendInstance.get(`/swift/${code}`);
  }

  discardBooking(id: number, status: string) {
    const token = this.tokenService.token;
    return backendInstance.get(`/booking/${id}/status/${status}?access_token=${token}`);
  }

  answerQuestionnaire(id: number, questions: any[], issues: string) {
    const data: any = {}
    data.questions = questions;
    if (issues)
      data.issues = issues;
    return backendInstance.post(`/questionnaire/${id}`, data, { headers: { 'Content-Type': 'application/json'} } );
  }

};
