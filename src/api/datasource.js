import request from '@/utils/request'

export function datasourceList(params) {
  return request({
    url: '/datasource/list',
    method: 'get',
    params: params
  })
}

export function datasourceAdd(data) {
  return request({
    url: '/datasource/add',
    method: 'post',
    data
  })
}

export function dataExecCommit(data) {
  return request({
    url: '/datasource/exec/commit',
    method: 'post',
    data
  })
}

export function dataExecGet(params) {
  return request({
    url: '/datasource/exec/get',
    method: 'get',
    params
  })
}

export function dataExecList(params) {
  return request({
    url: '/datasource/exec/list',
    method: 'get',
    params
  })
}

export function dataExecPass(data) {
  return request({
    url: '/datasource/exec/pass',
    method: 'post',
    data
  })
}

export function dataExecReject(data) {
  return request({
    url: '/datasource/exec/reject',
    method: 'post',
    data
  })
}

export function dataExecExecute(data) {
  return request({
    url: '/datasource/exec/execute',
    method: 'post',
    data
  })
}
