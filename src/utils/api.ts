import http, { AxiosRequestConfig } from 'axios';

export const log_analysis = (data: File) => {
  //const formData = new FormData();
  //formData.append('file', data);

  const config: AxiosRequestConfig<Object> = {
    url: '/api/logmatrix/log_analysis',
    method: 'post',
    //data: formData
    data: {
      file:data.response?.file
    }
  };

  return http(config);
};