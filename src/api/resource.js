import request from '@/utils/request'

export function getList() {
  return request({
    url: '/resource/list',
    method: 'get'
  })
}
