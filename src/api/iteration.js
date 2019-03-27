import request from '@/utils/request'

export function iterationList(params) {
  return request({
    url: '/iteration/list',
    method: 'get',
    params
  })
}

export function iterationAdd(data) {
  return request({
    url: '/iteration/add',
    method: 'post',
    data
  })
}
