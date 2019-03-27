import request from '@/utils/request'

export function propertiesList(params) {
  return request({
    url: '/properties/list',
    method: 'get',
    params: params
  })
}

export function propertiesAdd(data) {
  return request({
    url: '/properties/add',
    method: 'post',
    data
  })
}

export function propertiesEdit(data) {
  return request({
    url: '/properties/edit',
    method: 'post',
    data
  })
}

export function propertiesPublish(data) {
  return request({
    url: '/properties/publish',
    method: 'post',
    data
  })
}

export function propertiesOffline(data) {
  return request({
    url: '/properties/offline',
    method: 'post',
    data
  })
}

export function systemPropertiesList(params) {
  return request({
    url: '/properties/system/list',
    method: 'get',
    params: params
  })
}

export function systemPropertiesAdd(data) {
  return request({
    url: '/properties/system/add',
    method: 'post',
    data
  })
}
