import Axios from 'axios';

export default Axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json'
});
