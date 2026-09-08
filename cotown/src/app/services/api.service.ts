import Axios, { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';
import { environment } from 'src/environments/environment';

// Core / airflows server (serves files via wopi)
const airflowsInstance = Axios.create({
  baseURL: environment.baseURL,
});

export default {

  getAvailability(data: AvailabilityPayload, token: string): Promise<AxiosResponse> {
    return axiosInstance.post('availability', data, { params: { 'access_token': token } } );
  },

  getOperations(token: string): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard', { params: { 'access_token': token } } );
  },

  getOperationsBookings(status: string, token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/' + status, { params: params });
  },

  getOperationsPrevNext(token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/prevnext', { params: params });
  },

  getLauBookings(type: string, token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboardlau/' + type, { params: params });
  },

  getPayments(token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/payments', { params: params });
  },

  getDeposits(token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/deposits', { params: params });
  },

  getIncasol(token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/incasol', { params: params });
  },

  getDocuments(status: string, token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/documents/' + status, { params: params });
  },

  getDocumentFile(id: number, field: string, token: string): Promise<AxiosResponse> {
    return airflowsInstance.get('wopi/files/Customer/Customer_doc/' + id + '/' + field + '/contents?access_token=' + token, { responseType: 'blob' });
  },

  getLabels(id: number | string, locale: string, token: string): Promise<AxiosResponse> {
    return axiosInstance.get('labels/' + id + '/' + locale, { params: { 'access_token': token } } );
  }

}
