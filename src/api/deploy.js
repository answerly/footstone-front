import request from '@/utils/request'

export function moduleList(params) {
  return request({
    url: '/deploy/modules',
    method: 'get',
    timeout: 100000,
    params
  })
}

export function moduleDeploy(data) {
  return request({
    url: '/deploy/packaging',
    method: 'post',
    timeout: 100000,
    data
  })
}
