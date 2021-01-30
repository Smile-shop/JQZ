import axios from 'axios';

const service = axios.create({
  timeout: 3000
});

service.interceptors.request.use((config: object): object => {
  return config;
}, (error: any): object => {
  return Promise.reject(error);
});

service.interceptors.response.use((response: any) => {
  const res = response.data;
  if (res.error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(res);
    }
    return Promise.reject(res);
  }
  return Promise.resolve(res);
});

export default service;
