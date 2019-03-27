import { request, config } from '../utils';
const { api={} }= config

export async function getList (params) {
  return request(api.baseInfoList, {
    method: 'GET',
    body: params,
  })
}

export async function getDetail (params) {
  return request(api.getBaseInfo, {
    method: 'GET',
    body: params,
  })
}

export async function addBaseInfo (params) {
  return request(api.addBaseInfo, {
    method: 'POST',
    body: params,
  })
}

export async function updateBaseInfo (params) {
  return request(api.updateBaseInfo, {
    method: 'PUT',
    body: params,
  })
}

export async function delBaseInfo (params) {
  return request(api.delBaseInfo, {
    method: 'DELETE',
    body: params,
  })
}
