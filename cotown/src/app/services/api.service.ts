import { AxiosResponse } from 'axios';
import { axiosInstance } from '../plugins/axios.plugin';
import { AvailabilityPayload } from '../constants/Interfaces';

export default {
  getAvailability(data: AvailabilityPayload): Promise<AxiosResponse> {
    return axiosInstance.post('availability',  data);
  },
}
