import http from './http';

export const log_analysis = (data: File) => {
  return http({
    url: '/logmatrix/log_analysis',
    method: 'post',
    auth_flag: false,
    data
  })
}
  