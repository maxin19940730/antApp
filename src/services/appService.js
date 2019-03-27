import request from '../utils/request';
//延迟1s执行函数
export function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export async function getDic (params) {
  return request('/dic/detail', {
    method: 'GET',
    body: params,
  })
}
