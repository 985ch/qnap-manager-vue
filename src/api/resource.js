import request from '@/utils/request'

export function getList() {
  return request({
    url: '/resource/list',
    method: 'get'
  })
}

export function getScanHistory() {
  return request({
    url: '/resource/scanHistory',
    method: 'get'
  })
}
