import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import store from '../index';


const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    // mode: 'no-cors',
  };
  // const baseURL = 'http://192.168.100.232:18185/api';
  // let newUrl = baseURL + url;
  let newUrl = url;
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  if (newOptions.method === 'GET') {
    if (newOptions.body) {
      const str = `?${stringify(newOptions.body, { encode: false, arrayFormat: 'brackets' })}`;
      newUrl += str;
      delete newOptions.body;
    }
  }
  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.json();
        // .text改为json 乔远
      }
      return response.json();
    })
    .catch((error) => {
      // const { response } = error
      const { dispatch } = store;
      const status = error.name;
      if (status === 504) {
        dispatch(routerRedux.push('/'));
        return;
      }
      return
      // if (status === 401) {
      //   dispatch({
      //     type: 'login/logout',
      //   });
      //   return;
      // }
      // if (status === 403) {
      //   dispatch(routerRedux.push('/'));
      //   return;
      // }
      // if (status <= 504 && status >= 500) {
      //   dispatch(routerRedux.push('/exception/500'));
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
    });
}
