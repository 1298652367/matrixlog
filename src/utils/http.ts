import { Modal } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import mitt from 'mitt';

interface MyAxiosRequestConfig extends AxiosRequestConfig {
  donNotShowLoading?: boolean;
  auth_flag?: boolean;
}

const emitter = mitt();

const http = axios.create({
  //baseURL: 'http://172.21.240.26:9999',
  baseURL:"/api",
  timeout: 5000,
});

let activeAxios = 0;
let timer: NodeJS.Timeout;

const showLoading = () => {
  activeAxios++;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      emitter.emit('showLoading');
    }
  }, 400);
};

const closeLoading = () => {
  activeAxios--;
  if (activeAxios <= 0) {
    clearTimeout(timer);
    emitter.emit('closeLoading');
  }
};

// http request 拦截器
http.interceptors.request.use(
  (config: MyAxiosRequestConfig) => {
    if (!config?.donNotShowLoading) {
      showLoading();
    }
    if (config?.auth_flag) {
      config.headers = {
        'Content-Type': 'application/json',
      };
    } else {
      config.data = JSON.stringify(config.data);
      config.headers = {
        'Content-Type': 'application/json',
      };
    }
    return config as InternalAxiosRequestConfig;
  },
  (error: AxiosError) => {
    closeLoading();
    message.error('AxiosError');
    return Promise.reject(error);
  }
);

// http response 拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    closeLoading();
    if (response.headers['new-token']) {
      // ...
    }

    var obj = response.data;
    if (obj != undefined) {
      if (obj['accessToken']) {
        return response.data;
      }
    }

    if (response.data.code === 0 || response.headers.success === 'true') {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg);
      }
      return response.data;
    } else {
      message.error(response.data.msg);
      if (response.data.data && response.data.data.reload) {
        // ...
      }
      return response.data.msg ? response.data : response;
    }
  },
  (error: AxiosError) => {
    closeLoading();
    switch (error.response?.status) {
      case 500:
        message.error('接口报错500,请检查后台');
        Modal.confirm({
          title: '检测到接口错误500',
          content:
            ' 此类错误内容常见于后台panic,请先查看后台日志,如果影响您正常使用可强制登出清理缓存',
        });
        break;
      case 404:
        message.error('接口报404,请检查接口');
        Modal.confirm({
          title: '检测到接口错误404',
          content:
            '此类错误多为接口未注册(或未重启)或者请求路径(方法)与api路径(方法)不符--如果为自动化代码请检查是否存在空格',
        });
        break;
    }
    return Promise.reject(error);
  }
);

export default http;