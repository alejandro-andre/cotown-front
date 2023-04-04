import { axiosInstance } from '../plugins/axios.plugin';

export const getAvailability = () => {
  console.log('Estoy en el availability');
  const data = {
    "date_from": "2023-05-01",
    "date_to": "2023-06-01",
    "building": "BLM335",
    "place_type": "I_STA"
  };

  axiosInstance.post('availability',  data  ).then((resp) => {
    console.log(resp);
  })
}
