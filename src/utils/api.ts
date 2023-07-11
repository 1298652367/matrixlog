import http, { AxiosRequestConfig } from 'axios';

export const log_analysis = (data: File) => {
  const formData = new FormData();
  formData.append('file', data);

  const config: AxiosRequestConfig<FormData> = {
    url: '/logmatrix/log_analysis',
    method: 'post',
    data: formData
  };

  return http(config);
};