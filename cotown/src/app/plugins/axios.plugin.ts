import Axios from 'axios';

export const axiosInstance  = Axios.create({
  baseURL: 'https://dev.cotown.ciber.es/',
});
