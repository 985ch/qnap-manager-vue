import request from '@/utils/request'

export function getConfig() {
  return request({
    url: '/system/configuration',
    method: 'get'
  })
}
export function setArchivePath(list) {
  return request({
    url: '/system/setArchivePath',
    method: 'post',
    data: { paths: JSON.stringify(list) }
  })
}
export function setTitlesPath(list) {
  return request({
    url: '/system/setTitlesPath',
    method: 'post',
    data: { paths: JSON.stringify(list) }
  })
}
