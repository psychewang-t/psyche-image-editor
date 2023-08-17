import axios from 'axios';

axios.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: any) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // eslint-disable-next-line no-magic-numbers
    if (error.response.status === 404) {
      // 如果返回 404 错误，表示请求的资源不存在，做相应的处理
      console.error('请求的资源不存在');
    }

    // eslint-disable-next-line no-magic-numbers
    if (error.response.status === 400) {
      // 如果返回 400 错误，表示请求的资源错误
      console.error(error?.response?.data || '请求错误');
    }

    // eslint-disable-next-line no-magic-numbers
    if (error.response.status === 500) {
      // 如果返回 500 错误，表示请求的资源错误
      console.error(error?.response?.data || '意外错误');
    }

    return Promise.reject(error);
  }
);
