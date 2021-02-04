import Axios from 'axios';

const service = Axios.create({
  baseURL: 'http://localhost:8088',
});

service.interceptors.request.use((config) => {
  const conf = config;
  conf.timeout = 3000;
  return conf;
}, (error) => {
  console.log(error);
});
service.interceptors.response.use((response) => response.data, (error) => {
  Promise.reject(error);
});

export default service;
