import http, { AxiosRequestConfig } from 'axios';

export const log_analysis = (data: File) => {

  const config: AxiosRequestConfig<Object> = {
    url: '/api/logmatrix/log_analysis',
    method: 'post',
    data: {
      file:data.response?.file
    }
  };

  return http(config);
};