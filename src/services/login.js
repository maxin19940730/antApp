import { request, config } from '../utils';
const { api={} }= config

export async function login (params) {
  return request(api.login, {
    method: 'POST',
    body: params,
  })
}
