import { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';

export default {

  getAvailability(data: AvailabilityPayload, token: string): Promise<AxiosResponse> {
    return axiosInstance.post('availability', data, { params: { 'access_token': token } } );
  },

  getDashboard(token: string): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard', { params: { 'access_token': token } } );
  },

  getDashboardBookings(status: string, token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/' + status, { params: params });
  },

  getDashboardPrevNext(token: string, params: any): Promise<AxiosResponse> {
    params['access_token'] = token;
    return axiosInstance.get('dashboard/prevnext', { params: params });
  },

  getLabels(id: number, locale: string, token: string): Promise<AxiosResponse> {
    return axiosInstance.get('labels/' + id + '/' + locale, { params: { 'access_token': token } } );
  }

}
