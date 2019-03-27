import request from '@/utils/request'

export function appList(params) {
  return request({
    url: '/app/list',
    method: 'get',
    params: params
  })
}

export function appGet(params) {
  return request({
    url: '/app/get',
    method: 'get',
    params
  })
}

export function appAdd(data) {
  return request({
    url: '/app/add',
    method: 'post',
    data
  })
}

export function instanceList(params) {
  return request({
    url: '/app/instances',
    method: 'get',
    params
  })
}

export function appMemberAdd(data) {
  return request({
    url: '/app/member/add',
    method: 'post',
    data
  })
}
