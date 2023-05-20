import { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';

export default {

  getAvailability(data: AvailabilityPayload, token: string): Promise<AxiosResponse> {
    return axiosInstance.post('availability', data);
  },

  getDashboard(token: string): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard');
  },

  getDashboardBookings(status: string, token: string): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard/' + status);
  },

  getLabels(id: number, locale: string, token: string): Promise<AxiosResponse> {
    return axiosInstance.get('labels/' + id + '/' + locale);
  }

}
