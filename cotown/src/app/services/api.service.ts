import { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';

export default {
  getAvailability(data: AvailabilityPayload): Promise<AxiosResponse> {
    return axiosInstance.post('availability',  data);
  },

  getPaymentInfo(id: number): Promise<AxiosResponse> {
    return axiosInstance.get(`/pay/${id}`);
  }
}
