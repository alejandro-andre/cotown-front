import { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';

export default {

  getAvailability(data: AvailabilityPayload): Promise<AxiosResponse> {
    return axiosInstance.post('availability',  data);
  },

  getDashboard(): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard');
  },

  getBookings(status: string): Promise<AxiosResponse> {
    return axiosInstance.get('dashboard/' + status);
  },

  getLabels(id: number, locale: string): Promise<AxiosResponse> {
    return axiosInstance.get('labels/' + id + '/' + locale);
  }

}
