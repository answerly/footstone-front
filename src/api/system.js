import request from '@/utils/request'

export function profileList() {
  return request({
    url: '/system/profiles',
    method: 'get'
  })
}

export function gitlabUrl() {
  return request({
    url: '/system/gitlab/url',
    method: 'get'
  })
}

export function groupList() {
  return request({
    url: '/system/groups',
    method: 'get'
  })
}

export function dataExecStateList() {
  return request({
    url: '/system/dataExecState',
    method: 'get'
  })
}

export function dataExecTypeList() {
  return request({
    url: '/system/dataExecType',
    method: 'get'
  })
}
