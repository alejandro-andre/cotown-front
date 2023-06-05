import { environment } from '../../environments/environment';
import Axios from 'axios';

export const axiosInstance  = Axios.create({
  baseURL: environment.backURL,
});
