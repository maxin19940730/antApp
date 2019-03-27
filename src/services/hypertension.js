import { request, config } from '../utils';
const { api={} }= config

//获取高血压基本信息列表
export async function getBaseList (params) {
  return request(api.hypertensionBaseList, {
    method: 'GET',
    body: params,
  })
}

//获取高血压基本信息列表
export async function getHList (params) {
  return request(api.hypertensionHList, {
    method: 'GET',
    body: params,
  })
}

export async function addHypertension (params) {
  return request(api.hypertensionAdd, {
    method: 'POST',
    body: params,
  })
}

export async function updateHypertension (params) {
  return request(api.hypertensionUpdate, {
    method: 'PUT',
    body: params,
  })
}


export async function getDetail (params) {
  return request(api.hypertensionDetail, {
    method: 'GET',
    body: params,
  })
}

export async function del (params) {
  return request(api.hypertensionDel, {
    method: 'DELETE',
    body: params,
  })
}
